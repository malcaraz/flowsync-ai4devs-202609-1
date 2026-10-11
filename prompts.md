# Prompts

Aquí van **todos los prompts que lanzaste** para hacer el ejercicio, en el orden en que los
lanzaste, con el modelo y la herramienta de cada uno.

Esto no es papeleo. Lo que se revisa es **cómo pediste las cosas**, no solo lo que salió: un
resultado flojo con un prompt bueno y un resultado flojo con un prompt vago necesitan feedback
distinto, y sin este archivo no se distinguen.

## Cómo rellenarlo

- Un apartado `## Prompt N` por cada prompt.
- **Pega el prompt tal cual lo lanzaste**, dentro del bloque de código, aunque ocupe diez líneas
  y aunque tenga faltas. No lo reescribas para que quede bien: el que arreglaste mentalmente
  después no es el que lanzaste.
- Incluye también los que **no funcionaron**. Suelen ser los más útiles de leer.
- `Modelo` y `Herramienta` en todos. Si cambiaste de una a otra a mitad, se nota aquí.

---

## Prompt 1

**Modelo:** Opus 5.5 (`claude-opus-5-5`)
**Herramienta:** Claude Code

```
listame las opciones opsx: que dispongo
```

**Qué salió:** Funcionó a la primera: listó los siete comandos `/opsx:*`. Previo al ejercicio, para orientarme.

## Prompt 2

**Modelo:** Opus 5.5 (`claude-opus-5-5`)
**Herramienta:** Claude Code

```
como puedo saber las capabiliies quetengo
```

**Qué salió:** Funcionó a la primera: `openspec list --specs` → `auth` (19 requisitos) y `tasks` (32).

## Prompt 3

**Modelo:** Opus 5.5 (`claude-opus-5-5`)
**Herramienta:** Claude Code

```
Dentro de la capabilty task, lee los escenarios del requirenment ‘Lo que cada tarea muestra de su responsable’ y los tests existentes. Genera una tabla de trazabilidad: cada criterio de aceptación, qué prueba lo cubre, cubierto / NO cubierto. No cambies nada.
```

**Qué salió:** Salió una tabla 0/3 cubiertos y detectó que la lista expone el email, pero no seguía el formato del README: no se lo pedí.

## Prompt 4

**Modelo:** Opus 5.5 (`claude-opus-5-5`)
**Herramienta:** Claude Code

```
Respeta el formato para la matriz de trazabilidad descrita en el fichero README
```

**Qué salió:** Rehizo la matriz con los dos números arriba y las cuatro casillas, todavía solo en el chat.

## Prompt 5

**Modelo:** Opus 5.5 (`claude-opus-5-5`)
**Herramienta:** Claude Code

```
si guarda el fichero
```

**Qué salió:** Creó `docs/verificacion/maj.md` con la matriz y las tres líneas en blanco.

## Prompt 6

**Modelo:** Opus 5.5 (`claude-opus-5-5`)
**Herramienta:** Claude Code

```
De las filas que quedaron en No cubierto, escribe los tests que faltan: uno por scenario, siguiendo el estilo de los que ya existen en el proyecto, y sin tocar nada fuera de la carpeta de tests.
```

**Qué salió:** Tres tests en `backend/tests/functional/tasks/assignee.spec.ts`: dos en verde y uno en rojo (la lista devuelve el email).

## Prompt 7

**Modelo:** Opus 5.5 (`claude-opus-5-5`)
**Herramienta:** Claude Code

```
actualiza maj.md
```

**Qué salió:** Actualizó la matriz con los tests nuevos (3/3 cubiertos, uno en rojo); las líneas de la parte B quedaron para mí.

## Prompt 8

**Modelo:** Opus 5.5 (`claude-opus-5-5`)
**Herramienta:** Claude Code

```
No entiendo el segundo punto de las tres lineas
```

**Qué salió:** Me explicó la diferencia entre hueco de test y hueco de spec, con dos candidatos del scenario 2.

## Prompt 9

**Modelo:** Opus 5.5 (`claude-opus-5-5`)
**Herramienta:** Claude Code

```
No entiendo tampoco lo que se pide el punto 3
```

**Qué salió:** Me explicó qué decisiones tomó el test que el scenario no fijaba, con cuatro ejemplos.

