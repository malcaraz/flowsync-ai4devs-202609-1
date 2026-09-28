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

**Modelo:** Claude Opus 5.5 · medium
**Herramienta:** Claude Code

```
Define el alcance para el MVP de FlowSync partiendo de la siguiente propuesta:

'Quiero que FlowSync sea una herramienta para que los equipos remotos sepan en qué está trabajando cada uno sin tener que hacer reuniones de sincronización. Algo tipo tareas compartidas pero más en tiempo real y menos rollo que Jira.'

Antes de definir el alcance, resume que capabilities existen y cómo es el modelo de datos actual. Debes de respetar lo que ya está construido y no volverlo a especificar.
```

**Qué salió:** Resumió el terreno (solo auth; modelo: usuarios y tokens; nada de tiempo real), pero no definió el alcance: se paró a preguntar si interrogar antes o usar la ficha del README.

## Prompt 2

**Modelo:** Claude Opus 5.5 · medium
**Herramienta:** Claude Code

```
Haz la parte del interrogatorio primero, dime que 5 preguntas reducen la incertidumbre, en una sola ronda y sin entrar en modelo de datos ni endpoint
```

**Qué salió:** Cinco preguntas en una ronda, sin datos ni endpoints; la P4 y la P5 eran varias preguntas pegadas.

## Prompt 3

**Modelo:** Claude Opus 5.5 · medium
**Herramienta:** Claude Code

```
El producto debería de responder a los siguientes hechos:

- Qué duele hoy: la daily de sincronización y el "¿en qué estás?" constante por Slack/chat. Nadie ve el estado del equipo sin interrumpir a alguien.
- Quién cobra el valor: los pares, no un lead. No hay reporte hacia arriba y a un manager le daría igual. Duele a los dos devs que descubren tarde que iban a lo mismo, y al que interrumpe a otro para preguntar.
- Episodio concreto: dos personas del equipo tocaron el mismo módulo la misma semana porque una empezó sin que la otra lo supiera. Dos días perdidos.
- Qué reunión desaparece (respuesta honesta, no la vendas de más): la daily NO desaparece entera. Desaparece la ronda de "¿en qué estás?", que hoy se come la mitad de los 15 minutos. La parte de bloqueos sigue, y este MVP no la resuelve.
- Usuarios / equipo: equipos remotos pequeños, 3–10 personas. Roles planos: en el MVP todos ven y editan lo mismo, sin jerarquía de permisos.
- Primer usuario concreto: equipo de 6 personas de producto SaaS, en 3 husos horarios, que hoy usa un gestor de tareas pesado y una daily de 15 minutos por videollamada. Es un CASO DE ESTUDIO, no un cliente real.
- Fronteras: un espacio único compartido, sin entidad "equipo". Varios equipos separados, o gente en más de uno, queda FUERA del MVP: se anota como supuesto en el PRD, no se construye.
- "Tiempo real" = ver los cambios de estado de las tareas sin refrescar ni preguntar. NO es chat, NO es videollamada, NO es colaboración simultánea sobre el mismo documento.
- Es frescura, no presencia: el estado es de la TAREA, no de la persona. Nada de "quién está conectado ahora" ni indicadores de actividad; eso es vigilancia y lo rechazamos a propósito.
- Forma de la señal: resumen que espera, no aviso que interrumpe. El caso es "llego por la mañana o vuelvo de una reunión y veo qué se ha movido". Sin notificaciones push.
- Qué decisión cambia: no empezar algo que otra persona ya está tocando, y elegir lo siguiente sabiendo qué está libre. Si la única respuesta fuera "sentirse informado", el tiempo real no valdría lo que cuesta.
- De dónde sale el estado: lo teclea la persona que hace la tarea, en segundos. Derivarlo de señales externas (Git/PRs, CI, calendario) está FUERA del MVP: es otro producto, con integraciones y OAuth de terceros.
- Por qué se sostiene: no porque sea más agradable, sino porque son dos clics sobre una lista ya abierta, sin campos obligatorios, sin decidir sprint ni estimación. Y quien lo escribe cobra en el momento: esa misma lista es su cola de trabajo, la mira para decidir qué coge, y de paso deja de recibir interrupciones preguntándole cómo va. Si el beneficio fuera solo para los demás, no lo escribiría.
- Si la información se queda vieja: el producto pierde el sentido, y lo asumo. Es el riesgo #1 a validar, no un detalle. La mitigación es que actualizar cueste dos clics, no obligar a nadie.
- Es donde se hace el trabajo, no donde se cuenta: sustituye al gestor de tareas, no convive con él. FlowSync crea las tareas, no lee las de otro sitio. Convivir exigiría doble actualización, que es como muere esta categoría.
- Renuncia explícita a sprints, estimaciones, épicas, backlog priorizado e informes. Un equipo que necesite eso no es nuestro usuario.
- "Menos rollo que Jira" = crear una tarea y cambiarle el estado en segundos, sin flujos de configuración ni campos obligatorios. Lo mínimo para saber quién está en qué.
- Qué necesita una tarea en el MVP: título, responsable, estado y fecha de vencimiento. La fecha, para ver de un vistazo qué se ha pasado de plazo.
- Cómo se consume la lista: filtrando por estado, para centrarse en lo pendiente.
- Éxito para el usuario: dejar de hacer la ronda de "¿en qué estás?" de la daily porque el estado del equipo se ve de un vistazo.
- Criterio a una semana de uso real: que el equipo cancele esa ronda y nadie pida que vuelva. Si la siguen haciendo igual, no funcionó.
- Cuánto construir: una vertical fina y usable de punta a punta, no el andamiaje amplio de un producto. Prefiero una capability terminada a tres a medias.

Queda totalmente fuera del alcance las siguientes funcionalidades:

- Fuera del MVP: notificaciones push, integración con Slack, roles/permisos avanzados, analítica/reporting, comentarios en tareas.
```

