import { AbstractControl, ValidationErrors } from '@angular/forms';

export class CustomValidators {

  /* ===========================
     NO EMOJI / SYMBOL VALIDATOR
  ============================ */
  static noEmoji(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;

    const regex = /^[a-zA-Z0-9 @._-]+$/;
    return regex.test(control.value)
      ? null
      : { noEmoji: true };
  }

  /* ===========================
     ONLY ALPHABETS (Name)
  ============================ */
  static onlyAlphabets(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;

    return /^[a-zA-Z ]+$/.test(control.value)
      ? null
      : { onlyAlphabets: true };
  }

  /* ===========================
     ONLY NUMBERS
  ============================ */
  static onlyNumbers(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;

    return /^[0-9]+$/.test(control.value)
      ? null
      : { onlyNumbers: true };
  }

  /* ===========================
     STRICT 10 DIGIT MOBILE
  ============================ */
  static mobile10(control: AbstractControl): ValidationErrors | null {
  if (!control.value) return null;

  // Remove non-numeric characters immediately
  const numericValue = control.value.toString().replace(/\D/g, '');

  // Update value WITHOUT triggering loop
  if (numericValue !== control.value) {
    control.setValue(numericValue, { emitEvent: false });
  }

  return numericValue.length === 10
    ? null
    : { mobile10: true };
}


  /* ===========================
     STRONG PASSWORD
  ============================ */
  static strongPassword(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;

    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$!%*?&]).{6,}$/;

    return regex.test(control.value)
      ? null
      : { strongPassword: true };
  }
}
