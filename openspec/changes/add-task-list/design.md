# Design

## Context

Ver `proposal.md` — Why. El backend (AdonisJS 7 + Lucid 22 + SQLite) solo tiene usuarios y tokens de acceso; el frontend (React 19 + Vite 8) solo tiene login, registro y perfil. Restricciones que condicionan el diseño:

- El esquema de modelos se genera desde las migraciones (`database/schema.ts`); los modelos solo añaden relaciones y lógica.
- Toda respuesta pasa por `ctx.serialize()` con un transformer (`{ data: ... }`).
- El bodyparser ya recorta espacios y convierte las cadenas vacías en `null` (`trimWhitespaces` + `convertEmptyStringsToNull` por defecto), así que `"   "` llega como `null` al validador.
- `frontend/src/lib/api.ts` es el único punto de contacto con la API y ya traduce los errores de VineJS a castellano por campo.
- `components/ui/` solo tiene `alert`, `button`, `card`, `input` y `label`; no se añaden componentes ni dependencias.

## Goals / Non-Goals

**Goals:**
- Tres endpoints (listar, crear, actualizar) con validación cerrada de estados y exposición mínima del responsable.
- Una página `/tasks` que cumpla el gesto de un clic para cambiar estado y muestre lo creado sin recargar.
- Reutilizar al máximo lo existente: guard `auth`, serializer, `ApiError`, `useAuthForm`, `ProtectedRoute`, `Card`/`Button`/`Input`/`Alert`.

**Non-Goals:**
- Ordenación, agrupación, filtros, paginación, refresco automático, fecha de vencimiento, borrado, lectura individual, listado de personas.
- Reasignación desde la interfaz.
- Tests o infraestructura de pruebas.

## Decisions

### Datos

- **Migración `create_tasks_table`**: `id` (increments), `title` (`string(255)`, not null), `status` (`string`, not null, default `'pending'`), `assignee_id` (integer unsigned, not null, FK → `users.id`, `onDelete('CASCADE')`), `created_at`, `updated_at`.
  - `status` como string y no como `enum` de la BD: SQLite no tiene enum nativo y la validación vive en VineJS, que es lo que produce el `422`. *Alternativa descartada*: `table.enum(...)` genera un CHECK en SQLite cuyo error sería un 500, no un 422.
  - Los timestamps existen en la tabla (convención de Lucid y del resto del esquema) pero **no se exponen**: no son fecha de vencimiento ni se pintan. *Alternativa descartada*: omitirlos — rompe la convención de los modelos generados sin ganar nada observable.
  - `onDelete('CASCADE')` replica la convención de `auth_access_tokens`. Hoy no hay forma de borrar usuarios, así que no es observable.
- **Modelo `Task`** extiende `TaskSchema` generado y declara `@belongsTo(() => User, { foreignKey: 'assigneeId' }) declare assignee`.
- **Constante de estados** `TASK_STATUSES = ['pending', 'in_progress', 'done'] as const` en el modelo, compartida por validador y default. Identificadores en inglés; las etiquetas en castellano viven solo en el frontend.

### API

- **Rutas** en `start/routes.ts`, nuevo grupo `/api/v1/tasks` con `.use(middleware.auth())`:
  - `GET /` → `TasksController.index`
  - `POST /` → `TasksController.store`
  - `PATCH /:id` → `TasksController.update`
  - No se usa `router.resource` para no abrir `show`/`destroy` por accidente. Cualquier otra combinación método/ruta cae en el `404` del router.
- **`index`**: `Task.query().preload('assignee')` **sin `orderBy`**. El orden resultante es el que devuelva la BD; no se promete ninguno (PA-3).
- **`store`**: `request.validateUsing(createTaskValidator)` → `Task.create({ title, status: 'pending', assigneeId: auth.user.id })` → `load('assignee')` → transformer. El validador solo declara `title`, así que VineJS descarta `status`/`assigneeId` del cuerpo y nunca llegan al modelo.
- **`update`**: `Task.findOrFail(params.id)` (→ `404`) → `validateUsing(updateTaskValidator)` → `merge` de los campos presentes → `save` → `load('assignee')`. Sin comprobación de propiedad: cualquiera puede actualizar cualquier tarea. `title` no está en el validador, así que se ignora.
  - Cuerpo vacío o sin campos reconocidos: responde `200` con la tarea sin cambios. *Alternativa descartada*: exigir al menos un campo con `422` — añade una regla a medida sin caso de uso en la interfaz.
- **Validadores** (`app/validators/task.ts`, `vine.create`):
  - `createTaskValidator`: `title: vine.string().trim().minLength(1).maxLength(255)`. Hoy vacío o solo espacios llegan como `null` desde el bodyparser y fallan con `required`. `required` de VineJS solo salta con `null`/`undefined`, así que `.trim().minLength(1)` es la red real: si el bodyparser dejara de normalizar, `"   "` fallaría con `minLength` en vez de crearse una tarea sin título.
  - `updateTaskValidator`: con `present = (field) => Object.hasOwn(field.parent, field.name)`:
    - `status: vine.enum(TASK_STATUSES).optional().requiredWhen(present)`
    - `assigneeId: vine.number({ strict: true }).withoutDecimals().exists({ table: 'users', column: 'id' }).optional().requiredWhen(present)`
    - Motivo (verificado ejecutando VineJS): `.optional()` a secas deja pasar `null`, y el bodyparser convierte `""` en `null`, así que `status: ""` o `status: null` acabarían en un `200` sin cambios. Con `requiredWhen(present)` un campo ausente se ignora, pero uno presente con `null`/`""` da `422 required`. `strict: true` evita que `true` o `"2"` se coerzan a número.
