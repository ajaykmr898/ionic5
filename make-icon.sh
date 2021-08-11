#!/usr/bin/env bash
set -e
SRC="src/assets/icon/favicon.png"
set -x

for i in 72 96 128 144 152 192 384 512
do
	convert "$SRC" -resize "${i}x${i}" "src/assets/icons/icon-${i}x${i}.png"
done

echo done

