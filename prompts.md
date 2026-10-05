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

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
De acuerdo a la Parte A del ejercicio, necesito que crees una spec de lo que el sistema hace hoy.
```

**Qué salió:** me propuso un plan con los requisitos partidos en «Requirements — API» y «Requirements — Pantalla», saltándose el formato; lo rechacé.

## Prompt 2

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Cumple esto, Debajo, ## Requirements, y colgando de él ### Requirement: en los que el sistema SHALL hacer algo.
```

**Qué salió:** corrigió la estructura; lo volví a rechazar para añadir más reglas.

## Prompt 3

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Necesito que también cumplas estructamente esto:
```

**Qué salió:** lo envié sin pegar la regla; el agente preguntó cuál y respondí marcando las cuatro opciones (escenarios, idioma, sin ADDED/MODIFIED/REMOVED, solo comportamiento observable).

## Prompt 4

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Solo comportamiento observable desde fuera. Ni un nombre de clase, ni un nombre de archivo, ni una ruta de código. En la API, observable es la petición y la respuesta. En la pantalla, observable es lo que una persona ve y puede hacer.
```

**Qué salió:** lo envié a mitad del turno anterior; añadió las reglas al plan, pero la lista de requisitos seguía con vocabulario de implementación. Rechazado.

## Prompt 5

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
En la lista de requisitos sigue sin seguir estrictamente: Solo comportamiento observable desde fuera. Ni un nombre de clase, ni un nombre de archivo, ni una ruta de código. En la API, observable es la petición y la respuesta. En la pantalla, observable es lo que una persona ve y puede hacer.
```

**Qué salió:** reescribió los 18 requisitos; aprobé el plan, escribió la spec, abrió el PR y el revisor adversarial encontró 2 afirmaciones falsas («Cerrando sesión…» no llega a verse; iniciales con dobles espacios), que corrigió.

## Prompt 6

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
voy a revisar el "Registro de cuenta", que archivos intervienen?
```

**Qué salió:** me listó los archivos para comprobar el requisito.

## Prompt 7

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
que debería hacer para que el servidor me devuelva 201 al registrar un nuevo usuario?
```

**Qué salió:** propuso cambiar el controlador en otra rama y avisó de que la Parte A prohíbe tocar código; rechacé el plan y no se tocó nada.

## Prompt 8

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
voy a revisar "Datos válidos para registrarse", que archivos intervienen?
```

**Qué salió:** me listó los archivos para comprobar el requisito.

## Prompt 9

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
voy a revisar "Inicio de sesión", que archivos intervienen?
```

**Qué salió:** me listó los archivos para comprobar el requisito.

## Prompt 10

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
genera el fichero prompts.m tay y como se especifica en la entrega
```

**Qué salió:** generó este archivo.

## Prompt 11

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
revisa la entrega
```

**Qué salió:** revisó la entrega contra el README: faltaba commitear la Parte B, abrir el PR contra el repo del curso y había dos errores de dato en mis listas (mayúsculas en el email, 7 → 8), que le pedí corregir solo en eso.

## Prompt 12

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
ves correcto el ejercicio entregado?
```

**Qué salió:** me dio el visto bueno a lo obligatorio, pero me señaló que la lista 3 era floja (solo una entrada planteaba dos lecturas) y que a la lista 2 le faltaba el «dónde se ve».

## Prompt 13

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
propón cómo reformular la lista 3
```

**Qué salió:** me propuso una formulación por tema (lectura A / lectura B); reescribí dos entradas a partir de ella.

## Prompt 14

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
ves correcto el ejercicio entregado?
```

**Qué salió:** me avisó de que mis cambios no estaban commiteados, que la entrada 2 de la lista 3 había quedado duplicada y mal planteada, y que faltaban prompts.

## Prompt 15

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
sí, añade los prompts y actualiza el PR, corrige también la entrada 2 de la lista 3
```

**Qué salió:** corrigió la entrada 2, añadió los prompts 12–15 y actualizó el PR.
