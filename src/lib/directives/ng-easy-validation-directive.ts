import { NgForm, AbstractControl } from '@angular/forms';
import { Directive, ElementRef, Input, OnChanges, Output, SimpleChanges, OnInit } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, filter, tap } from 'rxjs/operators';
import { ValidatorConfig } from '../interfaces/validator-config';
import { NgEasyValidationService, ValidationResult } from '../services/ng-easy-validation.service';
import tippy, { DefaultProps } from 'tippy.js';

@Directive({
    selector: '[ngEasyValidation]',
    providers: [NgEasyValidationService]
})
export class NgEasyValidationDirective implements OnInit, OnChanges  {
    private requirements: {[key: string]: ValidatorConfig[]} = {};

    @Input("ngEasyValidation")
    set ngEasyValidation(requirements: {[key: string]: any[]}){
        for(let field in requirements){
            let configs: ValidatorConfig[] = [];

            //Convert passed configurations to ValidatorConfig if they are not already
            for(let config of requirements[field]){
                if(config instanceof ValidatorConfig) configs.push(config);
                else{
                    configs.push(new ValidatorConfig(
                        config.id,
                        config.validator,
                        config.message,
                        config.applyValidationOnInit || false
                    ))
                }
            }
            requirements[field] = configs;
        }

        this.requirements = requirements;
    }

    @Input() useTooltips: boolean = true;
    @Input() tippyProps: Partial<DefaultProps> = {};
    @Input() identifier: string = "";
    @Input() validationDebounceTime: number = 0;

    private invalidClass: string = "validation-error";
    private formId: string;
    private validatorsAdded: boolean = false;
    private validationSubscription: Subscription;
    private tippies: any = {};

    constructor(
        el: ElementRef,
        private validationService: NgEasyValidationService,
        private host: NgForm
    ) {
        this.formId = Math.random().toString(36).substring(2);
        el.nativeElement.setAttribute('formId', this.formId);
    }

    ngOnInit(){
        this.initValidationSubscription();
        this.setDefaultTippyProps();
    }

    private initValidationSubscription(){
        this.validationSubscription = this.host.form.valueChanges
        .pipe(
            debounceTime(this.validationDebounceTime),
            tap(_ => {
                this.validate.bind(this)();
            })
        ).subscribe();
    }

    private setDefaultTippyProps(){
        if(!this.tippyProps.allowHTML) this.tippyProps.allowHTML = true;
        tippy.setDefaultProps(this.tippyProps);
    }

    ngOnDestroy() {
        if(this.validationSubscription) this.validationSubscription.unsubscribe();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if(Object.keys(this.requirements).length == 0) this.validatorsAdded = true;

        if(changes.ngEasyValidation){
            setTimeout(() => {
                this.ngEasyValidation = changes.ngEasyValidation.currentValue;
                this.initFieldConfigurations();
                this.host.form.updateValueAndValidity();
            }, 200);
        }
    }

    private initFieldConfigurations(){
        if(!this.requirements) return;

        this.validatorsAdded = false;

        let inputFields: Element[] = this.getUsableInputFields(this.getFormElement());
        for (let element of inputFields) {
            let field: string = element.getAttribute("name");
            let control: AbstractControl = this.host.form.controls[field];
            
            let isDirty: boolean = this.setFieldIsDirty(this.requirements[field], control);
            this.setFieldValidators(this.requirements[field], control);
            this.setFieldTippy(field, element, isDirty);

            control.updateValueAndValidity();
        }
        this.validatorsAdded = true;
    }
    
    private setFieldIsDirty(requirements: ValidatorConfig[], control: AbstractControl): boolean{
        let hasValue: boolean = control.value && control.value.length > 0;
        let mustValidateOnInit: boolean = requirements && requirements.some(x => x.showErrorsOnInit);
        
        if(hasValue || mustValidateOnInit) control.markAsDirty();
        return hasValue || mustValidateOnInit;
    }

    private setFieldValidators(requirements: ValidatorConfig[], control: AbstractControl){
        let reqsToAdd = [];
        reqsToAdd.push(...requirements.map(x => x.validator));

        control.clearValidators();
        control.setValidators(reqsToAdd);
    }

    private setFieldTippy(field: string, element: Element, isDirty: boolean){
        let instance = this.tippies[field];
        if(!instance){
            instance = tippy(element);
            this.tippies[field] = instance;
            if(!isDirty) setTimeout(instance.disable, 10);
        }
    }

    private validate() {
        if(!this.validatorsAdded) return;
        let formEl: Element = this.getFormElement();
        if(!formEl) return;

        let validationResult: ValidationResult[] = this.validationService.validate(this.requirements, this.host.form);
        let filteredInputFields: Element[] = this.getUsableInputFields(formEl);
        if(this.useTooltips) this.updateFields(filteredInputFields, validationResult)
    }

    private updateFields(inputFields: Element[], allErrors: ValidationResult[]){
        for (let el of inputFields) {
            let field: string = el.getAttribute("name");
            let errors: ValidationResult[] = allErrors.filter(x => x.field == field);
            let hasError: boolean = errors.length == 0 || errors.some(x => x.isHidden);

            this.updateFieldTippy(el, hasError, field, errors);
            this.updateFieldLayout(el, hasError);
        }
    }

    private updateFieldTippy(el: Element, hasError: boolean, field: string, errors: ValidationResult[]){
        let tippyInstance = this.tippies[field];
        if(hasError){
            tippyInstance.disable();
        }
        else{
            let errorMessage: string = this.buildErrorMessage(errors);

            tippyInstance.setContent(errorMessage);
            tippyInstance.enable();

            if(this.isMouseOnElement(el)) tippyInstance.show();
        }
    }

    private updateFieldLayout(el: Element, hasError: boolean){
        let hasClass: boolean = el.classList.contains(this.invalidClass);
        if(hasError && !hasClass){
            el.classList.add(this.invalidClass);
        }
        else if(!hasError && hasClass){
            el.classList.remove(this.invalidClass);
        }
    }

    private isMouseOnElement(element: Element): boolean{
        let hoverEls = document.querySelectorAll("input:hover, textarea:hover, select:hover");
        let hoverEl = hoverEls[hoverEls.length - 1];
        return hoverEl == element && element == document.activeElement;
    }

    private buildErrorMessage(validationResults: ValidationResult[]){
        let errorMessage = "";
        let errorMessages = validationResults.map(x => x.validatorConfig.message || "This field is incorrect") || [];

        if (errorMessages.length > 1) {
            errorMessage += "<ul style='list-style-position:outside;padding-left:18px;margin:0'>";
            for (let msg of errorMessages) {
                errorMessage += "<li>" + msg + "</li>";
            }
            errorMessage += "</ul>";
        }
        if (errorMessages.length == 1) {
            errorMessage = errorMessages[0];
        }
        return errorMessage;
    }

    private getFormElement(): Element{
        return document.querySelectorAll('[formId="' + this.formId + '"]')[0];
    }

    private getUsableInputFields(formElement: Element): Element[]{
        let inputFields = formElement.querySelectorAll("input, textarea, select");
        let filteredInputFields = Array.from(inputFields).filter(x => Object.keys(this.requirements).includes(x.getAttribute("name")));
        return filteredInputFields;
    }
}