**Qué salió:** El prompt no pedía el alcance y aun así lo propuso entero: 9 puntos dentro, 5 supuestos y 2 incoherencias de la ficha (campos obligatorios; tiempo real frente a resumen que espera).

## Prompt 4

**Modelo:** Claude Opus 5.5 · medium
**Herramienta:** Claude Code

```
Dime si tus 5 preguntas responden a la ficha de hechos que te he adjuntado, debes de ser agresivo recortando y justifica cada exclusión
```

**Qué salió:** Confirmó que la ficha responde a las 5 preguntas, admitió que no preguntó "cuánto construir", y recortó de 9 a 6 con cada exclusión justificada contra H1–H3. El tiempo real se quedó dentro del alcance, señalado como la exclusión que no se atrevió a hacer.

## Prompt 5

**Modelo:** Claude Opus 5.5 · medium
**Herramienta:** Claude Code

```
Sí, mis iniciales son MAJ, escribe el documento
```

**Qué salió:** Creó la rama alcance-maj y docs/prd/alcance-mvp-maj.md con los tres tramos; dejó la parte B en blanco.

## Prompt 6

**Modelo:** Claude Opus 5.5 · medium
**Herramienta:** Claude Code

```
rellena prompts.md con mis prompts
```

**Qué salió:** Rellenó este archivo.

## Prompt 7

**Modelo:** Claude Opus 5.5 · medium
**Herramienta:** Claude Code

```
que nivel de esfuerzo tengo configurado para Opus 5.5?
```

**Qué salió:** Lo sacó de la variable de entorno CLAUDE_EFFORT=medium; avisó de que un cambio con /model no se ve desde ahí.

## Prompt 8

**Modelo:** Claude Opus 5.5 · medium
**Herramienta:** Claude Code

```
sí, ponlo en los 6 bloques
```

**Qué salió:** Añadió "· medium" al modelo de los 6 bloques.

## Prompt 9

**Modelo:** Claude Opus 5.5 · medium
**Herramienta:** Claude Code

```
Haz el commit a abre el pull request
```

