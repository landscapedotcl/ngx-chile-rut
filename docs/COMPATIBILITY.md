# Angular compatibility

This document explains which release line of `ngx-chile-rut` targets which Angular
versions, why the lines are split where they are, and how each one is tested.

## Release lines

| Line | Branch | npm dist-tag | Angular | Built with | Package format |
|------|--------|--------------|---------|------------|----------------|
| **2.x** | `main` | `latest` | **16 – 22** | Angular 16 / Node 18 | Ivy partial compilation (APF 16+) |
| **1.x** | `1.x` | `v1-lts` | **9 – 15** | Angular 9 / Node 12 | View Engine (consumed via `ngcc`) |

Both lines expose the **same public API** (`rutInput`, `rutValidate`, `rut` pipe,
`rutValidator`, helpers, `NgxChileRutModule`). 2.x additionally exports every
directive/pipe as standalone. Upgrading Angular across the 15 → 16 boundary only
requires bumping `ngx-chile-rut` from 1.x to 2.x — no template changes.

Each line is built with the **lowest** Angular version it supports. Angular guarantees
that libraries compiled with version N (partial Ivy) work in apps on N and later, and
that View Engine libraries work in Ivy apps through `ngcc`, so one build per line
covers the whole range. The consumer matrix below verifies that empirically.

## Usage by Angular major

Weekly downloads of `@angular/core` per major (npm, week ending 2026-10-09):

| Angular | Downloads/week | Share | Line |
|--------:|---------------:|------:|------|
| 21 | 1,673,205 | 27.8% | 2.x |
| 22 | 1,626,337 | 27.1% | 2.x |
| 20 | 823,095 | 13.7% | 2.x |
| 19 | 429,104 | 7.1% | 2.x |
| 9 | 267,221 | 4.4% | 1.x |
| 18 | 254,968 | 4.2% | 2.x |
| 17 | 209,612 | 3.5% | 2.x |
| 16 | 137,399 | 2.3% | 2.x |
| 15 | 109,356 | 1.8% | 1.x |
| 14 | 105,154 | 1.7% | 1.x |
| 13 | 69,315 | 1.2% | 1.x |
| 12 | 68,464 | 1.1% | 1.x |
| 11 | 44,822 | 0.7% | 1.x |
| 10 | 35,625 | 0.6% | 1.x |

Share is over all `@angular/core` downloads. Of Angular 9+ downloads, 2.x covers ~88% and 1.x ~12% (mostly Angular 9).
Reproduce with:

```bash
curl -s https://api.npmjs.org/versions/@angular%2Fcore/last-week
```

## Breaking changes that affect this library

Only a few Angular changes matter for a library made of a pipe, two directives, a
`ControlValueAccessor` and an `NgModule`:

| Angular | Change | Impact |
|---------|--------|--------|
| 9 | Ivy becomes the default renderer | Libraries must still ship View Engine; Ivy apps convert them with `ngcc`. |
| 12 | Partial Ivy compilation; View Engine deprecated | Libraries built with ≥12 cannot be used by Angular 9–11 apps. |
| 13 | View Engine removed from the compiler; APF drops UMD | A ≥13 build cannot target ≤12. |
| 14 | Typed forms (`FormControl<T>`), `inject()` in field initializers, standalone (preview) | Code using `inject()`/`standalone` doesn't compile on ≤13 → the shared source uses constructor DI. |
| 15 | Standalone APIs stable | 2.x ships standalone directives/pipe. |
| **16** | **`ngcc` removed** | **View Engine libraries (1.x) stop working → line boundary.** |
| 17 | New control flow, esbuild builder | No impact. |
| 19 | Components/directives/pipes are standalone by default | 2.x sets `standalone: true` explicitly; NgModule consumers must declare their own components with `standalone: false`. |
| 21 | Zoneless by default; Vitest replaces Karma in new apps | Directive doesn't depend on zone.js; consumer tests run on Vitest from 21. Tests are AOT-compiled, so non-standalone test hosts must be declared in a real `@NgModule`. |
| 22 | Node ≥ 22.22 / TypeScript 6 | No impact. |

`ControlValueAccessor`, `NG_VALUE_ACCESSOR`, `NG_VALIDATORS` and `@HostListener` are
unchanged from Angular 9 to 22.

## Test battery

Every line runs two suites, locally and in CI (`.github/workflows/ci.yml`):

1. **Unit tests** (`npm test`): helpers, pipe, validator and input directive
   (plain input, reactive forms, template-driven forms), on the line's build toolchain.
2. **Consumer matrix** (`compat/`): for **every Angular major** in the line's range,
   `compat/run-consumer.sh` creates a fresh app with that major's CLI (`ng new`),
   installs the packed tarball, verifies `@angular/core` satisfies the peer range and
   runs `compat/consumer.spec.ts` (plus `consumer-standalone.spec.ts` on 2.x) with that
   app's own test runner (Karma up to 20, Vitest from 21).

Node per Angular major is defined in `compat/node-for.sh`; the majors per line are in
`compat/majors.txt`. Run the matrix locally with `npm run compat` (needs
[`n`](https://github.com/tj/n) to switch Node versions) or a single major with:

```bash
npm run pack
bash compat/run-consumer.sh 19 dist/ngx-chile-rut-*.tgz   # with Node 20 on PATH
```
