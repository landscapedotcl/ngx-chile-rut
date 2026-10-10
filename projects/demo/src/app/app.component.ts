import { JsonPipe, NgClass, NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  RutInputDirective,
  RutPipe,
  RutValidatorDirective,
  rutCheckDigit,
  rutClean,
  rutFormat,
  rutValidate,
  rutValidator,
} from 'ngx-chile-rut';

interface KnownCase {
  input: string;
  expected: boolean;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    NgClass,
    JsonPipe,
    FormsModule,
    ReactiveFormsModule,
    RutInputDirective,
    RutValidatorDirective,
    RutPipe,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  readonly rutControl = new FormControl('', [Validators.required, rutValidator]);
  readonly valueChanges: unknown[] = [];

  templateRut = '';
  dashOnly = false;
  pipeInput = '7618285K';
  playground = '7.618.285-k';

  readonly knownCases: KnownCase[] = [
    { input: '7.618.285-K', expected: true },
    { input: '7618285k', expected: true },
    { input: '11.111.111-1', expected: true },
    { input: '12.345.678-5', expected: true },
    { input: '24.965.101-K', expected: true },
    { input: '1-9', expected: true },
    { input: '1.111.111-1', expected: false },
    { input: '12.345.678-K', expected: false },
    { input: '1K-9', expected: false },
    { input: 'abc', expected: false },
    { input: '', expected: false },
  ];

  constructor() {
    this.rutControl.valueChanges.subscribe((value) => {
      this.valueChanges.unshift(value);
      this.valueChanges.splice(5);
    });
  }

  get playgroundBody(): string {
    return rutClean(this.playground).slice(0, -1);
  }

  clean(value: string): string {
    return rutClean(value);
  }

  format(value: string): string {
    return rutFormat(value);
  }

  formatDashOnly(value: string): string {
    return rutFormat(value, { dots: false });
  }

  validate(value: string): boolean {
    return rutValidate(value);
  }

  checkDigit(body: string): string {
    return rutCheckDigit(body);
  }

  setRandomValid(): void {
    this.rutControl.setValue(randomRut());
  }

  setInvalid(): void {
    this.rutControl.setValue('1.111.111-1');
  }

  toggleDisabled(): void {
    if (this.rutControl.disabled) {
      this.rutControl.enable();
    } else {
      this.rutControl.disable();
    }
  }

  reset(): void {
    this.rutControl.reset();
    this.valueChanges.length = 0;
  }

  randomTemplateRut(): void {
    this.templateRut = randomRut();
  }
}

function randomRut(): string {
  const body = String(Math.floor(1_000_000 + Math.random() * 24_000_000));
  return body + rutCheckDigit(body);
}
