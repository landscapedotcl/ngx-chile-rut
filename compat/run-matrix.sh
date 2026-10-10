#!/usr/bin/env bash
# Local matrix runner. Uses `n exec` to switch Node versions.
# Usage: compat/run-matrix.sh [majors...]   (defaults to compat/majors.txt)
set -uo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
ROOT="$(dirname "$HERE")"
TARBALL="$(ls "$ROOT"/dist/ngx-chile-rut-*.tgz | head -1)"
MAJORS=("$@")
[ ${#MAJORS[@]} -eq 0 ] && read -r -a MAJORS < "$HERE/majors.txt"
export COMPAT_WORKDIR="${COMPAT_WORKDIR:-$(mktemp -d)}"
mkdir -p "$COMPAT_WORKDIR"

declare -a RESULTS
for m in "${MAJORS[@]}"; do
  node_major="$("$HERE/node-for.sh" "$m")"
  if n exec "$node_major" bash "$HERE/run-consumer.sh" "$m" "$TARBALL" > "$COMPAT_WORKDIR/ng$m.log" 2>&1; then
    result="✔ Angular $m (Node $node_major)"
  else
    result="✖ Angular $m (Node $node_major) — see $COMPAT_WORKDIR/ng$m.log"
  fi
  echo "$result"
  RESULTS+=("$result")
done
printf '\n%s\n' "${RESULTS[@]}"
! printf '%s\n' "${RESULTS[@]}" | grep -q '✖'
