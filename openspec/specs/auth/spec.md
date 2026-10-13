# auth Specification

## Purpose
Permitir que una persona cree una cuenta en FlowSync, inicie y cierre sesión mediante un token de acceso, y consulte su perfil, tanto a través de la API HTTP como desde las pantallas de la aplicación web.

## Requirements

### Requirement: Registro de cuenta
El sistema SHALL aceptar `POST /api/v1/auth/signup` con un cuerpo JSON que contenga `fullName`, `email`, `password` y `passwordConfirmation`, crear la cuenta y responder `200` con `{ "data": { "user": <usuario>, "token": <token> } }`, de modo que la cuenta recién creada queda ya con la sesión iniciada.

#### Scenario: Registro correcto
- **WHEN** se envía `fullName: "Ada Lovelace"`, un `email` no registrado, y `password` y `passwordConfirmation` iguales de entre 8 y 32 caracteres
- **THEN** la respuesta es `200` con `data.user` (con los datos públicos de la cuenta) y `data.token` (un token de acceso utilizable de inmediato)

#### Scenario: Nombre ausente de valor
- **WHEN** se envía `fullName: null` o `fullName: ""`
- **THEN** la cuenta se crea y `data.user.fullName` es `null`

#### Scenario: Espacios sobrantes
- **WHEN** `fullName` o `email` llevan espacios al principio o al final
- **THEN** la cuenta se crea con esos valores sin los espacios sobrantes

### Requirement: Validación del registro
El sistema SHALL rechazar un registro inválido con `422` y un cuerpo `{ "errors": [ ... ] }` en el que cada error indica `message`, `rule`, `field` y, cuando aplica, `meta`; y SHALL no crear ninguna cuenta.

#### Scenario: Campos ausentes
- **WHEN** el cuerpo no incluye alguno de `fullName`, `email`, `password` o `passwordConfirmation`
- **THEN** la respuesta es `422` con un error de regla `required` por cada campo ausente, incluido `fullName` aunque admita `null`

#### Scenario: Nombre que no es texto
- **WHEN** `fullName` es un valor que no es texto ni `null` (por ejemplo, un número)
- **THEN** la respuesta es `422` con un error de regla `string` sobre `fullName`

#### Scenario: Email mal formado o demasiado largo
- **WHEN** `email` no es una dirección de email válida o supera los 254 caracteres
- **THEN** la respuesta es `422` con un error de regla `email` o `maxLength` sobre `email`

#### Scenario: Contraseña fuera de longitud
- **WHEN** `password` o `passwordConfirmation` tienen menos de 8 o más de 32 caracteres
- **THEN** la respuesta es `422` con un error de regla `minLength` (con `meta.min: 8`) o `maxLength` (con `meta.max: 32`) sobre cada campo afectado

#### Scenario: Confirmación distinta
- **WHEN** `password` y `passwordConfirmation` tienen longitud válida pero no coinciden
- **THEN** la respuesta es `422` con un error de regla `sameAs` sobre `passwordConfirmation`

### Requirement: Email único por cuenta
El sistema SHALL impedir que dos cuentas compartan exactamente el mismo email, comparándolo de forma sensible a mayúsculas y minúsculas.

#### Scenario: Email ya registrado
- **WHEN** se intenta registrar un email idéntico al de una cuenta existente
- **THEN** la respuesta es `422` con un error de regla `database.unique` sobre `email`

#### Scenario: Mismo email con distinta capitalización
- **WHEN** existe `ana@ejemplo.com` y se registra `ANA@ejemplo.com`
- **THEN** el registro se acepta y se crea una cuenta distinta

### Requirement: Inicio de sesión
El sistema SHALL aceptar `POST /api/v1/auth/login` con `email` y `password` y, si las credenciales corresponden a una cuenta, responder `200` con `{ "data": { "user": <usuario>, "token": <token> } }`, emitiendo un token nuevo en cada inicio de sesión.

#### Scenario: Credenciales correctas
- **WHEN** se envían el email exacto y la contraseña de una cuenta existente
- **THEN** la respuesta es `200` con los datos públicos de esa cuenta y un token nuevo

