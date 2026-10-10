#!/usr/bin/env bash
# Prints the Node major used to test a given Angular major (lowest LTS its CLI supports well).
case "$1" in
  9|10|11) echo 12 ;;
  12|13) echo 14 ;;
  14|15) echo 16 ;;
  16|17) echo 18 ;;
  18|19) echo 20 ;;
  20|21) echo 22 ;;
  22) echo 24 ;;
  *) echo "unknown Angular major $1" >&2; exit 1 ;;
esac
