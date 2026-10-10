import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { NgxChileRutModule } from './ngx-chile-rut.module';
import { RutPipe } from './rut.pipe';

@Component({
  template: `<span>{{ value | rut }}</span>`,
})
class PipeHostComponent {
  value: unknown = '7618285K';
}

describe('RutPipe', () => {
  const pipe = new RutPipe();

  it('formats a clean RUT', () => {
    expect(pipe.transform('7618285K')).toBe('7.618.285-K');
  });

  it('normalizes an already formatted RUT', () => {
    expect(pipe.transform('7.618.285-k')).toBe('7.618.285-K');
  });

  it('returns an empty string for empty values', () => {
    expect(pipe.transform(null)).toBe('');
    expect(pipe.transform(undefined)).toBe('');
  });

  it('works in a template', () => {
    TestBed.configureTestingModule({
      imports: [NgxChileRutModule],
      declarations: [PipeHostComponent],
    });
    const fixture = TestBed.createComponent(PipeHostComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent.trim()).toBe('7.618.285-K');

    fixture.componentInstance.value = 111111111;
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent.trim()).toBe('11.111.111-1');
  });
});
