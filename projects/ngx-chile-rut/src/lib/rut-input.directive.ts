import { Directive, ElementRef, HostListener, Renderer2, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { rutClean, rutFormat } from './rut-helpers';

/**
 * Formats a RUT input: shows `7.618.285-K` while blurred and `7618285K` while focused.
 *
 * When used with `ngModel`, `formControl` or `formControlName` the model always
 * receives the clean value (`7618285K`), whatever the user typed.
 */
@Directive({
  selector: 'input[rutInput]',
  standalone: true,
  exportAs: 'rutInput',
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => RutInputDirective), multi: true },
  ],
})
export class RutInputDirective implements ControlValueAccessor {
  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};
  private focused = false;

  constructor(private renderer: Renderer2, private elementRef: ElementRef) {}

  @HostListener('input')
  handleInput(): void {
    this.onChange(rutClean(this.viewValue));
  }

  @HostListener('focus')
  handleFocus(): void {
    this.focused = true;
    this.setViewValue(rutClean(this.viewValue));
  }

  @HostListener('blur')
  handleBlur(): void {
    this.focused = false;
    this.setViewValue(rutFormat(this.viewValue));
    this.onTouched();
  }

  writeValue(value: unknown): void {
    const clean = rutClean(value);
    this.setViewValue(this.focused ? clean : rutFormat(clean));
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.renderer.setProperty(this.elementRef.nativeElement, 'disabled', isDisabled);
  }

  private get viewValue(): string {
    return this.elementRef.nativeElement.value;
  }

  private setViewValue(value: string): void {
    this.renderer.setProperty(this.elementRef.nativeElement, 'value', value);
  }
}
