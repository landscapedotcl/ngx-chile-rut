// Consumer test for standalone APIs (Angular 14+ lines only).
import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RutInputDirective, RutPipe, rutValidator } from 'ngx-chile-rut';

@Component({
  standalone: true,
  selector: 'rut-standalone-host',
  imports: [ReactiveFormsModule, RutInputDirective, RutPipe],
  template: `<input rutInput [formControl]="control"><span>{{ control.value | rut }}</span>`,
})
class StandaloneHostComponent {
  control = new FormControl('', [rutValidator]);
}

describe('ngx-chile-rut standalone consumer', () => {
  it('works importing the directive and pipe directly', () => {
    TestBed.configureTestingModule({ imports: [StandaloneHostComponent] });
    const fixture = TestBed.createComponent(StandaloneHostComponent);
    fixture.componentInstance.control.setValue('7618285K');
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect((el.querySelector('input') as HTMLInputElement).value).toBe('7.618.285-K');
    expect((el.querySelector('span') as HTMLElement).textContent).toBe('7.618.285-K');
  });
});