#### Scenario: Varios inicios de sesión conviven
- **WHEN** la misma cuenta inicia sesión dos veces
- **THEN** se obtienen dos tokens distintos y ambos permiten acceder a las rutas protegidas

### Requirement: Credenciales incorrectas
El sistema SHALL responder `400` con `{ "errors": [ { "message": "Invalid user credentials" } ] }`, sin indicar campo, cuando el email no corresponde a ninguna cuenta o la contraseña no es la de esa cuenta, sin distinguir entre ambos casos.

#### Scenario: Contraseña equivocada
- **WHEN** se envía el email de una cuenta existente con una contraseña que no es la suya
- **THEN** la respuesta es `400` con el mensaje `Invalid user credentials`

#### Scenario: Email desconocido
- **WHEN** se envía un email que no pertenece a ninguna cuenta
- **THEN** la respuesta es idéntica a la de contraseña equivocada

### Requirement: Validación del inicio de sesión
El sistema SHALL rechazar con `422` y el mismo formato de errores por campo un inicio de sesión al que le falten campos o cuyo email esté mal formado, sin imponer longitud mínima a la contraseña en este paso.

#### Scenario: Campos ausentes
- **WHEN** el cuerpo no incluye `email` o `password`
- **THEN** la respuesta es `422` con un error `required` por cada campo ausente

#### Scenario: Email mal formado
- **WHEN** `email` no es una dirección de email válida
- **THEN** la respuesta es `422` con un error de regla `email` sobre `email`

#### Scenario: Contraseña corta
- **WHEN** se envía un email válido con una contraseña de un solo carácter que no es la de la cuenta
- **THEN** la respuesta es `400` de credenciales incorrectas, no un `422`

### Requirement: Datos públicos de la cuenta
Siempre que la API devuelva una cuenta, el sistema SHALL exponer exactamente `id`, `fullName`, `email`, `createdAt`, `updatedAt` e `initials`, y SHALL no exponer nunca la contraseña.

#### Scenario: Forma del usuario
- **WHEN** una respuesta de registro, inicio de sesión o perfil incluye la cuenta
- **THEN** el objeto contiene solo esos seis campos, con las fechas en formato ISO 8601

### Requirement: Iniciales de la cuenta
El sistema SHALL calcular `initials` en mayúsculas así: con nombre de dos o más palabras, la inicial de la primera y de la segunda palabra; con nombre de una sola palabra, sus dos primeras letras; sin nombre, la primera letra de la parte del email anterior a la `@` y la primera letra de la parte posterior.

#### Scenario: Nombre de varias palabras
- **WHEN** `fullName` es `"Ada Lovelace King"`
- **THEN** `initials` es `"AL"`

#### Scenario: Nombre de una palabra
- **WHEN** `fullName` es `"ada"`
- **THEN** `initials` es `"AD"`

#### Scenario: Sin nombre
- **WHEN** `fullName` es `null` y el email es `spec@x.com`
- **THEN** `initials` es `"SX"`

### Requirement: Consulta del perfil
El sistema SHALL responder a `GET /api/v1/account/profile` con `200` y `{ "data": <usuario> }` cuando la petición lleva una cabecera `Authorization: Bearer <token>` válida, y con `401` y `{ "errors": [ { "message": "Unauthorized access" } ] }` en cualquier otro caso.

#### Scenario: Token válido
- **WHEN** se pide el perfil con un token emitido por registro o inicio de sesión y no revocado
- **THEN** la respuesta es `200` con los datos públicos de la cuenta dueña del token

#### Scenario: Sin token o token inválido
- **WHEN** se pide el perfil sin cabecera `Authorization`, o con un token inventado o ya revocado
- **THEN** la respuesta es `401` con el mensaje `Unauthorized access`

### Requirement: Vigencia de los tokens
El sistema SHALL mantener válido un token de acceso, sin caducidad por tiempo, hasta que se revoque cerrando sesión con él.

