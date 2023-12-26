
import { Directive } from "@angular/core";
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator, ValidatorFn } from "@angular/forms";

export function createHasCapitalCaseValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {

        const value = control.value;

        if (!value) {
            return null;
        }

        const hasCapitalCase = /[A-Z]+/.test(value);

        return !hasCapitalCase ? { hasCapitalCase: true } : null;
    }
}

@Directive({
    selector: "[hasCapitalCase]",
    providers: [{
        provide: NG_VALIDATORS,
        useExisting: PasswordStrengthDirective,
        multi: true
    }]
})
export class PasswordStrengthDirective implements Validator {

    validate(control: AbstractControl): ValidationErrors | null {
        return createHasCapitalCaseValidator()(control);
    }
}