## Prompt 10

**Modelo:** Opus 5.5 (`claude-opus-5-5`)
**Herramienta:** Claude Code

```
escribe los prompts en prompts.md con el formato que se pide en la entrega
```

**Qué salió:** Rellenó este archivo con los diez prompts tal cual; las líneas «Qué salió» las redactó el agente y las revisé.

## Prompt 11

**Modelo:** Opus 5.5 (`claude-opus-5-5`)
**Herramienta:** Claude Code

```
las líneas las quiero dejar tal cual están ahora, las ves correctas?
```

**Qué salió:** Me dijo que no: las líneas 2 y 3 eran su explicación copiada y tenían varios candidatos en vez de uno, y reconoció un error suyo en un ejemplo de la línea 3.

## Prompt 12

**Modelo:** Opus 5.5 (`claude-opus-5-5`)
**Herramienta:** Claude Code

```
como lo ves ahora?
```

**Qué salió:** Las dio por buenas tras mi reescritura; señaló dos erratas y un argumento en contra de mi conclusión de la línea 2.

## Prompt 13

**Modelo:** Opus 5.5 (`claude-opus-5-5`)
**Herramienta:** Claude Code

```
corrige las erratas
```

**Qué salió:** Corrigió las dos erratas de la línea 2 sin tocar nada más.

## Prompt 14

**Modelo:** Opus 5.5 (`claude-opus-5-5`)
**Herramienta:** Claude Code

```
revisalo de nuevo tras mis cambios
```

**Qué salió:** Señaló una errata en la línea 3, que la matriz no tiene ningún «no lo sé» y que faltaban prompts en este archivo.

## Prompt 15

**Modelo:** Opus 5.5 (`claude-opus-5-5`)
**Herramienta:** Claude Code

```
corrige la errata y añade los prompts que faltan
```

**Qué salió:** Corrigió la errata de la línea 3 y añadió los prompts 11 a 15.

## Prompt 16

**Modelo:** Opus 5.5 (`claude-opus-5-5`)
**Herramienta:** Claude Code

```
añade también el "No lo se" del segundo scenario,
```

**Qué salió:** Pasó el scenario 2 a «no lo sé» con su motivo y bajó los cubiertos a 2.

## Prompt 17

**Modelo:** Opus 5.5 (`claude-opus-5-5`)
**Herramienta:** Claude Code

```
revisa la tarea de nuevo
```

**Qué salió:** Encontró un error de tipos en el test que escribió y lo corrigió sin cambiar lo que afirma; el test sigue en rojo.

## Prompt 18

**Modelo:** Opus 5.5 (`claude-opus-5-5`)
**Herramienta:** Claude Code

```
si, haz el commit, push y el PR
```

**Qué salió:** Hizo el commit y el push al fork; el PR no se pudo abrir porque `gh` no estaba instalado.

## Prompt 19

**Modelo:** Opus 5.5 (`claude-opus-5-5`)
**Herramienta:** Claude Code

```
puedes continuar con el PR?
```

**Qué salió:** Esperó a que se instalase `gh`; faltaba iniciar sesión en GitHub.

## Prompt 20

**Modelo:** Opus 5.5 (`claude-opus-5-5`)
**Herramienta:** Claude Code

```
puedes continuar con el PR?
```

**Qué salió:** `gh auth login` se quedó esperando la autorización en el navegador; lo paré.

## Prompt 21

**Modelo:** Opus 5.5 (`claude-opus-5-5`)
**Herramienta:** Claude Code

```
para
```

**Qué salió:** Paró.

## Prompt 22

**Modelo:** Opus 5.5 (`claude-opus-5-5`)
**Herramienta:** Claude Code

```
pasa el revisor adversarial
```

**Qué salió:** Lanzó el subagente `adversarial-reviewer` sobre el commit (sin PR abierto). Nada bloqueante; dos debilidades en los tests y dudas sobre mi línea 2 y el «no lo sé».

## Prompt 23

**Modelo:** Opus 5.5 (`claude-opus-5-5`)
**Herramienta:** Claude Code

```
vale, refuerza los tests
```

**Qué salió:** El test 2 ahora exige nombre e iniciales además de la ausencia del email, y el test 3 comprueba que el email no llega. Sigue el mismo rojo.
