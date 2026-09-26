---
name: e2e-gif
description: Graba los tests e2e de Playwright del frontend, los convierte en un GIF y lo incrusta en la descripción del PR. Usar al abrir o actualizar un PR que toque `frontend/`.
---

# GIF de los tests e2e en el PR

Objetivo: que quien revise el PR vea la ejecución de todos los tests e2e sin tener que lanzarlos.

1. Comprueba que hay un PR abierto para la rama actual (`gh pr view --json number,url,headRefName`). Si no lo hay, créalo antes siguiendo las reglas de CLAUDE.md.
2. Genera el GIF con el script de la skill (graba en Chrome, un test tras otro, ralentizado):
   ```bash
   .claude/skills/e2e-gif/scripts/make_gif.sh docs/e2e/<rama>.gif
   ```
   `<rama>` es el nombre de la rama con `/` sustituido por `-` (p. ej. `docs/e2e/feat-frontend-e2e.gif`). Si algún test falla, el script se detiene: no subas un GIF de una suite en rojo, arregla o informa del fallo.
   - `E2E_SLOWMO=<ms>` ajusta la velocidad (por defecto 600).
   - Si falta `ffmpeg`, pide al usuario que lo instale (`! sudo apt install ffmpeg`); no lo instales tú.
   - Si el GIF supera ~5 MB, vuelve a generarlo con un `E2E_SLOWMO` menor: GitHub deja de mostrar imágenes grandes.
3. Commitea solo el GIF con `/commit` (tipo `docs(e2e)`) y haz push.
4. Actualiza la descripción del PR con una sección delimitada por marcadores, para que al repetir la skill se sustituya en lugar de duplicarse:
   ```markdown
   <!-- e2e-gif -->
   ## Tests e2e
   ![Ejecución de los tests e2e](https://github.com/<owner>/<repo>/blob/<rama>/docs/e2e/<rama>.gif?raw=true)
   <N> tests en verde · grabado el <fecha> sobre <sha corto>
   <!-- /e2e-gif -->
   ```
   Lee el cuerpo actual (`gh pr view --json body -q .body`), elimina el bloque entre marcadores si existe, añade el nuevo al final y guárdalo con `gh pr edit --body-file`.
   `gh` no permite adjuntar imágenes al PR: por eso el GIF vive en la rama y se enlaza con su URL `?raw=true`.
5. Comprueba que el enlace responde (`curl -sIL <url> | grep -i '^content-type: image/gif'`).
