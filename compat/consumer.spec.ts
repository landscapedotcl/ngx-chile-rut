// Consumer test: runs inside a fresh `ng new` app of every supported Angular major,
// against the packed library tarball. Keep it compatible with TypeScript 3.8 (Angular 9)
// and with both Jasmine/Karma and Vitest runners.
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgxChileRutModule, rutClean, rutFormat, rutValidate, rutValidator } from 'ngx-chile-rut';

// Angular 19+ makes components standalone by default; older versions ignore the flag.
// Going through a const keeps TypeScript < 4.x from rejecting the unknown property.
const ngModuleComponent: any = { standalone: false };

function dispatch(input: HTMLInputElement, type: string): void {
  const event = document.createEvent('Event');
  event.initEvent(type, true, false);
  input.dispatchEvent(event);
}

function typeInto(input: HTMLInputElement, value: string): void {
  dispatch(input, 'focus');
  input.value = value;
  dispatch(input, 'input');
}

@Component({
  ...ngModuleComponent,
  selector: 'rut-consumer-host',
  template: `
    <span class="pipe">{{ raw | rut }}</span>
    <input class="reactive" rutInput [formControl]="control">
    <input class="template" name="rut" rutInput rutValidate [(ngModel)]="model">
  `,
})
class ConsumerHostComponent {
  raw = '7618285K';
  control = new FormControl('', [Validators.required, rutValidator]);
  model = '';
}

describe('ngx-chile-rut consumer', () => {
  let fixture: ComponentFixture<ConsumerHostComponent>;
  let host: ConsumerHostComponent;
  let el: HTMLElement;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, NgxChileRutModule],
      declarations: [ConsumerHostComponent],
    });
    fixture = TestBed.createComponent(ConsumerHostComponent);
    host = fixture.componentInstance;
    el = fixture.nativeElement;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('exposes the helpers', () => {
    expect(rutClean('7.618.285-k')).toBe('7618285K');
    expect(rutFormat('7618285K')).toBe('7.618.285-K');
    expect(rutValidate('7.618.285-K')).toBe(true);
    expect(rutValidate('1.111.111-1')).toBe(false);
  });

  it('formats with the rut pipe', () => {
    expect((el.querySelector('.pipe') as HTMLElement).textContent).toBe('7.618.285-K');
  });

  it('validates with rutValidator', () => {
    expect(host.control.errors).toEqual({ required: true });
    host.control.setValue('1.111.111-1');
    expect(host.control.errors).toEqual({ invalidRut: true });
  });

  it('keeps the clean value in reactive forms and formats the view', () => {
    const input = el.querySelector('.reactive') as HTMLInputElement;
    typeInto(input, '7.618.285-k');
    expect(host.control.value).toBe('7618285K');
    expect(host.control.valid).toBe(true);
    dispatch(input, 'blur');
    expect(input.value).toBe('7.618.285-K');
    expect(host.control.touched).toBe(true);
  });

  it('formats programmatic values without extra valueChanges', () => {
    const input = el.querySelector('.reactive') as HTMLInputElement;
    const emitted: any[] = [];
    host.control.valueChanges.subscribe((v: any) => emitted.push(v));
    host.control.setValue('111111111');
    expect(input.value).toBe('11.111.111-1');
    expect(emitted).toEqual(['111111111']);
    expect(host.control.dirty).toBe(false);
  });

  it('works with ngModel and rutValidate', async () => {
    const input = el.querySelector('.template') as HTMLInputElement;
    typeInto(input, '1.111.111-1');
    dispatch(input, 'blur');
    fixture.detectChanges();
    await fixture.whenStable();
    expect(host.model).toBe('11111111');
    expect(input.value).toBe('1.111.111-1');
    expect(input.classList.contains('ng-invalid')).toBe(true);

    typeInto(input, '7618285k');
    dispatch(input, 'blur');
    fixture.detectChanges();
    await fixture.whenStable();
    expect(host.model).toBe('7618285K');
    expect(input.classList.contains('ng-valid')).toBe(true);
  });
});
