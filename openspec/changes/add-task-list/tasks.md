# Tasks

## 1. Datos

- [ ] 1.1 Crear la migración `create_tasks_table` (`title` string(255), `status` string default `'pending'`, `assignee_id` FK a `users.id` con `onDelete('CASCADE')`, timestamps) y ejecutar `node ace migration:run`; verificar que `database/schema.ts` contiene `TaskSchema` con `title`, `status` y `assigneeId`
- [ ] 1.2 Crear el modelo `app/models/task.ts` que extiende `TaskSchema`, con la relación `belongsTo` `assignee` y la constante `TASK_STATUSES = ['pending', 'in_progress', 'done'] as const`; verificar con `npm run typecheck` en `backend/`

## 2. API de tareas

- [ ] 2.1 Crear `app/validators/task.ts` con `createTaskValidator` (`title`: string, trim, maxLength 255) y `updateTaskValidator` (`status`: enum de `TASK_STATUSES` opcional; `assigneeId`: número entero que existe en `users.id`, opcional) usando `vine.create`; verificar con `npm run typecheck`
- [ ] 2.2 Crear `app/transformers/task_transformer.ts` que devuelve solo `id`, `title`, `status` y `assignee: { id, fullName }`, sin email, iniciales ni fechas; verificar con `npm run typecheck`
- [ ] 2.3 Crear `app/controllers/tasks_controller.ts` con `index` (todas, con `preload('assignee')`, sin `orderBy`), `store` (estado `pending` y responsable = usuario autenticado) y `update` (`findOrFail`, aplica `status`/`assigneeId` presentes, sin comprobar propiedad); verificar con `npm run typecheck`
- [ ] 2.4 Registrar en `start/routes.ts` el grupo `/api/v1/tasks` con `GET /`, `POST /` y `PATCH /:id` bajo `middleware.auth()`, sin `router.resource`; verificar con `node ace list:routes` que aparecen exactamente esas tres rutas de tareas
- [ ] 2.5 Arrancar el dev server para regenerar `.adonisjs/` (controladores y registro Tuyau) y verificar que el diff incluye `TasksController` y las tres rutas nuevas
- [ ] 2.6 Comprobar a mano con `curl` (dev server arrancado, con copia de seguridad de `tmp/db.sqlite3`) los escenarios de la spec `tasks`: `401` sin token; creación con `200`, `pending` y el autor como responsable aunque el cuerpo traiga `status`/`assigneeId`; `422 required` con título ausente, vacío o de espacios; `422 maxLength` con 256 caracteres y éxito con 255; `422 enum` con `status: "blocked"` y `"Hecho"`; `422 database.exists` con `assigneeId` inexistente; `404` en `PATCH` de id inexistente y en `GET`/`DELETE` de `/api/v1/tasks/:id`; `title` ignorado en `PATCH`; transición `done` → `pending`; la tarea no expone email ni fechas
- [ ] 2.7 Pasar `npm run lint` y `npm run typecheck` en `backend/` sin errores
- [ ] 2.8 Actualizar la tabla de rutas de `CLAUDE.md` con las tres rutas de tareas y verificar que coincide con `node ace list:routes`

## 3. Cliente de API y tipos en el frontend

- [ ] 3.1 Añadir a `src/lib/types.ts` `TaskStatus`, `Task` (con `assignee: { id, fullName: string | null }`), `CreateTaskPayload` y `UpdateTaskPayload`; verificar con `npm run build` en `frontend/`
- [ ] 3.2 Crear `src/lib/task-status.ts` con `TASK_STATUSES` y `STATUS_LABELS` (`Pendiente`, `En curso`, `Hecho`) como único lugar de las etiquetas en castellano; verificar con `npm run build`
- [ ] 3.3 Ampliar `src/lib/api.ts`: método `PATCH` en `request`, `title: 'el título'` en `FIELD_LABELS`, `case 'enum'` en `translate`, y las funciones `listTasks`, `createTask` y `updateTask` que desenvuelven `{ data }`; verificar con `npm run build` y `npm run lint`

## 4. Pantalla de tareas

- [ ] 4.1 Crear `src/pages/tasks-page.tsx` con la carga inicial (`FullScreenLoader` mientras carga, `Alert` si falla), cabecera "Tareas del equipo" con enlace "Mi perfil" y filas con título, responsable (`fullName` o "Sin nombre") y estado; verificar en el navegador que una tarea de una cuenta sin nombre muestra "Sin nombre" y que no aparece ningún email, id ni fecha
- [ ] 4.2 Añadir el estado vacío que explica la lista e invita a crear la primera; verificar en el navegador con la tabla de tareas vacía
- [ ] 4.3 Añadir el formulario de solo título con `useAuthForm(['title'])`, botón "Crear tarea" deshabilitado mientras envía, la tarea devuelta añadida al final de la lista y el campo vaciado al terminar; verificar en el navegador que la tarea aparece en "Pendiente" a nombre de quien la crea sin recargar, y que vacío, solo espacios y 256 caracteres muestran el error bajo el campo conservando el texto
- [ ] 4.4 Añadir en cada fila los tres botones de estado (actual en `default` con `aria-pressed`, resto en `outline`) con cambio optimista, rollback de la fila y `Alert` si falla; verificar en el navegador que un clic cambia el estado al instante, también desde "Hecho" y en tareas de otra persona, y que con el backend parado la fila vuelve a su estado y aparece el aviso de conexión
- [ ] 4.5 Pasar `npm run lint` y `npm run build` en `frontend/` sin errores

## 5. Navegación

- [ ] 5.1 En `src/routes/app-routes.tsx`, registrar `/tasks` dentro de `ProtectedRoute` y cambiar el catch-all a `/tasks`; en `public-only-route.tsx`, redirigir a `/tasks`; verificar en el navegador que tras login y registro se llega a `/tasks`, que con sesión `/login` y `/register` llevan a `/tasks`, que una URL desconocida lleva a `/tasks` y que sin sesión `/tasks` lleva a `/login`
- [ ] 5.2 Añadir en `src/pages/profile-page.tsx` el enlace "Volver a las tareas" a `/tasks`; verificar en el navegador la ida y vuelta entre lista y perfil sin perder la sesión
- [ ] 5.3 Pasar `npm run lint` y `npm run build` en `frontend/` sin errores

## 6. Comprobación integrada

- [ ] 6.1 Con dos cuentas en dos navegadores (una sin nombre), verificar que ambas ven el mismo conjunto de tareas tras recargar, que cada una ve las creadas por la otra, que cualquiera cambia el estado de cualquier tarea y que no existe vista «mis tareas», filtro, fecha ni indicador de presencia
- [ ] 6.2 Ejecutar `openspec validate add-task-list --strict` y verificar que el change es válido
