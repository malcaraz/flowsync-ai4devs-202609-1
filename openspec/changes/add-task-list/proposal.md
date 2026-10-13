## Why

FlowSync existe para que un equipo sepa «quién está en qué» sin preguntar, pero hoy solo tiene cuentas y perfil: no hay ni una tarea. Este change da de alta la capability de tareas con lo mínimo que hace útil el producto: una lista compartida, crear con solo un título y cambiar el estado desde la propia fila (historias E3-1, E2-1, E2-2, E2-3 y E2-4 del backlog).

## What Changes

- **API de tareas** bajo `/api/v1/tasks`, protegida por la sesión existente, con exactamente tres operaciones: listar todas, crear una y actualizar una. No hay lectura individual, borrado ni endpoints de equipo.
- **Modelo de tarea**: título (obligatorio, recortado, máximo 255 caracteres), estado y responsable. Los estados forman un conjunto cerrado que viaja como `pending`, `in_progress` y `done`; cualquier otro valor se rechaza con `422`. Sin fecha de vencimiento ni ningún otro campo.
- **Creación con solo el título**: la tarea nace en `pending` y con quien la crea como responsable; la petición no admite ni responsable ni estado.
- **Actualización** de estado y de responsable sobre cualquier tarea, por cualquier persona con sesión. Las transiciones entre estados son libres, también saliendo de `done`. La reasignación solo existe en la API: la pantalla no la ofrece.
- **Exposición mínima del responsable**: de la persona solo viajan su id y su nombre; nunca su email ni el resto de su cuenta.
- **Pantalla de lista de tareas** en `/tasks`: formulario de un solo campo (título), filas con título, nombre del responsable («Sin nombre» si no lo tiene) y estado pintado como Pendiente / En curso / Hecho, cambio de estado con un clic desde la fila y estado vacío que explica la lista y ofrece crear la primera. Reutiliza los componentes de `components/ui/` y el patrón de páginas y rutas del login; sin dependencias nuevas.
- **La lista pasa a ser la portada**: tras iniciar sesión o registrarse, y desde cualquier dirección desconocida, se llega a `/tasks` en vez de a `/profile`. Lista y perfil se enlazan entre sí.
- Sin tests: este change no monta base de pruebas ni escribe tests.

## Capabilities

### New Capabilities
- `tasks`: la lista de tareas compartida del equipo — creación con solo título, estados fijos, responsable por defecto, actualización de estado y responsable, y su pantalla.

### Modified Capabilities
- `auth`: cambian los destinos de navegación — el registro, el inicio de sesión, las pantallas solo-para-anónimos y las direcciones desconocidas llevan a la lista de tareas en lugar de al perfil; la lista queda entre las pantallas protegidas y el perfil ofrece volver a ella.

## Impact

- **Backend**: nueva migración (tabla de tareas con clave ajena al usuario responsable), modelo, validadores, transformer, controlador y tres rutas en el grupo autenticado. Se regeneran `database/schema.ts` y los ficheros versionados de `.adonisjs/`.
- **Frontend**: nuevas llamadas en el cliente de API, tipos, página de tareas, ruta protegida y cambios de redirección en las rutas y guards existentes; enlace entre perfil y lista.
- **Specs**: nueva spec viva `tasks`; la spec `auth` cambia sus requisitos de navegación.
- **Sin dependencias nuevas** ni cambios de configuración ni de variables de entorno.

## Open Points

- **Orden de la lista (PA-3)**: no hay regla decidida. La API no ordena explícitamente y la pantalla respeta el orden recibido; una tarea recién creada se añade al final de la vista. Mientras no se decida, la promesa de «enumerar el trabajo de cada persona» (E3-1 CA-5) depende de recorrer la lista entera.
- **Transiciones de estado (PA-7)**: se adoptan transiciones libres para que deshacer un «Hecho» por error cueste lo mismo que cometerlo. Queda abierto si hace falta algo más.
- **Límite del título (PA-9)**: se fija en 255 caracteres como decisión provisional de este change.
- **Reasignación en pantalla (RF-10)**: solo existe por API; elegir persona en la interfaz necesita un listado de personas que este change no expone.
- Fuera de alcance por decisión explícita: fecha de vencimiento, refresco automático de la lista (E3-2), presencia de quién está conectado, filtros y cualquier vista «mis tareas».
