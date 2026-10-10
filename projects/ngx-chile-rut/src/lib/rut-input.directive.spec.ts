import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxChileRutModule } from './ngx-chile-rut.module';
import { rutValidator } from './rut-validator.directive';

function dispatch(input: HTMLInputElement, type: string): void {
  const event = document.createEvent('Event');
  event.initEvent(type, true, false);
  input.dispatchEvent(event);
}

function type(input: HTMLInputElement, value: string): void {
  dispatch(input, 'focus');
  input.value = value;
  dispatch(input, 'input');
}

@Component({
  template: `<input rutInput>`,
})
class PlainHostComponent {}

@Component({
  template: `<input rutInput [formControl]="control">`,
})
class ReactiveHostComponent {
  control = new FormControl('', [rutValidator]);
}

@Component({
  template: `<input name="rut" rutInput rutValidate [(ngModel)]="rut">`,
})
class TemplateHostComponent {
  rut: string | null = '';
}

@Component({
  template: `<input rutInput [rutDashOnly]="dashOnly" [formControl]="control">`,
})
class DashOnlyHostComponent {
  dashOnly: boolean | string = '';
  control = new FormControl('');
}

describe('RutInputDirective', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, NgxChileRutModule],
      declarations: [PlainHostComponent, ReactiveHostComponent, TemplateHostComponent, DashOnlyHostComponent],
    });
  });

  function inputOf(fixture: ComponentFixture<unknown>): HTMLInputElement {
    return fixture.nativeElement.querySelector('input');
  }

  describe('without forms', () => {
    it('formats on blur', () => {
      const fixture = TestBed.createComponent(PlainHostComponent);
      fixture.detectChanges();
      const input = inputOf(fixture);
      input.value = '7618285k';
      dispatch(input, 'blur');
      expect(input.value).toBe('7.618.285-K');
    });

    it('cleans on focus', () => {
      const fixture = TestBed.createComponent(PlainHostComponent);
      fixture.detectChanges();
      const input = inputOf(fixture);
      input.value = '7.618.285-K';
      dispatch(input, 'focus');
      expect(input.value).toBe('7618285K');
    });

    it('leaves an empty input empty', () => {
      const fixture = TestBed.createComponent(PlainHostComponent);
      fixture.detectChanges();
      const input = inputOf(fixture);
      dispatch(input, 'focus');
      dispatch(input, 'blur');
      expect(input.value).toBe('');
    });
  });

  describe('with reactive forms', () => {
    let fixture: ComponentFixture<ReactiveHostComponent>;
    let control: FormControl;
    let input: HTMLInputElement;

    beforeEach(() => {
      fixture = TestBed.createComponent(ReactiveHostComponent);
      fixture.detectChanges();
      control = fixture.componentInstance.control;
      input = inputOf(fixture);
    });

    it('stores the clean value in the model while typing', () => {
      type(input, '7.618.285-k');
      expect(control.value).toBe('7618285K');
      expect(control.valid).toBe(true);
    });

    it('formats the view on blur and marks the control as touched', () => {
      type(input, '7618285k');
      dispatch(input, 'blur');
      expect(input.value).toBe('7.618.285-K');
      expect(control.value).toBe('7618285K');
      expect(control.touched).toBe(true);
    });

    it('shows the formatted value when the model is set programmatically', () => {
      control.setValue('111111111');
      expect(input.value).toBe('11.111.111-1');
      expect(control.value).toBe('111111111');
    });

    it('does not emit extra valueChanges or mark dirty on setValue', () => {
      const emitted: unknown[] = [];
      control.valueChanges.subscribe((v) => emitted.push(v));
      control.setValue('7.618.285-K');
      expect(emitted).toEqual(['7.618.285-K']);
      expect(control.dirty).toBe(false);
    });

    it('flags invalid RUTs', () => {
      type(input, '1.111.111-1');
      expect(control.errors).toEqual({ invalidRut: true });
    });

    it('shows the clean value when set while focused', () => {
      dispatch(input, 'focus');
      control.setValue('7.618.285-K');
      expect(input.value).toBe('7618285K');
    });

    it('clears the view on reset', () => {
      type(input, '7618285K');
      control.reset();
      expect(input.value).toBe('');
    });

    it('propagates the disabled state', () => {
      control.disable();
      expect(input.disabled).toBe(true);
      control.enable();
      expect(input.disabled).toBe(false);
    });
  });

  describe('with template-driven forms', () => {
    it('stores the clean value in the model', async () => {
      const fixture = TestBed.createComponent(TemplateHostComponent);
      fixture.detectChanges();
      await fixture.whenStable();
      const input = inputOf(fixture);
      type(input, '7.618.285-k');
      dispatch(input, 'blur');
      expect(fixture.componentInstance.rut).toBe('7618285K');
      expect(input.value).toBe('7.618.285-K');
    });

    it('formats the initial model value', async () => {
      const fixture = TestBed.createComponent(TemplateHostComponent);
      fixture.componentInstance.rut = '111111111';
      fixture.detectChanges();
      await fixture.whenStable();
      expect(inputOf(fixture).value).toBe('11.111.111-1');
    });
  });

  describe('with rutDashOnly', () => {
    let fixture: ComponentFixture<DashOnlyHostComponent>;
    let host: DashOnlyHostComponent;
    let input: HTMLInputElement;

    beforeEach(() => {
      fixture = TestBed.createComponent(DashOnlyHostComponent);
      host = fixture.componentInstance;
      fixture.detectChanges();
      input = inputOf(fixture);
    });

    it('formats with dash only on blur and keeps the clean model', () => {
      type(input, '15.751.905-0');
      dispatch(input, 'blur');
      expect(input.value).toBe('15751905-0');
      expect(host.control.value).toBe('157519050');
    });

    it('formats programmatic values with dash only', () => {
      host.control.setValue('157519050');
      expect(input.value).toBe('15751905-0');
    });

    it('treats the bare attribute as true and "false" as false', () => {
      host.control.setValue('157519050');
      host.dashOnly = 'false';
      fixture.detectChanges();
      expect(input.value).toBe('15.751.905-0');
      host.dashOnly = true;
      fixture.detectChanges();
      expect(input.value).toBe('15751905-0');
      host.dashOnly = false;
      fixture.detectChanges();
      expect(input.value).toBe('15.751.905-0');
    });
  });
});
