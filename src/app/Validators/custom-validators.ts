import { AbstractControl, ValidationErrors } from '@angular/forms';

export class CustomValidators {

  static noEmoji(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;

    const regex = /^[a-zA-Z0-9 @._-]+$/;
    return regex.test(control.value)
      ? null
      : { noEmoji: true };
  }

  
  static onlyAlphabets(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;

    return /^[a-zA-Z ]+$/.test(control.value)
      ? null
      : { onlyAlphabets: true };
  }

  static onlyNumbers(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;

    return /^[0-9]+$/.test(control.value)
      ? null
      : { onlyNumbers: true };
  }

  static mobile10(control: AbstractControl): ValidationErrors | null {
  if (!control.value) return null;

 
  const numericValue = control.value.toString().replace(/\D/g, '');

  if (numericValue !== control.value) {
    control.setValue(numericValue, { emitEvent: false });
  }

  return numericValue.length === 10
    ? null
    : { mobile10: true };
}


  static strongPassword(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;

    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$!%*?&]).{6,}$/;

    return regex.test(control.value)
      ? null
      : { strongPassword: true };
  }
}
