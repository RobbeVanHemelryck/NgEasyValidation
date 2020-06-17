# NgEasyValidation

Automatically add [Tippy.js](https://atomiks.github.io/tippyjs/v6/getting-started/ "Tippy.js documentation") tooltips to input fields containing its errors. 

It uses the validation logic from Angular's template-driven forms, and wraps it in a directive that adds tooltips to the respective input fields.


## Demo

[Check out the demo](https://stackblitz.com/edit/ng-easy-validation)

## Installation
Install it via NPM

```
npm i ng-easy-validation
```

Include the module

```
import { NgEasyValidationModule } from 'ng-easy-validation';
```

## Basic usage
### 1. Prepare form
To begin, add a reference to FormGroup on the form.
```<form #form="ngForm">```

Then add the ngEasyValidation directive, together with the requirements (more on this later).
```html
<form #form="ngForm" [ngEasyValidation]="requirements">
```

### 2. Prepare input fields

Since this library wraps Angular's template-driven form, every input field needs to have an ```[(ngModel)]``` assigned to it, as well as a unique ```name```.

```html
<input type="text" [(ngModel)]="firstname" name="firstname">
```


### 3. Create a requirements object

The requirements must be an object with keys that refer to the ```name``` property, and values that contain a list the validators for that field.

```javascript
requirements: any = {
        "firstname": [
            { validator: required() },
            { validator: maxLength(50) },
            { validator: invalidValues(["Brad", "Chad", "Bob"]) }
        ]
    }
```

### Properties of validation object

#### validator

This is the object that will be executed to help determine if a field is valid or not. 
This library supports all of Angular's built-in validators, plus many custom ones you can use in your application.

#### message (optional)

The error message that will be shown in the tooltip. When left empty, an appropriate message will be generated.

#### tooltipsOnInit (optional)

A boolean that tells to library to show tooltips immediately after the form has been loaded into the page. Default value is ```false```.

## Directive options

The ```ngEasyValidation``` directive supports modification through these options.

#### tippyProps

An object with the default properties for the Tippy.js tooltips. [See all properties](https://atomiks.github.io/tippyjs/v6/all-props/).

#### validationDebounceTime

A number reprenting the amount of milliseconds that will be applied to RxJS' ```debounceTime``` operator before applying the tooltips.

This can be used to increase the performance of heavy forms with many input fields.

## Validators
#### Importing
ngEasyValidation supports lots of validators that can be imported as such
```
import { required, maxLength, invalidValues } from 'ng-easy-validation';
```
 
#### List of validators


validator     | Invalid when|Notes
------------- |-------------|-------------
`required()` | value is null or empty
`requiredTrue()` | value is not ```true```|mostly used with checkboxes
`nullValidator()` | never|performs no operation
`minLength(minLength: number)` | value has less characters than ```minLength```
`maxLength(maxLength: number)` | value has more characters than ```maxLength```
`email()` | value is not a valid email address
`min(min: number)` | value is less than `min`
`max(max: number)` | value is more than `max`
`between(min: number, max: number)` | value is less than `min` or more than `max`
`invalidValues(invalidValues: any[] \| any, valueModifier: (any) => any = x => x)` | value is in `invalidValues`|`valueModifier` can be used to modify what was entered before it will be matched. Ex: apply `toLowerCase()` before matching
`requiredValues(requiredValues: any[] \| any, valueModifier: (any) => any = x => x)` | value is not in `requiredValues`|`valueModifier` can be used to modify what was entered before it will be matched. Ex: apply `toLowerCase()` before matching
`invalidCharacters(invalidCharacters: string)` | value contains any of the characters in `invalidCharacters`|`invalidCharacters` is a string containing all the characters
`conditionalValidator(validator: ValidatorIdMap, condition: (AbstractControl) => boolean)` | `condition` is met and `validator` is invalid
`sqlObjectName()` | value is not a valid SQL object name
`isInteger()` | value is not an integer
`isNumeric()` | value is not a numeric
`isAlphaNumeric()` | value is not alphanumerical
`isAlphabetical()` | value is not alphabetical
`startsWith(str: string)` | value doesn't start with `str`
`endsWith()` | value doesn't end with `str`

 ## License

 MIT