import { ValidatorFn, AbstractControl, Validators, AsyncValidatorFn } from "@angular/forms";
import { ValidatorInfo } from './validator-id-map';
import { ValidatorId } from './validator-id';

//Wrapper methods around Angular's validators
export function required(): ValidatorInfo{
    return new ValidatorInfo(Validators.required, ValidatorId.Required);
}

export function pattern(regex: string): ValidatorInfo {
    return new ValidatorInfo(Validators.pattern(regex), ValidatorId.Pattern);
}

export function requiredTrue(): ValidatorInfo {
    return new ValidatorInfo(Validators.requiredTrue, ValidatorId.Required);
}

export function nullValidator(): ValidatorInfo {
    return new ValidatorInfo(Validators.required, ValidatorId.NullValidator);
}

export function minLength(minLength: number): ValidatorInfo {
    return new ValidatorInfo(Validators.minLength(minLength), ValidatorId.MinLength);
}

export function maxLength(maxLength: number): ValidatorInfo {
    return new ValidatorInfo(Validators.maxLength(maxLength), ValidatorId.MaxLength);
}

export function email(): ValidatorInfo {
    return new ValidatorInfo(Validators.required, ValidatorId.Email);
}

export function min(min: number): ValidatorInfo {
    return new ValidatorInfo(Validators.min(min), ValidatorId.Min);
}

export function max(max: number): ValidatorInfo {
    return new ValidatorInfo(Validators.max(max), ValidatorId.Max);
}





//Custom validators
export function between(min: number, max: number): ValidatorInfo {
    const res =(control: AbstractControl): {[key: string]: any} | null => {
        return control.value && (control.value > max || control.value < min)? {'between': {value: control.value, max: max, min: min}}: null;
    }; 
    return new ValidatorInfo(res, ValidatorId.Between);
}

export function invalidValues(invalidValues: any[] | any, valueModifier: (any) => any = x => x): ValidatorInfo {
    const res = (control: AbstractControl): {[key: string]: any} | null => {
        let controlValue = valueModifier(control.value);
        if (!(invalidValues instanceof Array)) invalidValues = [invalidValues];
        return invalidValues.map(x => typeof x == "string"? x.toLowerCase() : x).includes(typeof controlValue == "string"? controlValue.toLowerCase() : controlValue)? {'invalidValues': {value: controlValue, invalidValues: invalidValues}}: null;
    };
    return new ValidatorInfo(res, ValidatorId.InvalidValues);
}

export function requiredValues(requiredValues: any[] | any, valueModifier: (any) => any = x => x): ValidatorInfo {
    const res = (control: AbstractControl): {[key: string]: any} | null => {
        let controlValue = valueModifier(control.value);
        if (!(requiredValues instanceof Array)) requiredValues = [requiredValues];
        return !requiredValues.map(x => typeof x == "string"? x.toLowerCase() : x).includes(typeof controlValue == "string"? controlValue.toLowerCase() : controlValue)? {'requiredValues': {value: controlValue, requiredValues: requiredValues}}: null;
    };
    return new ValidatorInfo(res, ValidatorId.RequiredValues);
}

export function invalidCharacters(invalidCharacters: string): ValidatorInfo {
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
    return new ValidatorInfo(res, ValidatorId.InvalidCharacters);
}

export function sqlObjectName(): ValidatorInfo {
    const res = (control: AbstractControl): {[key: string]: any} | null => {
        return (control.value && !(new RegExp("^[_a-zA-Zß#][0-9a-zA-Zß_@$#]*$", "i")).test(control.value))? {'sqlObjectName': {value: control.value}}: null;
    };
    return new ValidatorInfo(res, ValidatorId.SqlObjectName);
}

export function conditionalValidator(validator: ValidatorInfo, condition: (AbstractControl) => boolean): ValidatorInfo {
    const res = (control: AbstractControl) => {
        if (!condition(control)) return null;
        return validator.validator(control);
    };
    return new ValidatorInfo(res, validator.id, true);
}

export function isInteger(): ValidatorInfo {
    const res = (control: AbstractControl): {[key: string]: any} | null => {
        let value = control.value || "";
        return !(new RegExp("^[0-9]*$", "i")).test(value)? {'isInteger': {value: value}}: null;
    };
    return new ValidatorInfo(res, ValidatorId.IsInteger);
}

export function isNumeric(): ValidatorInfo {
    const res = (control: AbstractControl): {[key: string]: any} | null => {
        let value = control.value || "";
        return !(new RegExp("^[0-9]*[.,]?[0-9]*$", "i")).test(value)? {'isNumeric': {value: value}}: null;
    };
    return new ValidatorInfo(res, ValidatorId.IsNumeric);
}

export function isAlphaNumeric(): ValidatorInfo {
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
    return new ValidatorInfo(res, ValidatorId.isAlphaNumeric);
}

export function isAlphabetical(): ValidatorInfo {
    const res = (control: AbstractControl): {[key: string]: any} | null => {
        let value = control.value || "";
        var code, i, len;

        for (i = 0, len = value.length; i < len; i++) {
            code = value.charCodeAt(i);
            if (!(code > 64 && code < 91) && // upper alpha (A-Z)
                !(code > 96 && code < 123)) { // lower alpha (a-z)
            return {'isAlphabetical': {value: value}};
            }
        }
        return null;
    };
    return new ValidatorInfo(res, ValidatorId.isAlphabetical);
}

export function startsWith(str: string): ValidatorInfo {
    const res = (control: AbstractControl): {[key: string]: any} | null => {
        let value = control.value || "";
        return !value || value.startsWith(str)? null : {"startsWith": {value: value, startsWith: str}};
    };
    return new ValidatorInfo(res, ValidatorId.startsWith);
}

export function endsWith(str: string): ValidatorInfo {
    const res = (control: AbstractControl): {[key: string]: any} | null => {
        let value = control.value || "";
        return !value || value.endsWith(str)? null : {"endsWith": {value: value, endsWith: str}};
    };
    return new ValidatorInfo(res, ValidatorId.endsWith);
}