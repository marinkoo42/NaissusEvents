import { Directive } from "@angular/core";
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator, ValidatorFn } from "@angular/forms";

export function createHasNumberValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {

        const value = control.value;

        if (!value) {
            return null;
        }



        const hasNumber = /[0-9]+/.test(value);

        return !hasNumber ? { hasNumber: true } : null;
    }
}

@Directive({
    selector: "[hasNumber]",
    providers: [{
        provide: NG_VALIDATORS,
        useExisting: PasswordStrengthDirective,
        multi: true
    }]
})
export class PasswordStrengthDirective implements Validator {

    validate(control: AbstractControl): ValidationErrors | null {
        return createHasNumberValidator()(control);
    }
}