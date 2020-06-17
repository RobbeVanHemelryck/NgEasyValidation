import { ValidatorFn } from '@angular/forms';

export class ValidatorInfo{
    validator: ValidatorFn;
    id: string;
    alwaysEvaluate: boolean;

    constructor(validator: ValidatorFn, id: string, alwaysEvaluate: boolean = false){
        this.validator = validator;
        this.id = id;
        this.alwaysEvaluate = alwaysEvaluate;
    }
}