import { Directive } from "@angular/core";
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator, ValidatorFn } from "@angular/forms";
export function createHasSmallCaseValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {

        const value = control.value;

        if (!value) {
            return null;
        }



        const hasSmallCase = /[a-z]+/.test(value);


        return !hasSmallCase ? { hasSmallCase: true } : null;
    }
}

@Directive({
    selector: "[hasSmallCase]",
    providers: [{
        provide: NG_VALIDATORS,
        useExisting: PasswordStrengthDirective,
        multi: true
    }]
})
export class PasswordStrengthDirective implements Validator {

    validate(control: AbstractControl): ValidationErrors | null {
        return createHasSmallCaseValidator()(control);
    }
}