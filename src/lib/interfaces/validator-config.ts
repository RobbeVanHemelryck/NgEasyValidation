import { ValidatorFn } from "@angular/forms";
import { ValidatorId } from './validator-id';

export class ValidatorConfig {
    identifier: ValidatorId | string;
    validator: ValidatorFn;
    message: string = "";
    tooltipsOnInit: boolean = false;

    constructor(identifier: ValidatorId | string, validator: ValidatorFn, message: string = "", tooltipsOnInit: boolean = false) {
        this.validator = validator;
        this.identifier = identifier;
        this.message = message,
        this.tooltipsOnInit = tooltipsOnInit;
    }
}