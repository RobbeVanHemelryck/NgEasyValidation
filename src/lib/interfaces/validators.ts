import { ValidatorFn, AbstractControl, Validators, AsyncValidatorFn } from "@angular/forms";

//Wrapper methods around Angular's validators
export function required(): ValidatorFn {
    return Validators.required;
}

export function pattern(regex: string): ValidatorFn {
    return Validators.pattern(regex);
}

export function requiredTrue(): ValidatorFn {
    return Validators.requiredTrue;
}

export function nullValidator(): ValidatorFn {
    return Validators.nullValidator;
}

export function minLength(minLength: number): ValidatorFn {
    return Validators.minLength(minLength);
}

export function maxLength(maxLength: number): ValidatorFn {
    return Validators.maxLength(maxLength);
}

export function compose(validators: null): ValidatorFn {
    return Validators.compose(validators);
}

export function composeAsync(validators: AsyncValidatorFn[]): ValidatorFn {
    return Validators.composeAsync(validators);
}

export function email(): ValidatorFn {
    return Validators.email;
}

export function min(min: number): ValidatorFn {
    return Validators.min(min);
}

export function max(max: number): ValidatorFn {
    return Validators.max(max);
}





//Custom validators
export function between(min: number, max: number): ValidatorFn {
    const res =(control: AbstractControl): {[key: string]: any} | null => {
        return control.value && (control.value > max || control.value < min)? {'between': {value: control.value, max: max, min: min}}: null;
    }; 
    return res;
}

export function invalidValues(invalidValues: any[] | any, valueModifier: (any) => any = x => x): ValidatorFn {
    const res = (control: AbstractControl): {[key: string]: any} | null => {
        let controlValue = valueModifier(control.value);
        if (!(invalidValues instanceof Array)) invalidValues = [invalidValues];
        return invalidValues.map(x => typeof x == "string"? x.toLowerCase() : x).includes(typeof controlValue == "string"? controlValue.toLowerCase() : controlValue)? {'invalidValues': {value: controlValue, invalidValues: invalidValues}}: null;
    };
    return res;
}

export function requiredValues(requiredValues: any[] | any, valueModifier: (any) => any = x => x): ValidatorFn {
    const res = (control: AbstractControl): {[key: string]: any} | null => {
        let controlValue = valueModifier(control.value);
        if (!(requiredValues instanceof Array)) requiredValues = [requiredValues];
        return !requiredValues.map(x => typeof x == "string"? x.toLowerCase() : x).includes(typeof controlValue == "string"? controlValue.toLowerCase() : controlValue)? {'requiredValues': {value: controlValue, requiredValues: requiredValues}}: null;
    };
    return res;
}

export function invalidCharacters(invalidCharacters: string): ValidatorFn {
    let regex = "^[^";
    for (let i = 0; i < invalidCharacters.length; i++) {
        const c = invalidCharacters[i];
        if("[\^$.|?*+()".includes(c)) regex += "\\";
        regex += c;
    }
    regex += "]*$";
    const res = (control: AbstractControl): {[key: string]: any} | null => {
        return !(new RegExp(regex, "i")).test(control.value)? {'invalidCharacters': {value: control.value, invalidCharacters: invalidCharacters}}: null;
    };
    return res;
}

export function SQLObjectName(): ValidatorFn {
    const res = (control: AbstractControl): {[key: string]: any} | null => {
        return (control.value && !(new RegExp("^[_a-zA-Zß#][0-9a-zA-Zß_@$#]*$", "i")).test(control.value))? {'sqlObjectName': {value: control.value}}: null;
    };
    return res;
}

export function conditionalValidator(validators: ValidatorFn | ValidatorFn[], condition: (AbstractControl) => boolean): ValidatorFn {
    const res = (control) => {
        if (!condition(control)) {
            return null;
        }

        if (!Array.isArray(validators)) {
            return validators(control);
        }

        return validators.map(v => v(control)).reduce((errors, result) =>
            result === null ? errors : (Object.assign(errors || {}, result))
        );
    };
    return res;
}

export function isInteger(): ValidatorFn {
    const res = (control: AbstractControl): {[key: string]: any} | null => {
        let value = control.value || "";
        return !(new RegExp("^[0-9]*$", "i")).test(value)? {'isInteger': {value: value}}: null;
    };
    return res;
}

export function isNumeric(): ValidatorFn {
    const res = (control: AbstractControl): {[key: string]: any} | null => {
        let value = control.value || "";
        return !(new RegExp("^[0-9]*[.,]?[0-9]*$", "i")).test(value)? {'isNumeric': {value: value}}: null;
    };
    return res;
}

export function isAlphaNumeric(): ValidatorFn {
    const res = (control: AbstractControl): {[key: string]: any} | null => {
        let value = control.value || "";
        var code, i, len;

        for (i = 0, len = value.length; i < len; i++) {
            code = value.charCodeAt(i);
            if (!(code > 47 && code < 58) && // numeric (0-9)
                !(code > 64 && code < 91) && // upper alpha (A-Z)
                !(code > 96 && code < 123)) { // lower alpha (a-z)
            return {'isAlphaNumeric': {value: value}};
            }
        }
        return null;
    };
    return res;
}