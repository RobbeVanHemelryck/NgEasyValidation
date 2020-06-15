import { ValidatorFn } from "@angular/forms";
import { ValidatorId } from './validator-id';

export class ValidatorConfig {
    identifier: ValidatorId | string;
    validator: ValidatorFn;
    message: string = "";
    showErrorsOnInit: boolean = false;

    constructor(identifier: ValidatorId | string, validator: ValidatorFn, message: string = "", showErrorsOnInit: boolean = false) {
        this.validator = validator;
        this.identifier = identifier;
        this.message = message,
        this.showErrorsOnInit = showErrorsOnInit;
    }
}