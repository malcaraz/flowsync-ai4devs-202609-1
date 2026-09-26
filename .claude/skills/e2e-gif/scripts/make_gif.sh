#!/usr/bin/env bash
# Graba los tests e2e del frontend y los une en un único GIF.
# Uso: make_gif.sh <ruta-salida.gif> [argumentos extra para playwright test]
set -euo pipefail

out="${1:?Uso: make_gif.sh <ruta-salida.gif> [args de playwright]}"
shift

command -v ffmpeg >/dev/null || { echo "Falta ffmpeg (sudo apt install ffmpeg)" >&2; exit 1; }

repo_root="$(git rev-parse --show-toplevel)"
frontend="$repo_root/frontend"
out="$(realpath -m "$out")"
work="$(mktemp -d)"
trap 'rm -rf "$work"' EXIT

cd "$frontend"

# Un solo worker: los vídeos quedan en el orden en que se ejecutan los tests
E2E_VIDEO=1 E2E_CHROME=1 E2E_SLOWMO="${E2E_SLOWMO:-600}" \
  npx playwright test --workers=1 --reporter=list "$@"

# Playwright deja un video.webm por test; se ordenan por fecha de escritura
mapfile -t videos < <(find test-results -name '*.webm' -printf '%T@ %p\n' | sort -n | cut -d' ' -f2-)
[ "${#videos[@]}" -gt 0 ] || { echo "No se generaron vídeos en test-results/" >&2; exit 1; }

for v in "${videos[@]}"; do
  printf "file '%s'\n" "$frontend/$v" >> "$work/list.txt"
done

# Paleta propia para que el GIF se vea bien y pese poco (8 fps, 720 px de ancho)
ffmpeg -loglevel error -y -f concat -safe 0 -i "$work/list.txt" \
  -vf "fps=8,scale=720:-1:flags=lanczos,split[a][b];[a]palettegen=max_colors=96[p];[b][p]paletteuse=dither=bayer:bayer_scale=5" \
  "$out"

echo "GIF: $out ($(du -h "$out" | cut -f1), ${#videos[@]} tests)"
