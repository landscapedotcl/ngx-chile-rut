import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RutInputDirective } from './rut-input.directive';
import { RutPipe } from './rut.pipe';
import { rutValidator } from './rut-validator.directive';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, RutInputDirective, RutPipe],
  template: `<input rutInput [formControl]="control"><span>{{ control.value | rut }}</span>`,
})
class StandaloneHostComponent {
  control = new FormControl('', [rutValidator]);
}

describe('standalone usage', () => {
  it('works importing the directive and pipe directly', () => {
    TestBed.configureTestingModule({ imports: [StandaloneHostComponent] });
    const fixture = TestBed.createComponent(StandaloneHostComponent);
    fixture.componentInstance.control.setValue('7618285K');
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('input')!.value).toBe('7.618.285-K');
    expect(el.querySelector('span')!.textContent).toBe('7.618.285-K');
  });
});