#### Scenario: Token antiguo no revocado
- **WHEN** se usa un token emitido tiempo atrás y nunca usado para cerrar sesión
- **THEN** las rutas protegidas lo aceptan

### Requirement: Cierre de sesión
El sistema SHALL aceptar `POST /api/v1/account/logout` con un token válido, revocar únicamente ese token y responder `200` con `{ "message": "Logged out successfully" }`, sin el envoltorio `data`.

#### Scenario: Cierre correcto
- **WHEN** se cierra sesión con un token válido
- **THEN** la respuesta es `200` con `message: "Logged out successfully"` y, a partir de ese momento, ese token recibe `401` en cualquier ruta protegida

#### Scenario: Otras sesiones intactas
- **WHEN** una cuenta tiene dos tokens y cierra sesión con uno
- **THEN** el otro token sigue siendo aceptado

#### Scenario: Cierre sin sesión
- **WHEN** se llama a cerrar sesión sin token o con un token ya revocado
- **THEN** la respuesta es `401` con el mensaje `Unauthorized access`

### Requirement: Respuestas siempre en JSON
El sistema SHALL responder en JSON a todas las peticiones de la API de cuentas, incluidos los errores, con independencia de la cabecera `Accept` que envíe el cliente.

#### Scenario: Cliente que no pide JSON
- **WHEN** se pide el perfil sin token y con `Accept: text/html`
- **THEN** la respuesta es `401` con un cuerpo JSON `{ "errors": [...] }`

### Requirement: Pantalla de registro
La aplicación web SHALL ofrecer en `/register` un formulario "Crea tu cuenta" con los campos "Nombre completo (opcional)", "Email", "Contraseña" (con la ayuda "Entre 8 y 32 caracteres.") y "Repite la contraseña", un botón "Crear cuenta" y un enlace "Inicia sesión" hacia `/login`.

#### Scenario: Registro correcto desde la pantalla
- **WHEN** la persona rellena el formulario con datos válidos y pulsa "Crear cuenta"
- **THEN** el botón pasa a "Creando cuenta…" y queda deshabilitado mientras espera, y al terminar la persona llega a su perfil con la sesión iniciada

#### Scenario: Nombre en blanco
- **WHEN** la persona deja el nombre vacío o solo con espacios
- **THEN** la cuenta se crea sin nombre

#### Scenario: Contraseñas distintas
- **WHEN** la contraseña y su repetición no coinciden y la persona pulsa "Crear cuenta"
- **THEN** aparece "Las contraseñas no coinciden." bajo "Repite la contraseña" sin que se envíe nada al servidor

### Requirement: Pantalla de inicio de sesión
La aplicación web SHALL ofrecer en `/login` un formulario "Inicia sesión" con los campos "Email" y "Contraseña", un botón "Entrar" y un enlace "Crea una" hacia `/register`.

#### Scenario: Inicio de sesión correcto desde la pantalla
- **WHEN** la persona introduce credenciales correctas y pulsa "Entrar"
- **THEN** el botón pasa a "Entrando…" y queda deshabilitado mientras espera, y al terminar la persona llega a su perfil

#### Scenario: Credenciales incorrectas en pantalla
- **WHEN** la persona introduce un email o una contraseña que no son correctos
- **THEN** aparece un aviso destacado sobre el formulario con "El email o la contraseña no son correctos."

### Requirement: Errores en castellano en los formularios
Las pantallas de registro e inicio de sesión SHALL mostrar los errores de validación del servidor traducidos al castellano debajo del campo al que se refieren, mostrando como mucho un error por campo, y SHALL mostrar en un aviso sobre el formulario los errores que no correspondan a un campo visible y los errores generales.

#### Scenario: Error asociado a un campo
- **WHEN** el servidor rechaza el email por estar ya registrado
- **THEN** bajo "Email" aparece "Ese email ya está registrado. Inicia sesión en su lugar." y no aparece aviso general

