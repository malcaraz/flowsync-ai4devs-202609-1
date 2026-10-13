## Purpose

Mantener una única lista de tareas compartida por todo el equipo, en la que cualquiera puede apuntar una tarea con solo su título y ver de un vistazo quién lleva cada una y en qué estado está.

## ADDED Requirements

### Requirement: Acceso a la API de tareas
El sistema SHALL exigir una cabecera `Authorization: Bearer <token>` válida en `GET /api/v1/tasks`, `POST /api/v1/tasks` y `PATCH /api/v1/tasks/:id`, y SHALL responder `401` con `{ "errors": [ { "message": "Unauthorized access" } ] }` sin ese token, sin devolver ni modificar ninguna tarea.

#### Scenario: Petición sin sesión
- **WHEN** se llama a cualquiera de las tres operaciones sin token o con un token revocado
- **THEN** la respuesta es `401` y no se devuelve, crea ni modifica ninguna tarea

#### Scenario: Cualquier cuenta tiene acceso completo
- **WHEN** cualquier persona registrada llama a las operaciones con su token
- **THEN** obtiene el mismo acceso que cualquier otra, sin roles ni permisos adicionales

### Requirement: Operaciones disponibles
El sistema SHALL ofrecer sobre las tareas exactamente tres operaciones: listar todas, crear una y actualizar una; y SHALL no ofrecer lectura individual, borrado ni operaciones sobre el equipo o sus miembros.

#### Scenario: Sin lectura individual ni borrado
- **WHEN** se llama con un token válido a `GET /api/v1/tasks/:id` o a `DELETE /api/v1/tasks/:id`
- **THEN** la respuesta es `404` y la tarea no cambia

### Requirement: Forma pública de una tarea
Siempre que la API devuelva una tarea, el sistema SHALL exponer exactamente `id`, `title`, `status` y `assignee`, siendo `assignee` un objeto con solo `id` y `fullName` del responsable; y SHALL no exponer el email ni ningún otro dato de la cuenta del responsable, ni fechas de ningún tipo.

#### Scenario: Responsable sin email
- **WHEN** una respuesta incluye una tarea cuyo responsable tiene email y nombre
- **THEN** `assignee` contiene solo su `id` y su `fullName`, y el email no aparece en ninguna parte de la tarea

#### Scenario: Responsable sin nombre
- **WHEN** el responsable de una tarea no tiene nombre
- **THEN** `assignee.fullName` es `null`

#### Scenario: Sin fechas
- **WHEN** se devuelve cualquier tarea
- **THEN** no contiene fecha de vencimiento, de creación ni de modificación

### Requirement: Listado compartido
El sistema SHALL responder a `GET /api/v1/tasks` con `200` y `{ "data": [ <tarea>, ... ] }` conteniendo todas las tareas existentes, idénticas para cualquier persona que la pida, sin aplicar un orden explícito, y SHALL no modificar ninguna tarea al listarlas.

#### Scenario: Mismo contenido para todos
- **WHEN** dos personas distintas piden la lista sin que nadie haya cambiado nada entre medias
- **THEN** reciben exactamente el mismo conjunto de tareas con los mismos datos

#### Scenario: Tareas de otros incluidas
- **WHEN** otra persona ha creado una tarea de la que es responsable
- **THEN** esa tarea aparece en la lista de cualquier otra persona

#### Scenario: Sin tareas
- **WHEN** no se ha creado ninguna tarea
- **THEN** la respuesta es `200` con `data` igual a una lista vacía

#### Scenario: Listar no cambia nada
- **WHEN** se pide la lista una o varias veces
- **THEN** ninguna tarea cambia de título, estado ni responsable

### Requirement: Creación con solo el título
El sistema SHALL aceptar `POST /api/v1/tasks` con un cuerpo JSON que contenga `title`, crear la tarea en estado `pending` con quien hace la petición como responsable, y responder `200` con `{ "data": <tarea> }`; cualquier otro campo del cuerpo SHALL ignorarse.

#### Scenario: Creación correcta
- **WHEN** una persona envía `title: "Preparar la demo"`
- **THEN** la respuesta es `200` con una tarea de título `"Preparar la demo"`, `status: "pending"` y como `assignee` la propia persona

#### Scenario: Intento de fijar estado o responsable al crear
- **WHEN** el cuerpo incluye además `status: "done"` o el id de otra persona como responsable
- **THEN** la tarea se crea igualmente en `pending` y con quien la crea como responsable

