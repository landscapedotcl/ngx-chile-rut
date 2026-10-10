import { Directive, forwardRef } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';
import { rutValidate } from './rut-helpers';

/**
 * `ValidatorFn` for reactive forms. Empty values are considered valid
 * (combine with `Validators.required` when needed).
 *
 * new FormControl('', [Validators.required, rutValidator])
 */
export function rutValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  if (value === null || value === undefined || value === '') {
    return null;
  }
  return rutValidate(value) ? null : { invalidRut: true };
}

/**
 * Template-driven validator: `<input name="rut" ngModel rutValidate>`.
 */
@Directive({
  selector: '[rutValidate]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: forwardRef(() => RutValidatorDirective), multi: true },
  ],
})
export class RutValidatorDirective implements Validator {
  validate(control: AbstractControl): ValidationErrors | null {
    return rutValidator(control);
  }
}