#### Scenario: Mensajes traducidos por tipo de error
- **WHEN** el servidor rechaza un campo por estar vacío, por formato de email, por longitud o por no coincidir la confirmación
- **THEN** el mensaje bajo el campo es, respectivamente, "Falta rellenar <campo>.", "Introduce una dirección de email válida.", "<campo> debe tener al menos N caracteres." / "<campo> no puede superar los N caracteres.", o "Las contraseñas no coinciden."

#### Scenario: Servidor inalcanzable
- **WHEN** la persona envía un formulario y el servidor no responde
- **THEN** aparece el aviso "No se pudo conectar con el servidor. Comprueba que el backend está arrancado." y el botón vuelve a estar disponible

#### Scenario: Fallo interno del servidor
- **WHEN** el servidor responde con un error no previsto
- **THEN** aparece el aviso "Algo ha ido mal en el servidor. Inténtalo de nuevo en un momento."

### Requirement: Sesión persistente entre recargas
La aplicación web SHALL conservar la sesión iniciada al recargar o volver a abrir la página en el mismo navegador, comprobando con el servidor que sigue siendo válida antes de mostrar contenido protegido o público.

#### Scenario: Recarga con sesión válida
- **WHEN** una persona con sesión iniciada recarga la página
- **THEN** ve un indicador de carga mientras se comprueba la sesión y después sigue dentro, sin volver a introducir credenciales

#### Scenario: Sesión ya no válida
- **WHEN** se abre la aplicación y el servidor rechaza la sesión guardada
- **THEN** la persona acaba en la pantalla de inicio de sesión con el aviso "Tu sesión ha caducado. Vuelve a iniciar sesión.", y la sesión guardada se descarta

#### Scenario: Servidor caído al abrir
- **WHEN** se abre la aplicación con una sesión guardada y el servidor no responde
- **THEN** la persona ve la pantalla de inicio de sesión con el aviso de conexión, y si recarga cuando el servidor vuelve, recupera la sesión sin volver a introducir credenciales

### Requirement: Protección de pantallas
La aplicación web SHALL mostrar el perfil solo con sesión iniciada, SHALL mostrar las pantallas de registro e inicio de sesión solo sin sesión, y SHALL llevar cualquier otra dirección al perfil.

#### Scenario: Perfil sin sesión
- **WHEN** una persona sin sesión abre `/profile`
- **THEN** es llevada a `/login`

#### Scenario: Acceso con sesión ya iniciada
- **WHEN** una persona con sesión abre `/login` o `/register`
- **THEN** es llevada a `/profile`

#### Scenario: Dirección desconocida
- **WHEN** una persona abre cualquier dirección que no sea `/login`, `/register` ni `/profile`
- **THEN** es llevada a `/profile`, y de ahí a `/login` si no tiene sesión

### Requirement: Pantalla de perfil
La aplicación web SHALL mostrar en el perfil un círculo con las iniciales de la cuenta, el nombre completo (o "Sin nombre" si no lo tiene), el email y la fecha de alta como "Miembro desde" en formato de fecha larga en castellano.

#### Scenario: Cuenta sin nombre
- **WHEN** una persona registrada sin nombre abre su perfil
- **THEN** ve "Sin nombre" como título, su email debajo y las iniciales calculadas a partir del email

#### Scenario: Fecha de alta
- **WHEN** la cuenta se creó el 13 de octubre de 2026
- **THEN** el perfil muestra "Miembro desde" con "13 de octubre de 2026"

### Requirement: Cierre de sesión desde la pantalla
La aplicación web SHALL ofrecer en el perfil un botón "Cerrar sesión" que termina la sesión en el navegador y lleva a la pantalla de inicio de sesión, aunque el servidor no confirme el cierre.

#### Scenario: Cerrar sesión
- **WHEN** la persona pulsa "Cerrar sesión"
- **THEN** llega a la pantalla de inicio de sesión sin ningún aviso, y al recargar sigue sin sesión

#### Scenario: Servidor caído al cerrar sesión
- **WHEN** la persona pulsa "Cerrar sesión" y el servidor no responde
- **THEN** igualmente llega a la pantalla de inicio de sesión sin ningún aviso de error
