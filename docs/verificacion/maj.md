# Trazabilidad: «Lo que cada tarea muestra de su responsable»

Requisito de `openspec/specs/tasks/spec.md`.

**Scenarios del requisito: 3** · **Cubiertos: 2** (0 antes de escribir los tests de `backend/tests/functional/tasks/assignee.spec.ts`; el segundo scenario queda en «no lo sé», con su test en rojo)

| Scenario | Prueba que lo cubre | Estado | Si «no lo sé», qué faltó |
|---|---|---|---|
| Al obtener una tarea de "Ada Lovelace", su `assignee` trae ese nombre y sus iniciales | `Tasks \| responsable` › «el responsable llega con su nombre y sus iniciales» | Cubierto (verde) | |
| Al obtener una tarea, suelta o en la lista, su `assignee` no trae el email ni otros datos de acceso | `Tasks \| responsable` › «el responsable no trae el email ni datos de acceso, ni suelto ni en la lista» | No lo sé (test en **rojo**) | Si también incluye las respuestas de `POST /tasks` y `PATCH /tasks/:id/status`: el requisito dice «junto a la tarea», el scenario solo habla de «obtener», y el test no las mira. |
| Si el responsable se registró sin nombre, el `assignee` trae el nombre nulo y las iniciales igualmente | `Tasks \| responsable` › «un responsable sin nombre llega con el nombre nulo y sus iniciales» | Cubierto (verde) | |

Antes de los tests nuevos ninguna prueba de la suite pedía una tarea. Dos se parecían sin cubrir lo mismo:

- `Auth | iniciales` › «sin nombre, las iniciales salen del email»: afirma `data.user.initials` en la respuesta de `POST /api/v1/auth/login`, no en el `assignee` de una tarea.
- `Auth | registro` › «una cuenta puede quedarse sin nombre»: afirma `fullName` nulo en la respuesta del registro, no en una tarea.

**El rojo:** `GET /api/v1/tasks/:id` respeta el requisito, pero `GET /api/v1/tasks` devuelve el `email` del responsable. La lista, la creación y el cambio de estado serializan el `assignee` con `UserTransformer` (`backend/app/transformers/task_transformer.ts:9`) en vez de `TaskAssigneeTransformer`. Se entrega en rojo, sin arreglar el código.

**Lo que los tests no miran:** los scenarios 1 y 3 solo se comprueban sobre la tarea suelta; la creación (`POST /tasks`) y el cambio de estado (`PATCH /tasks/:id/status`) no se comprueban en ningún scenario, aunque también devuelven el email; y `createdAt`/`updatedAt` de la cuenta, que la lista expone, no se tratan como «dato de acceso».

## Las tres líneas

1. Cuántos scenarios creía cubiertos antes de mirar: 0 · cuántos lo estaban: 0

2. Hueco de test o hueco de spec:

En el segundo scenario, al obtener cualquier tarea, suelta o dentro de la lista, las respuestas de crear una tarea y la de cambiar el estado devuelven el email. La spec no contempla este caso por lo que considero que es un hueco de la spec.

3. Lo que el scenario no decidía por mí:

Para el tercer scenario, los valores de las iniciales vienen descritos en la spec de auth, si se cambia esa regla el test quedaría en rojo aunque el requisito de task seguiría cumpliéndose.
