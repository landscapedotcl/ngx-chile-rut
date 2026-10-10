import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, FormsModule, NgModel, Validators } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { NgxChileRutModule } from './ngx-chile-rut.module';
import { RutValidatorDirective, rutValidator } from './rut-validator.directive';

describe('rutValidator', () => {
  it('returns null for valid RUTs', () => {
    expect(rutValidator(new FormControl('7.618.285-K'))).toBeNull();
    expect(rutValidator(new FormControl('7618285K'))).toBeNull();
  });

  it('returns { invalidRut: true } for invalid RUTs', () => {
    expect(rutValidator(new FormControl('1.111.111-1'))).toEqual({ invalidRut: true });
    expect(rutValidator(new FormControl('abc'))).toEqual({ invalidRut: true });
  });

  it('treats empty values as valid', () => {
    expect(rutValidator(new FormControl(''))).toBeNull();
    expect(rutValidator(new FormControl(null))).toBeNull();
    expect(rutValidator(new FormControl(undefined))).toBeNull();
  });

  it('composes with Validators.required', () => {
    const control = new FormControl('', [Validators.required, rutValidator]);
    expect(control.errors).toEqual({ required: true });
    control.setValue('1.111.111-1');
    expect(control.errors).toEqual({ invalidRut: true });
    control.setValue('11.111.111-1');
    expect(control.errors).toBeNull();
  });
});

@Component({
  template: `<input name="rut" [(ngModel)]="rut" rutValidate>`,
})
class TemplateHostComponent {
  rut = '';
}

describe('RutValidatorDirective', () => {
  async function setup(value: string) {
    TestBed.configureTestingModule({
      imports: [FormsModule, NgxChileRutModule],
      declarations: [TemplateHostComponent],
    });
    const fixture = TestBed.createComponent(TemplateHostComponent);
    fixture.componentInstance.rut = value;
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    const input = fixture.debugElement.query(By.directive(RutValidatorDirective));
    return input.injector.get(NgModel);
  }

  it('marks valid RUTs as valid', async () => {
    const model = await setup('7.618.285-K');
    expect(model.valid).toBe(true);
  });

  it('marks unformatted valid RUTs as valid', async () => {
    const model = await setup('7618285K');
    expect(model.valid).toBe(true);
  });

  it('marks invalid RUTs as invalid', async () => {
    const model = await setup('1.111.111-K');
    expect(model.valid).toBe(false);
    expect(model.errors).toEqual({ invalidRut: true });
  });

  it('marks empty values as valid', async () => {
    const model = await setup('');
    expect(model.valid).toBe(true);
  });
});
