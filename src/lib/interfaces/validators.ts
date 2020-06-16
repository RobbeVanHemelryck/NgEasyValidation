import { ValidatorFn, AbstractControl, Validators, AsyncValidatorFn } from "@angular/forms";
import { ValidatorIdMap } from './validator-id-map';
import { ValidatorId } from './validator-id';

//Wrapper methods around Angular's validators
export function required(): ValidatorIdMap{
    return {
        validator: Validators.required,
        id: ValidatorId.Required
    }
}

export function pattern(regex: string): ValidatorIdMap {
    return {
        validator: Validators.pattern(regex),
        id: ValidatorId.Pattern
    }
}

export function requiredTrue(): ValidatorIdMap {
    return {
        validator: Validators.requiredTrue,
        id: ValidatorId.RequiredTrue
    }
}

export function nullValidator(): ValidatorIdMap {
    return {
        validator: Validators.nullValidator,
        id: ValidatorId.NullValidator
    }
}

export function minLength(minLength: number): ValidatorIdMap {
    return {
        validator: Validators.minLength(minLength),
        id: ValidatorId.MinLength
    }
}

export function maxLength(maxLength: number): ValidatorIdMap {
    return {
        validator: Validators.maxLength(maxLength),
        id: ValidatorId.MaxLength
    }
}

// export function compose(validators: null): ValidatorIdMap {
//     return {
//         validator: Validators.compose(validators),
//         id: ValidatorId.Compose
//     }
// }

// export function composeAsync(validators: AsyncValidatorFn[]): ValidatorIdMap {
//     return {
//         validator: Validators.composeAsync(validators),
//         id: ValidatorId.ComposeAsync
//     }
// }

export function email(): ValidatorIdMap {
    return {
        validator: Validators.email,
        id: ValidatorId.Email
    }
}

export function min(min: number): ValidatorIdMap {
    return {
        validator: Validators.min(min),
        id: ValidatorId.Min
    }
}

export function max(max: number): ValidatorIdMap {
    return {
        validator: Validators.max(max),
        id: ValidatorId.Max
    }
}





//Custom validators
export function between(min: number, max: number): ValidatorIdMap {
    const res =(control: AbstractControl): {[key: string]: any} | null => {
        return control.value && (control.value > max || control.value < min)? {'between': {value: control.value, max: max, min: min}}: null;
    }; 
    return {
        validator: res,
        id: ValidatorId.Between
    }
}

export function invalidValues(invalidValues: any[] | any, valueModifier: (any) => any = x => x): ValidatorIdMap {
    const res = (control: AbstractControl): {[key: string]: any} | null => {
        let controlValue = valueModifier(control.value);
        if (!(invalidValues instanceof Array)) invalidValues = [invalidValues];
        return invalidValues.map(x => typeof x == "string"? x.toLowerCase() : x).includes(typeof controlValue == "string"? controlValue.toLowerCase() : controlValue)? {'invalidValues': {value: controlValue, invalidValues: invalidValues}}: null;
    };
    return {
        validator: res,
        id: ValidatorId.InvalidValues
    }
}

export function requiredValues(requiredValues: any[] | any, valueModifier: (any) => any = x => x): ValidatorIdMap {
    const res = (control: AbstractControl): {[key: string]: any} | null => {
        let controlValue = valueModifier(control.value);
        if (!(requiredValues instanceof Array)) requiredValues = [requiredValues];
        return !requiredValues.map(x => typeof x == "string"? x.toLowerCase() : x).includes(typeof controlValue == "string"? controlValue.toLowerCase() : controlValue)? {'requiredValues': {value: controlValue, requiredValues: requiredValues}}: null;
    };
    return {
        validator: res,
        id: ValidatorId.RequiredValues
    }
}

export function invalidCharacters(invalidCharacters: string): ValidatorIdMap {
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
    return {
        validator: res,
        id: ValidatorId.InvalidCharacters
    }
}

export function sqlObjectName(): ValidatorIdMap {
    const res = (control: AbstractControl): {[key: string]: any} | null => {
        return (control.value && !(new RegExp("^[_a-zA-Zß#][0-9a-zA-Zß_@$#]*$", "i")).test(control.value))? {'sqlObjectName': {value: control.value}}: null;
    };
    return {
        validator: res,
        id: ValidatorId.SqlObjectName
    }
}

export function conditionalValidator(validator: ValidatorIdMap, condition: (AbstractControl) => boolean): ValidatorIdMap {
    const res = (control) => {
        if (!condition(control)) {
            return null;
        }

        return validator.validator(control);
    };
    return {
        validator: res,
        id: validator.id
    }
}

export function isInteger(): ValidatorIdMap {
    const res = (control: AbstractControl): {[key: string]: any} | null => {
        let value = control.value || "";
        return !(new RegExp("^[0-9]*$", "i")).test(value)? {'isInteger': {value: value}}: null;
    };
    return {
        validator: res,
        id: ValidatorId.IsInteger
    }
}

export function isNumeric(): ValidatorIdMap {
    const res = (control: AbstractControl): {[key: string]: any} | null => {
        let value = control.value || "";
        return !(new RegExp("^[0-9]*[.,]?[0-9]*$", "i")).test(value)? {'isNumeric': {value: value}}: null;
    };
    return {
        validator: res,
        id: ValidatorId.IsNumeric
    }
}

export function isAlphaNumeric(): ValidatorIdMap {
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
    return {
        validator: res,
        id: ValidatorId.isAlphaNumeric
    }
}