- **`TaskTransformer`**: `{ id, title, status, assignee: { id, fullName } }`. El responsable se construye a mano con `pick(assignee, ['id', 'fullName'])` en lugar de reutilizar `UserTransformer`, que expone email, iniciales y fechas. Esta es la frontera de privacidad que pide la nota de E3-1.
- **Códigos**: creación responde `200` (como `signup`), no `201`, por coherencia con el resto de la API.

### Frontend

- **Tipos** en `lib/types.ts`: `TaskStatus = 'pending' | 'in_progress' | 'done'`, `Task = { id, title, status, assignee: { id, fullName: string | null } }`, `CreateTaskPayload`, `UpdateTaskPayload`.
- **`lib/api.ts`**: `listTasks(token)`, `createTask(token, payload)`, `updateTask(token, id, payload)`. Se amplía `RequestOptions.method` con `'PATCH'` y `FIELD_LABELS` con `title: 'el título'`. Así los errores del título salen como "Falta rellenar el título." y "el título no puede superar los 255 caracteres." sin lógica nueva. Se añade `case 'enum'` → "Elige un estado válido." por completitud, aunque la interfaz no puede provocarlo.
- **Etiquetas de estado**: mapa `STATUS_LABELS: Record<TaskStatus, string>` (`Pendiente`, `En curso`, `Hecho`) en un módulo propio (`lib/task-status.ts`); es el único sitio donde aparecen en castellano.
- **Página `pages/tasks-page.tsx`**, con la estructura visual del perfil (`Card` centrada, más ancha):
  - Cabecera "Tareas del equipo" con enlace "Mi perfil" → `/profile`.
  - Formulario de una línea: `Label` + `Input` de título (sin atributo `maxLength`, para que el aviso salga del servidor en lugar de recortar al teclear) + `Button` "Crear tarea". Usa `useAuthForm(['title'])` para el estado de envío y los errores por campo. Ese hook no tiene nada de auth salvo el nombre. *Alternativa descartada*: duplicarlo como `useTaskForm`.
  - Al crear: se añade la tarea devuelta **al final** del array local y se vacía el campo. No es una regla de orden: es la forma de mostrarla sin recargar mientras PA-3 siga abierto, y coincide con lo que devuelve hoy la lista al recargar.
  - Carga inicial: `listTasks` al montar, con `FullScreenLoader` mientras llega y `Alert` si falla.
  - Lista vacía: texto que explica la lista ("Aquí verá todo el equipo en qué está cada uno…") e invita a crear la primera con el campo de arriba.
  - Fila: título, responsable (`fullName ?? 'Sin nombre'`) y un grupo de tres `Button size="xs"`: el actual en `variant="default"` con `aria-pressed`, los otros en `outline`. *Alternativa descartada*: un `<select>` nativo — cuesta dos interacciones y desentona con `components/ui`.
  - Cambio de estado **optimista**: se pinta el nuevo estado al instante y se llama a `updateTask`; si falla, se restaura el estado anterior de esa fila y se muestra un `Alert` con el `message` del `ApiError`. Pulsar el estado actual no hace nada.
- **Rutas** (`routes/app-routes.tsx`): `/tasks` dentro de `ProtectedRoute`; el catch-all pasa a `<Navigate to="/tasks" replace />`. `PublicOnlyRoute` redirige a `/tasks`. Login y registro ya navegan a través de `PublicOnlyRoute`, así que el cambio de destino sale de ahí.
- **Perfil**: enlace "Volver a las tareas" (`Link` de react-router con estilo de `Button variant="link"`).

## Risks / Trade-offs

- [Sin orden definido, el orden de SQLite sin `ORDER BY` no está garantizado] → Se acepta y se documenta como PA-3; en la práctica SQLite devuelve por rowid. Cualquier orden explícito queda para cuando se decida la regla.
- [Optimismo en el cambio de estado puede mostrar brevemente un estado que el servidor rechaza] → Rollback por fila y aviso; es el precio de cumplir «se refleja de inmediato».
- [Dos personas cambian la misma tarea casi a la vez] → Gana la última escritura. La lista no se refresca sola (E3-2 fuera de alcance), así que cada persona ve su última acción hasta recargar.
- [Reasignación solo por API] → Nadie puede reasignar desde la interfaz hasta RF-10. Es una decisión explícita del proposal.
- [`useAuthForm` reutilizado fuera de auth] → Acopla por nombre; si crece, se renombra en un change aparte.
- [La reasignación por API permite averiguar nombres: `PATCH { assigneeId: N }` responde `422` si el id no existe y, si existe, devuelve su `fullName`, de modo que recorriendo ids se obtienen los nombres del equipo] → Se acepta: cualquier persona con sesión ya ve en la lista los nombres de quien tiene tareas, el email nunca se expone y la restricción de que cualquiera reasigne cualquier tarea es explícita. Si se considera un problema, el listado de personas de RF-10 obliga a revisarlo igualmente.
- [Un `401` en la página de tareas (token revocado en otra pestaña)] → Se muestra "Tu sesión ha caducado. Vuelve a iniciar sesión." en el aviso; la persona recarga y el arranque de la app la lleva al login. No se añade cierre automático de sesión en este change.

## Migration Plan

1. `node ace make:migration tasks` → `node ace migration:run` (crea la tabla y regenera `database/schema.ts`).
2. Arrancar el dev server para regenerar `.adonisjs/server/controllers.ts` y el registro de Tuyau, y commitear ese diff.
3. Rollback: `node ace migration:rollback` elimina la tabla; el frontend sin la ruta vuelve a la versión anterior.
