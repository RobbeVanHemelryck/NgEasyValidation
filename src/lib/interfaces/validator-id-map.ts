import { ValidatorFn } from '@angular/forms';

export interface ValidatorIdMap{
    validator: ValidatorFn;
    id: string;
}