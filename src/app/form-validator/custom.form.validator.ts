import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class FormValidator {
    static phoneNumberValidator(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
             let isNumberValid: boolean =  /^\+?([0-9]{2})\)?[-. ]?([0-9]{4})[-. ]?([0-9]{4})$/.test(control.value)
            if (control.value && !isNumberValid) {
                return { customError: true };
            }
            return null;
        };
    }

}