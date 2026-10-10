# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - Unreleased (`main`, Angular 16 – 22)

First release as **`ngx-chile-rut`** (previously `ng9-rut`).

### Added
- Standalone `RutPipe`, `RutInputDirective` and `RutValidatorDirective` (also bundled in `NgxChileRutModule`).
- `rutCheckDigit()` helper.
- Dash-only format (`15751905-0`): `rutDashOnly` input on `rutInput`, `rutFormat(value, { dots: false })`
  and `rut:{ dots: false }` pipe option.
- Consumer compatibility matrix (`compat/`) testing a fresh app of every Angular major 16 – 22 in CI.

### Changed
- **BREAKING**: package renamed to `ngx-chile-rut`, module to `NgxChileRutModule`.
- **BREAKING**: selectors `rutInput` (was `formatRut`/`ngRut`) and `rutValidate` (was `validateRut`/`ngValidateRut`).
  The `ng` prefix is reserved for Angular.
- **BREAKING**: the reactive-forms validator is the `rutValidator` function (no longer an injectable class).
- The form model always receives the clean RUT; programmatic values are displayed formatted.
- Built with Angular 16 (Ivy partial compilation); peer range `>=16 <23`.

### Fixed
- `writeValue` no longer calls `onChange` (no extra `valueChanges` emission, control isn't marked dirty).
- Formatting directive and value accessor merged into a single directive (they shared a selector).
- `rutValidate` rejects bodies containing `K` or non-digits (e.g. `1K-9` was accepted).

### Removed
- Empty `Ng9RutService`, TSLint/Travis configuration.

## [1.0.0] - Unreleased (`1.x`, Angular 9 – 15)

Same API and fixes as 2.0.0 (without standalone exports), built with Angular 9 as a View Engine
library so it works in Angular 9 – 15 apps (Ivy apps consume it through `ngcc`).
Install with `npm i ngx-chile-rut@v1-lts`.

## ng9-rut history

### [0.2.0] - 2025-06-21 (never published to npm)

#### Added
- Angular 17 support with full migration from Angular 9
- ESLint configuration replacing deprecated TSLint
- Modern dependency injection using `inject()` function
- Comprehensive test coverage with all tests passing
- Library naming conventions with `ng` prefix for selectors
- Build and publish npm scripts
- Complete package metadata for npm publication

#### Changed
- **BREAKING**: Directive selectors updated to use `ng` prefix:
  - `[formatRut]` → `[ngRut]`
  - `[validateRut]` → `[ngValidateRut]`
- Updated all dependencies to Angular 17 compatible versions
- Migrated from constructor injection to `inject()` function
- Updated TypeScript to 5.4.5
- Updated RxJS to 7.8.2
- Replaced TSLint with ESLint
- Updated zone.js to 0.14.x for Angular 17 compatibility

#### Removed
- TSLint configuration and dependencies
- Protractor e2e testing setup
- Obsolete Angular 9 specific configurations
- Deprecated `whitelistedNonPeerDependencies` from ng-package.json

#### Fixed
- Zone.js import paths in test files
- Build configuration for Angular 17
- All linting errors and warnings
- Test failures related to updated selectors
- Validator return types for proper TypeScript compliance

#### Migration Guide
If upgrading from version 0.1.x:

1. Update your templates to use new directive selectors:
   ```html
   <!-- Before -->
   <input formatRut [(ngModel)]="rut">
   <input validateRut [(ngModel)]="rut">
   
   <!-- After -->
   <input ngRut [(ngModel)]="rut">
   <input ngValidateRut [(ngModel)]="rut">
   ```

2. Ensure you're using Angular 17+ in your project
3. Update your imports if needed (public API remains the same)

### [0.1.1] - Previous Release
- Initial Angular 9 support
- Basic RUT validation and formatting functionality 