#### Scenario: Espacios sobrantes
- **WHEN** `title` lleva espacios al principio o al final
- **THEN** la tarea se guarda con el título sin esos espacios

### Requirement: Título obligatorio y acotado
El sistema SHALL rechazar con `422` y el formato `{ "errors": [ { message, rule, field, meta? } ] }` una creación cuyo título falte, quede vacío tras quitar los espacios de los extremos o supere los 255 caracteres, sin crear ninguna tarea ni recortar el título.

#### Scenario: Sin título
- **WHEN** el cuerpo no incluye `title`, o lo incluye vacío
- **THEN** la respuesta es `422` con un error de regla `required` sobre `title` y no se crea ninguna tarea

#### Scenario: Título solo con espacios
- **WHEN** `title` contiene únicamente espacios
- **THEN** la respuesta es la misma que con el título vacío y no se crea ninguna tarea

#### Scenario: Título demasiado largo
- **WHEN** `title` tiene 256 caracteres o más tras quitar los espacios de los extremos
- **THEN** la respuesta es `422` con un error de regla `maxLength` sobre `title` con `meta.max: 255`, y no se guarda ninguna versión recortada

#### Scenario: Título en el límite
- **WHEN** `title` tiene exactamente 255 caracteres
- **THEN** la tarea se crea con el título completo

### Requirement: Estados fijos
El sistema SHALL admitir para una tarea únicamente los estados `pending`, `in_progress` y `done`, SHALL rechazar con `422` y un error de regla `enum` sobre `status` cualquier otro valor, y SHALL no ofrecer ninguna forma de añadir, renombrar ni eliminar estados.

#### Scenario: Estado desconocido
- **WHEN** se intenta actualizar una tarea con `status: "blocked"`
- **THEN** la respuesta es `422` con un error de regla `enum` sobre `status` y la tarea no cambia

#### Scenario: Valor en castellano
- **WHEN** se intenta actualizar una tarea con `status: "Hecho"` o `status: "pendiente"`
- **THEN** la respuesta es `422` y la tarea no cambia

### Requirement: Actualización de estado y responsable
El sistema SHALL aceptar `PATCH /api/v1/tasks/:id` con `status` y/o `assigneeId`, aplicar los campos presentes a la tarea indicada sea quien sea su responsable, y responder `200` con `{ "data": <tarea actualizada> }`; cualquier otro campo, incluido `title`, SHALL ignorarse.

#### Scenario: Cambio de estado de una tarea ajena
- **WHEN** una persona envía `status: "in_progress"` para una tarea cuyo responsable es otra persona
- **THEN** la respuesta es `200` con la tarea en `in_progress` y el mismo responsable

#### Scenario: Transiciones libres
- **WHEN** una tarea en `done` se actualiza a `pending` o a `in_progress`
- **THEN** el cambio se aplica igual que cualquier otro

#### Scenario: Reasignación
- **WHEN** se envía `assigneeId` con el id de una cuenta existente
- **THEN** la respuesta es `200` y la tarea tiene a esa cuenta como `assignee`

#### Scenario: Responsable inexistente
- **WHEN** se envía `assigneeId` con un id que no corresponde a ninguna cuenta
- **THEN** la respuesta es `422` con un error de regla `database.exists` sobre `assigneeId` y la tarea no cambia

#### Scenario: El título no se edita
- **WHEN** el cuerpo incluye `title`
- **THEN** el título de la tarea no cambia

#### Scenario: Tarea inexistente
- **WHEN** se actualiza un id que no corresponde a ninguna tarea
- **THEN** la respuesta es `404`

### Requirement: Pantalla de la lista de tareas
La aplicación web SHALL mostrar en `/tasks`, a cualquier persona con sesión, una única lista con todas las tareas en el orden recibido, en la que cada fila muestra el título, el nombre del responsable y el estado como "Pendiente", "En curso" o "Hecho", sin necesidad de abrir nada.

#### Scenario: Lo que dice cada fila
- **WHEN** la persona abre la lista y hay tareas
- **THEN** cada fila muestra el título, el nombre del responsable y su estado en castellano, y no hay ninguna fila sin título

#### Scenario: Responsable sin nombre
- **WHEN** el responsable de una tarea no tiene nombre
- **THEN** la fila muestra "Sin nombre" como responsable, nunca su email ni su id

#### Scenario: Sin fechas ni presencia
- **WHEN** la persona recorre la lista
- **THEN** no ve fechas, marcas de vencimiento ni ninguna señal de quién está conectado o de su actividad