**Qué salió:** Commit, PR #48 contra s2/start y revisión adversarial: mi parte B contradecía la ficha y el documento (6 en el alcance frente a 3 declarados).

## Prompt 10

**Modelo:** Claude Opus 5.5 · medium
**Herramienta:** Claude Code

```
Revisa la parte B
```

**Qué salió:** Reescribió la parte B para que case con los 6 puntos del alcance y añadió la nota 📌 sobre la corrección.

## Prompt 11

**Modelo:** Claude Opus 5.5 · medium
**Herramienta:** Claude Code

```
pasa otra vez el adversarial-reviewer sobre el PR
```

**Qué salió:** Segunda revisión: lo subido ya era coherente, pero aún había exclusiones sin hipótesis, un "Qué salió" erróneo en el Prompt 4, faltaba la cabecera de prompts.md y el documento era largo.

## Prompt 12

**Modelo:** Claude Opus 5.5 · medium
**Herramienta:** Claude Code

```
puedes corregir esto? 

 Algunas exclusiones del NO-alcance no dicen qué hipótesis no ayudan a validar: analítica, bloqueada, historial, borrar, presencia y roles (docs/prd/alcance-mvp-maj.md:64-73).
- El Prompt 4 de prompts.md dice que el tiempo real quedó como exclusión dudosa, pero al final se quedó dentro del alcance.
- prompts.md no tiene la cabecera de la plantilla.
- El documento es algo largo para el criterio de "cabe en una pantalla larga".
```

**Qué salió:** Agrupó el NO-alcance de 17 a 12 exclusiones, cada una con su hipótesis; corrigió el Prompt 4 y restauró la cabecera.

## Prompt 13

**Modelo:** Claude Opus 5.5 · medium
**Herramienta:** Claude Code

```
ya he ajustado la parte B, compruébalo de nuevo
```

**Qué salió:** Confirmó que los números (9 → 6) y la tensión del punto 3 ya cuadran; sugirió no dejar el punto 2 en "Ninguna", concretar el punto 3 y arreglar una sangría.

## Prompt 14

**Modelo:** Claude Opus 5.5 · medium
**Herramienta:** Claude Code

```
toca el punto 3
```

**Qué salió:** Lo interpretó como el punto 3 de su lista (formato) y solo arregló la sangría del punto 3 de la parte B.

## Prompt 15

**Modelo:** Claude Opus 5.5 · medium
**Herramienta:** Claude Code

```
proponme tres  exclusiones coherentes con mis propuestas en el Punto 2
```

**Qué salió:** Propuso varios responsables, presencia y estado "bloqueada", justificadas con H2 y H3.

## Prompt 16

**Modelo:** Claude Opus 5.5 · medium
**Herramienta:** Claude Code

```
no, déjalo tal y como esta
```

**Qué salió:** No tocó la parte B.

## Prompt 17

**Modelo:** Claude Opus 5.5 · medium
**Herramienta:** Claude Code

```
sí, haz el commit y el push
```

**Qué salió:** Commit cfaf78d subido al PR #48.

## Prompt 18

**Modelo:** Claude Opus 5.5 · medium
**Herramienta:** Claude Code

```
sí, añádelos a prompts.md
```

**Qué salió:** Añadió los prompts 13 a 18 a este archivo.

## Prompt 19

**Modelo:** Claude Opus 5.5 · medium
**Herramienta:** Claude Code

```
pasa otra vez el adversarial-reviewer sobre el PR
```

**Qué salió:** Tercera revisión: nada que rompa la entrega; señaló que mi recorte propio acabó en cero, que la exclusión dudosa está dentro del alcance, la longitud y que al punto 1 del alcance le faltaba su hipótesis.

## Prompt 20

**Modelo:** Claude Opus 5.5 · medium
**Herramienta:** Claude Code

```
sí, añade H1 y haz commit y push
```

**Qué salió:** Añadió *(H1)* al punto 1 del alcance y subió el cambio al PR #48.
