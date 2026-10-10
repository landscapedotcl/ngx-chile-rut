# ngx-chile-rut

[![CI](https://github.com/landscapedotcl/ngx-chile-rut/actions/workflows/ci.yml/badge.svg)](https://github.com/landscapedotcl/ngx-chile-rut/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/ngx-chile-rut.svg)](https://www.npmjs.com/package/ngx-chile-rut)

Validation, formatting, pipe and input directive for the
[Chilean RUT](https://en.wikipedia.org/wiki/National_identification_number#Chile), for **Angular 9 to 22**.

Successor of [`ng9-rut`](https://www.npmjs.com/package/ng9-rut) (itself based on
[ng2-rut](https://github.com/platanus/ng2-rut)).

## Installation

Pick the line that matches your Angular version:

| Your Angular | Install | Line |
|--------------|---------|------|
| 16 – 22 | `npm i ngx-chile-rut` | 2.x |
| 9 – 15 | `npm i ngx-chile-rut@v1-lts` | 1.x |

Both lines have the same API. See [docs/COMPATIBILITY.md](docs/COMPATIBILITY.md) for
why the split is at Angular 16 and how every Angular major is tested.

## Usage

### Standalone (2.x)

```ts
import { Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { RutInputDirective, RutPipe, rutValidator } from 'ngx-chile-rut';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [NgIf, ReactiveFormsModule, RutInputDirective, RutPipe],
  template: `
    <input rutInput [formControl]="rut">
    <small *ngIf="rut.hasError('invalidRut')">RUT inválido</small>
    <p>{{ rut.value | rut }}</p>
  `,
})
export class SignupComponent {
  rut = new FormControl('', [Validators.required, rutValidator]);
}
```

### NgModule (1.x and 2.x)

```ts
import { NgModule } from '@angular/core';
import { NgxChileRutModule } from 'ngx-chile-rut';

@NgModule({
  imports: [NgxChileRutModule],
})
export class AppModule {}
```

### `rutInput` directive

```html
<input rutInput [formControl]="rut">
<input rutInput name="rut" [(ngModel)]="user.rut">
<input rutInput>  <!-- also works without forms -->
```

- Shows `7.618.285-K` while the input is blurred and `7618285K` while it's focused.
- The form model **always receives the clean value** (`7618285K`), whatever the user typed.
- Values set programmatically (`setValue`, `ngModel`) are displayed formatted.

### Validation

Reactive forms — use the `rutValidator` function:

```ts
new FormControl('', [Validators.required, rutValidator]);
// invalid → { invalidRut: true }; empty values are valid (combine with Validators.required)
```

Template-driven forms — use the `rutValidate` directive:

```html
<input rutInput rutValidate name="rut" [(ngModel)]="user.rut" #rut="ngModel">
<small *ngIf="rut.hasError('invalidRut')">RUT inválido</small>
```

### `rut` pipe

```html
{{ '7618285K' | rut }}   <!-- 7.618.285-K -->
```

### Helpers

```ts
import { rutClean, rutFormat, rutValidate, rutCheckDigit } from 'ngx-chile-rut';

rutClean('7.618.285-k');   // '7618285K'
rutFormat('7618285K');     // '7.618.285-K'
rutValidate('7.618.285-K'); // true
rutCheckDigit('7618285');  // 'K'
```

## Migrating from `ng9-rut`

| ng9-rut 0.1.x | ngx-chile-rut |
|---------------|---------------|
| `Ng9RutModule` | `NgxChileRutModule` |
| `formatRut` directive | `rutInput` |
| `validateRut` directive | `rutValidate` |
| `RutValidator` (injected) | `rutValidator` function |
| `rut` pipe | `rut` pipe (unchanged) |
| error `{ invalidRut: true }` | unchanged |

Behavior changes: the model always holds the clean RUT (before it depended on whether
the value was typed or set programmatically), and `setValue` no longer triggers a
second `valueChanges` emission.

## Development

```bash
npm ci
npm test          # unit tests (ChromeHeadless)
npm run pack      # builds dist/ngx-chile-rut-x.y.z.tgz
npm run compat    # consumer matrix across every supported Angular major (needs `n`)
```

Each line lives on its own branch (`main` = 2.x, `1.x` = 1.x) with its own toolchain
(`.nvmrc`). Fixes to shared code (`src/lib`, specs, `compat/consumer.spec.ts`) are
cherry-picked between branches.

Releases: `gh release create vX.Y.Z --target main` publishes to `latest`;
`--target 1.x` publishes to `v1-lts` (needs the `NPM_TOKEN` secret).

## License

MIT