#### Scenario: Una sola vista
- **WHEN** la persona busca otras vistas de tareas en la aplicación
- **THEN** no existe ninguna vista «mis tareas» ni filtro por persona: solo la lista del equipo

#### Scenario: Navegación al perfil
- **WHEN** la persona pulsa el enlace a su perfil desde la lista
- **THEN** llega a `/profile`

### Requirement: Lista vacía
Cuando no exista ninguna tarea, la aplicación web SHALL explicar en la lista qué es y ofrecer crear la primera, en lugar de mostrar una lista vacía sin más.

#### Scenario: Primera visita a un espacio sin tareas
- **WHEN** la persona abre la lista y no hay ninguna tarea
- **THEN** ve un mensaje que explica que aquí verá todo el equipo sus tareas y le invita a crear la primera con el campo de título

### Requirement: Crear tarea desde la lista
La aplicación web SHALL ofrecer en la propia lista un formulario cuyo único campo es el título y un botón "Crear tarea", sin pedir ni sugerir responsable, estado, fecha ni ningún otro dato, y SHALL mostrar la tarea creada en la lista al terminar, sin recargar ni navegar.

#### Scenario: Creación desde la lista
- **WHEN** la persona escribe un título y pulsa "Crear tarea"
- **THEN** la tarea aparece en la lista con ella como responsable y en "Pendiente", el campo queda vacío y la persona sigue en la lista

#### Scenario: Nada más que el título
- **WHEN** la persona recorre el formulario de creación
- **THEN** el único dato que se le pide es el título

#### Scenario: Botón mientras se crea
- **WHEN** la persona pulsa "Crear tarea"
- **THEN** el botón queda deshabilitado mientras espera la respuesta

### Requirement: Errores del título en pantalla
La aplicación web SHALL mostrar en castellano, debajo del campo de título, por qué se rechaza una creación, y SHALL no añadir ninguna fila a la lista en ese caso.

#### Scenario: Título vacío o en blanco
- **WHEN** la persona pulsa "Crear tarea" con el título vacío o solo con espacios
- **THEN** aparece "Falta rellenar el título." bajo el campo y la lista no cambia

#### Scenario: Título demasiado largo en pantalla
- **WHEN** la persona intenta crear una tarea con un título de más de 255 caracteres
- **THEN** aparece "el título no puede superar los 255 caracteres." bajo el campo, el texto escrito se conserva sin recortar y la lista no cambia

#### Scenario: Servidor inalcanzable al crear
- **WHEN** la persona intenta crear una tarea y el servidor no responde
- **THEN** aparece el aviso "No se pudo conectar con el servidor. Comprueba que el backend está arrancado." y el título escrito se conserva

### Requirement: Cambiar el estado desde la fila
La aplicación web SHALL ofrecer en cada fila los tres estados "Pendiente", "En curso" y "Hecho" como únicas opciones, marcando el actual, y SHALL aplicar el estado elegido con un solo clic, sin abrir la tarea, sin diálogo de confirmación y sin rellenar ningún campo, para cualquier tarea sea quien sea su responsable.

#### Scenario: Cambio con un clic
- **WHEN** la persona pulsa "En curso" en una fila que está en "Pendiente"
- **THEN** la fila pasa a mostrar "En curso" como estado actual de inmediato, sin diálogo ni aviso

#### Scenario: Tarea de otra persona
- **WHEN** la persona cambia el estado de una tarea cuyo responsable es otra
- **THEN** el cambio se aplica igual que en una tarea propia, sin advertencias ni permisos

#### Scenario: Solo tres destinos
- **WHEN** la persona mira las opciones de estado de una fila
- **THEN** solo existen "Pendiente", "En curso" y "Hecho", y la tarea está siempre en exactamente uno de ellos

#### Scenario: Volver desde Hecho
- **WHEN** la persona pulsa "Pendiente" o "En curso" en una tarea en "Hecho"
- **THEN** la tarea pasa a ese estado

#### Scenario: Fallo al guardar el estado
- **WHEN** la persona cambia un estado y el servidor rechaza el cambio o no responde
- **THEN** la fila vuelve a mostrar el estado anterior y aparece un aviso con el motivo

### Requirement: Lista protegida
La aplicación web SHALL no mostrar ninguna tarea a quien no haya iniciado sesión.

#### Scenario: Abrir la lista sin sesión
- **WHEN** una persona sin sesión abre `/tasks`
- **THEN** es llevada a la pantalla de inicio de sesión sin ver ninguna tarea
