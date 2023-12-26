import { Directive } from "@angular/core";
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator, ValidatorFn } from "@angular/forms";


export function createHasSpecialCaseValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {

        const value = control.value;

        if (!value) {
            return null;
        }


        const hasSpecial = /[!@#$%^&* (),.?":{}|<>]/.test(value);



        return !hasSpecial ? { hasSpecial: true } : null;
    }
}

@Directive({
    selector: "[hasSpecial]",
    providers: [{
        provide: NG_VALIDATORS,
        useExisting: PasswordStrengthDirective,
        multi: true
    }]
})
export class PasswordStrengthDirective implements Validator {

    validate(control: AbstractControl): ValidationErrors | null {
        return createHasSpecialCaseValidator()(control);
    }
}