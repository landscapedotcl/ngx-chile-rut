#!/usr/bin/env bash
# Usage: compat/run-consumer.sh <angular-major> <path/to/ngx-chile-rut-x.y.z.tgz>
#
# Creates a fresh app with the Angular CLI of <angular-major>, installs the packed
# library, checks that the installed Angular satisfies the library's peer range and
# runs the consumer specs. Expects the right Node version on PATH (see node-for.sh).
set -euo pipefail

MAJOR="$1"
TARBALL="$(cd "$(dirname "$2")" && pwd)/$(basename "$2")"
HERE="$(cd "$(dirname "$0")" && pwd)"
WORK="${COMPAT_WORKDIR:-$(mktemp -d)}/ng${MAJOR}"

echo "▶ Angular ${MAJOR} on Node $(node -v) — workdir ${WORK}"
rm -rf "$WORK" && mkdir -p "$(dirname "$WORK")"
cd "$(dirname "$WORK")"

export NG_CLI_ANALYTICS=false CI=true npm_config_yes=true
npx -p "@angular/cli@${MAJOR}" ng new "ng${MAJOR}" \
  --defaults --skip-git --skip-install --style=css --routing=false >/dev/null
cd "$WORK"

# Old toolchains pull native modules (e.g. fsevents@1) that no longer compile; their
# install scripts aren't needed to run tests (`ng test` runs ngcc by itself).
INSTALL_ARGS=(--no-audit --no-fund --legacy-peer-deps)
[ "$MAJOR" -le 13 ] && INSTALL_ARGS+=(--ignore-scripts)
npm install "${INSTALL_ARGS[@]}" >/dev/null
npm install "${INSTALL_ARGS[@]}" "$TARBALL" >/dev/null

# npm 6 (Node 12) only warns about peers, so check the range explicitly.
node -e '
  const semver = require("semver");
  const core = require("@angular/core/package.json").version;
  const peers = require("ngx-chile-rut/package.json").peerDependencies;
  const range = peers["@angular/core"];
  if (!semver.satisfies(core, range)) {
    console.error(`✖ @angular/core ${core} does not satisfy peer range ${range}`);
    process.exit(1);
  }
  console.log(`✔ @angular/core ${core} satisfies ${range}`);
'

find src -name '*.spec.ts' -delete
cp "$HERE/consumer.spec.ts" src/app/
if [ "$MAJOR" -lt 14 ]; then
  node -e '
    const fs = require("fs"); const f = process.argv[1];
    fs.writeFileSync(f, fs.readFileSync(f, "utf8").replace(/^ *standalone: false,\n/m, ""));
  ' src/app/consumer.spec.ts
fi
# Standalone APIs are only shipped by the Angular 14+ lines (the spec is absent elsewhere).
if [ -f "$HERE/consumer-standalone.spec.ts" ]; then
  cp "$HERE/consumer-standalone.spec.ts" src/app/
fi

TEST_ARGS=(--watch=false)
if grep -q '"builder": "@angular[-/a-z]*:karma"' angular.json; then
  if [ ! -f karma.conf.js ] && [ ! -f src/karma.conf.js ]; then
    npx ng generate config karma >/dev/null
  fi
  KARMA_CONF="$(ls karma.conf.js src/karma.conf.js 2>/dev/null | head -1 || true)"
  node -e '
    const fs = require("fs"); const f = process.argv[1];
    const s = fs.readFileSync(f, "utf8").replace(/browsers: \[[^\]]*\],/,
      "browsers: [\"ChromeHeadlessCI\"], customLaunchers: { ChromeHeadlessCI: { base: \"ChromeHeadless\", flags: [\"--no-sandbox\"] } },");
    fs.writeFileSync(f, s);
  ' "$KARMA_CONF"
  TEST_ARGS+=(--browsers=ChromeHeadlessCI)
fi

# Angular 9-11 toolchains (webpack 4) need the legacy OpenSSL provider on Node 17+.
if [ "$MAJOR" -le 11 ] && node -e 'process.exit(+process.versions.node.split(".")[0] >= 17 ? 0 : 1)'; then
  export NODE_OPTIONS=--openssl-legacy-provider
fi

npx ng test "${TEST_ARGS[@]}"
echo "✔ Angular ${MAJOR} passed"
