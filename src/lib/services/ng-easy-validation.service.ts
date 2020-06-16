import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { ValidatorConfig } from "../interfaces/validator-config";
import { FormGroup, AbstractControl } from "@angular/forms";
import { ValidatorId } from '../interfaces/validator-id';

@Injectable()
export class NgEasyValidationService {
    validationResultSubject: Subject<ValidationResult[]> = new Subject<ValidationResult[]>(); 

    validate(requirements: {[key: string]: ValidatorConfig[]}, formGroup: FormGroup): ValidationResult[]{
        let result: ValidationResult[] = [];

        for(let field in formGroup.controls){
            const control: AbstractControl = formGroup.controls[field];
            if(!control.errors) continue;

            for(let errorIdentifier in control.errors){
                const config: ValidatorConfig = JSON.parse(JSON.stringify(requirements[field].find(x => x.identifier == errorIdentifier)));
                this.setErrorMessage(field, control, config);
                result.push(new ValidationResult(field, config, !control.dirty && !config.tooltipsOnInit));
            }
        };

        this.validationResultSubject.next(result);
        
        return result;
    }

    private setErrorMessage(field: string, control: AbstractControl, config: ValidatorConfig){
        if(!config.message) config.message = this.generateErrorMessage(field, config.identifier, control.errors[config.identifier]);
        config.message = config.message.replace("<value>", control.value);
    }

    private generateErrorMessage(field: string, requirementType: ValidatorId | string, requirementDetails: any = null): string{
        let errorMessage = "";
        field = field[0].toUpperCase() + field.substr(1);

        switch (requirementType) {
            case ValidatorId.Required:
                errorMessage = `${field} is required`;
                break;
            case ValidatorId.Pattern:
                errorMessage = `${field} isn't in the right format. The format must be: ${requirementDetails.requiredPattern}`;
                break;
            case ValidatorId.Between:
                errorMessage = `${field} must be between ${requirementDetails.min} and ${requirementDetails.max}`;
                break;
            case ValidatorId.Email:
                errorMessage = `${field} must be a valid e-mail address`;
                break;
            case ValidatorId.Max:
                errorMessage = `${field} must be lower than or equal to ${requirementDetails.max}`;
                break;
            case ValidatorId.Min:
                errorMessage = `${field} must be higher than or equal to ${requirementDetails.min}`;
                break;
            case ValidatorId.RequiredTrue:
                errorMessage = `${field} must be selected`;
                break;
            case ValidatorId.MinLength:
                errorMessage = `${field} has a minimum length of ${requirementDetails.requiredLength}`;
                break;
            case ValidatorId.MaxLength:
                errorMessage = `${field} has a maximum length of ${requirementDetails.requiredLength}`;
                break;  
            case ValidatorId.RequiredValues:
                let msg = this.humanizeList(requirementDetails.requiredValues);
                errorMessage = `${field} must be ${msg}`;
                break;
            case ValidatorId.InvalidValues:
                let msg2 = this.humanizeList(requirementDetails.invalidValues);
                errorMessage = `${field} can't be ${msg2}`;
                break;
            case ValidatorId.InvalidCharacters:
                let msg3 = this.humanizeList(requirementDetails.invalidCharacters);
                errorMessage = `${field} can't contain ${msg3}`;
                break;  
            case ValidatorId.SqlObjectName:
                errorMessage = `${field} isn't a valid SQL name`;
                break;
            case ValidatorId.IsInteger:
                errorMessage = `${field} must be an integer`;
                break; 
            case ValidatorId.IsNumeric:
                errorMessage = `${field} must be a numeric`;
                break; 
            case ValidatorId.isAlphaNumeric:
                errorMessage = `${field} must be a alpha numerical`;
                break; 
            default:
                errorMessage = `${field} is invalid`;
                break;
        }
       return errorMessage;
    }

    private humanizeList(values: string[]): string{
        let msg: string = "";
        for (let i = 0; i < values.length; i++) {
            if (i == values.length - 1) msg += " or ";
            msg += "'" + values[i] + "'";
            if(i < values.length - 2) msg += ", ";
        }
        return msg;
    }
}

export class ValidationResult{
    field: string;
    validatorConfig: ValidatorConfig;
    isHidden: boolean;

    constructor(field: string, validatorConfig: ValidatorConfig, isHidden: boolean) {
        this.field = field;
        this.validatorConfig = validatorConfig;
        this.isHidden = isHidden;
    }
}