# Spec viva: cuentas y acceso

## Purpose

Permitir que una persona cree una cuenta, entre con su email y su contraseña, mantenga la sesión abierta entre recargas, consulte su perfil y cierre la sesión, tanto a través de la API como desde la pantalla.

## Requirements

### Requirement: Registro de cuenta
El sistema SHALL crear una cuenta nueva cuando recibe `POST /api/v1/auth/signup` con datos válidos, y SHALL responder con el usuario creado y un token de acceso.

#### Scenario: Registro con nombre
- **WHEN** no existe ninguna cuenta con `ada@example.com` y se envía `POST /api/v1/auth/signup` con `{ "fullName": "Ada Lovelace", "email": "ada@example.com", "password": "secreto123", "passwordConfirmation": "secreto123" }`
- **THEN** la respuesta es 200 con `{ "data": { "user": { ... }, "token": "<token>" } }`, donde `user.email` es `ada@example.com` y `user.fullName` es `Ada Lovelace`

#### Scenario: Registro sin nombre
- **WHEN** se envía `POST /api/v1/auth/signup` con `fullName: null` y el resto de campos válidos
- **THEN** la respuesta es 200 y `user.fullName` es `null`

### Requirement: Datos válidos para registrarse
El sistema SHALL rechazar con 422 un registro cuyos datos no sean válidos, con un cuerpo `{ "errors": [{ "message", "rule", "field" }] }` que indica qué campo falla y por qué regla.

#### Scenario: Email ya registrado
- **WHEN** ya existe una cuenta con `ada@example.com` y se envía un registro con ese mismo email
- **THEN** la respuesta es 422 con un error de `field` `email`

#### Scenario: Email mal formado o demasiado largo
- **WHEN** se envía un registro con `email` igual a `ada-sin-arroba` o con un email de más de 254 caracteres
- **THEN** la respuesta es 422 con un error de `field` `email`

#### Scenario: Contraseña fuera de longitud
- **WHEN** se envía un registro con una contraseña de 7 caracteres o de 33 caracteres
- **THEN** la respuesta es 422 con un error de `field` `password`

#### Scenario: Confirmación distinta
- **WHEN** se envía un registro con `password` `secreto123` y `passwordConfirmation` `secreto124`
- **THEN** la respuesta es 422 con un error de `field` `passwordConfirmation` y no se crea la cuenta

#### Scenario: Falta la clave del nombre
- **WHEN** se envía un registro sin la clave `fullName` en el cuerpo
- **THEN** la respuesta es 422 con un error de `field` `fullName`

### Requirement: Inicio de sesión
El sistema SHALL responder a `POST /api/v1/auth/login` con credenciales correctas devolviendo el usuario y un token de acceso nuevo.

#### Scenario: Credenciales correctas
- **WHEN** existe la cuenta `ada@example.com` con contraseña `secreto123` y se envía `POST /api/v1/auth/login` con `{ "email": "ada@example.com", "password": "secreto123" }`
- **THEN** la respuesta es 200 con `{ "data": { "user": { ... }, "token": "<token>" } }`

### Requirement: Credenciales incorrectas
El sistema SHALL responder 400 a un inicio de sesión con credenciales incorrectas, y SHALL NOT distinguir en la respuesta si lo que falla es el email o la contraseña.

#### Scenario: Contraseña equivocada
- **WHEN** existe la cuenta `ada@example.com` y se envía un inicio de sesión con esa cuenta y la contraseña `otracosa1`
- **THEN** la respuesta es 400 y no incluye token

#### Scenario: Email sin cuenta
- **WHEN** no existe ninguna cuenta con `nadie@example.com` y se envía un inicio de sesión con ese email
- **THEN** la respuesta es 400 con el mismo cuerpo que con una contraseña equivocada

### Requirement: Datos válidos para iniciar sesión
El sistema SHALL rechazar con 422 un inicio de sesión cuyo email no tenga formato válido o supere 254 caracteres, o en el que falte la contraseña, y SHALL NOT exigir longitud mínima ni máxima a la contraseña al iniciar sesión.

#### Scenario: Email mal formado
- **WHEN** se envía `POST /api/v1/auth/login` con `email` igual a `ada-sin-arroba`
- **THEN** la respuesta es 422 con un error de `field` `email`

#### Scenario: Contraseña corta
- **WHEN** se envía un inicio de sesión con un email válido y la contraseña `abc`
- **THEN** la respuesta no es 422: es 400 si no coincide con la de la cuenta

### Requirement: Datos del usuario en las respuestas
El sistema SHALL representar al usuario en todas las respuestas con exactamente los campos `id`, `fullName`, `email`, `createdAt`, `updatedAt` e `initials`, y SHALL NOT incluir nunca la contraseña.

#### Scenario: Forma del usuario
- **WHEN** se recibe un usuario en la respuesta de registro, de inicio de sesión o de perfil
- **THEN** el objeto tiene esos seis campos y ninguno contiene la contraseña

### Requirement: Iniciales
El sistema SHALL calcular `initials` en mayúsculas: con un nombre de dos o más palabras, la primera letra de las dos primeras; con un nombre de una sola palabra, sus dos primeras letras; sin nombre, la primera letra de lo que va antes de la `@` del email y la primera de lo que va después.

#### Scenario: Nombre de dos palabras
- **WHEN** el usuario se llama `Ada Lovelace`
- **THEN** `initials` es `AL`

#### Scenario: Nombre de una palabra
- **WHEN** el usuario se llama `Ada`
- **THEN** `initials` es `AD`

#### Scenario: Sin nombre
- **WHEN** el usuario no tiene nombre y su email es `ada@example.com`
- **THEN** `initials` es `AE`

### Requirement: Consulta del perfil
El sistema SHALL devolver el usuario dueño del token a quien envíe `GET /api/v1/account/profile` con `Authorization: Bearer <token>` válido, y SHALL responder 401 sin esa cabecera o con un token no válido.

#### Scenario: Token válido
- **WHEN** se envía `GET /api/v1/account/profile` con el token obtenido al iniciar sesión como `ada@example.com`
- **THEN** la respuesta es 200 con `{ "data": { ... } }` y `data.email` es `ada@example.com`

#### Scenario: Sin token o token inventado
- **WHEN** se envía `GET /api/v1/account/profile` sin cabecera `Authorization` o con `Authorization: Bearer inventado`
- **THEN** la respuesta es 401

### Requirement: Cierre de sesión en la API
El sistema SHALL invalidar el token usado en `POST /api/v1/account/logout` y responder 200 con `{ "message": "Logged out successfully" }`, sin envolver en `data`; SHALL responder 401 si la petición llega sin token válido.

#### Scenario: Cierre con token válido
- **WHEN** se envía `POST /api/v1/account/logout` con un token válido
- **THEN** la respuesta es 200 con `{ "message": "Logged out successfully" }` y, a partir de ese momento, `GET /api/v1/account/profile` con ese token responde 401

#### Scenario: Cierre sin token
- **WHEN** se envía `POST /api/v1/account/logout` sin cabecera `Authorization`
- **THEN** la respuesta es 401

### Requirement: Varios tokens a la vez
El sistema SHALL entregar un token distinto en cada registro o inicio de sesión, y SHALL seguir aceptando cada token hasta que se cierre sesión con ese mismo token.

#### Scenario: Dos inicios de sesión
- **WHEN** `ada@example.com` inicia sesión dos veces y obtiene los tokens A y B
- **THEN** A y B son distintos y ambos dan 200 en `GET /api/v1/account/profile`

#### Scenario: Cerrar sesión con uno no afecta al otro
- **WHEN** se cierra sesión con el token A
- **THEN** A recibe 401 en el perfil y B sigue recibiendo 200

### Requirement: Respuestas en JSON
El sistema SHALL responder en JSON a toda petición de la API, incluidos los errores, aunque la petición pida otro formato.

#### Scenario: Petición que pide HTML
- **WHEN** se envía `GET /api/v1/account/profile` sin token y con `Accept: text/html`
- **THEN** la respuesta es 401 con cuerpo JSON

### Requirement: Acceso a las pantallas según haya sesión
El sistema SHALL mostrar `/profile` solo a quien tiene la sesión abierta y `/login` y `/register` solo a quien no la tiene, SHALL llevar cualquier otra dirección a `/profile`, y SHALL mostrar un indicador de carga mientras comprueba una sesión anterior al abrir la aplicación.

#### Scenario: Perfil sin sesión
- **WHEN** una persona sin sesión abierta escribe `/profile` en el navegador
- **THEN** acaba en `/login` viendo la pantalla de inicio de sesión

#### Scenario: Login con sesión
- **WHEN** una persona con la sesión abierta escribe `/login` o `/register`
- **THEN** acaba en `/profile` viendo su perfil

#### Scenario: Dirección desconocida
- **WHEN** una persona escribe `/cualquier-cosa`
- **THEN** acaba en `/profile` si tiene sesión abierta, o en `/login` si no la tiene

#### Scenario: Abrir con sesión anterior
- **WHEN** una persona que inició sesión antes vuelve a abrir la aplicación
- **THEN** ve un indicador de carga hasta que aparece la pantalla que le corresponde

### Requirement: Pantalla de registro
El sistema SHALL ofrecer en `/register` un formulario con título «Crea tu cuenta», campos «Nombre completo (opcional)», «Email», «Contraseña» (con la pista «Entre 8 y 32 caracteres.») y «Repite la contraseña», botón «Crear cuenta» y enlace «Inicia sesión» a `/login`, y SHALL llevar al perfil tras un registro correcto.

#### Scenario: Registro correcto desde la pantalla
- **WHEN** una persona rellena el formulario con un email libre y dos contraseñas iguales de entre 8 y 32 caracteres y pulsa «Crear cuenta»
- **THEN** el botón muestra «Creando cuenta…» y no se puede pulsar mientras tanto, y después la persona ve su perfil en `/profile`

#### Scenario: Contraseñas distintas
- **WHEN** una persona escribe dos contraseñas distintas y pulsa «Crear cuenta»
- **THEN** ve «Las contraseñas no coinciden.» bajo «Repite la contraseña» y la cuenta no se crea

### Requirement: Pantalla de inicio de sesión
El sistema SHALL ofrecer en `/login` un formulario con título «Inicia sesión», campos «Email» y «Contraseña», botón «Entrar» y enlace «Crea una» a `/register`, y SHALL llevar al perfil tras un inicio de sesión correcto.

#### Scenario: Inicio de sesión correcto
- **WHEN** una persona escribe el email y la contraseña de su cuenta y pulsa «Entrar»
- **THEN** el botón muestra «Entrando…» y no se puede pulsar mientras tanto, y después la persona ve su perfil en `/profile`

#### Scenario: Credenciales incorrectas en pantalla
- **WHEN** una persona escribe una contraseña que no es la de su cuenta y pulsa «Entrar»
- **THEN** ve arriba del formulario el aviso «El email o la contraseña no son correctos.» y sigue en `/login`

### Requirement: Mensajes de error en los formularios
El sistema SHALL mostrar en castellano los errores de cada campo justo debajo de ese campo, y SHALL mostrar arriba del formulario un aviso cuando el servidor no responde o falla.

#### Scenario: Email ya registrado en pantalla
- **WHEN** una persona intenta registrarse con un email que ya tiene cuenta
- **THEN** ve «Ese email ya está registrado. Inicia sesión en su lugar.» bajo el campo «Email»

#### Scenario: Contraseña corta en pantalla
- **WHEN** una persona intenta registrarse con dos contraseñas iguales de 7 caracteres
- **THEN** ve «la contraseña debe tener al menos 8 caracteres.» bajo el campo «Contraseña»

#### Scenario: Servidor no disponible
- **WHEN** el servidor no responde y una persona envía cualquiera de los dos formularios
- **THEN** ve arriba «No se pudo conectar con el servidor. Comprueba que el backend está arrancado.»

#### Scenario: Fallo del servidor
- **WHEN** el servidor responde con un error que no es de datos ni de credenciales
- **THEN** la persona ve arriba «Algo ha ido mal en el servidor. Inténtalo de nuevo en un momento.»

### Requirement: La sesión sobrevive a recargar
El sistema SHALL mantener la sesión abierta al recargar o volver a abrir la aplicación mientras el servidor siga aceptándola, y SHALL explicar en la pantalla de inicio de sesión por qué se perdió cuando no es así.

#### Scenario: Recarga con sesión válida
- **WHEN** una persona con la sesión abierta recarga la página en `/profile`
- **THEN** sigue viendo su perfil sin volver a escribir sus credenciales

#### Scenario: Sesión ya no válida
- **WHEN** la sesión de una persona deja de ser aceptada por el servidor (por ejemplo, porque se cerró desde otro sitio con ese mismo token) y la persona recarga la aplicación
- **THEN** ve la pantalla de inicio de sesión con el aviso «Tu sesión ha caducado. Vuelve a iniciar sesión.»

#### Scenario: Servidor caído al recargar
- **WHEN** una persona con la sesión abierta recarga la aplicación mientras el servidor no responde, y después vuelve a recargar con el servidor ya disponible
- **THEN** primero ve la pantalla de inicio de sesión con el aviso «No se pudo conectar con el servidor. Comprueba que el backend está arrancado.», y tras la segunda recarga vuelve a ver su perfil sin escribir credenciales

### Requirement: Pantalla de perfil
El sistema SHALL mostrar en `/profile` un círculo con las iniciales del usuario, su nombre (o «Sin nombre» si no tiene), su email, la línea «Miembro desde» con la fecha de alta en formato largo en castellano, y un botón «Cerrar sesión».

#### Scenario: Perfil con nombre
- **WHEN** `Ada Lovelace` (`ada@example.com`), dada de alta el 5 de octubre de 2026, abre `/profile`
- **THEN** ve `AL` en el círculo, «Ada Lovelace», «ada@example.com» y «Miembro desde 5 de octubre de 2026»

#### Scenario: Perfil sin nombre
- **WHEN** una persona registrada sin nombre abre `/profile`
- **THEN** ve «Sin nombre» en lugar del nombre

### Requirement: Cerrar sesión desde la pantalla
El sistema SHALL cerrar la sesión de la persona cuando pulsa «Cerrar sesión» y llevarla a `/login` sin ningún aviso, aunque el servidor no responda.

#### Scenario: Cierre normal
- **WHEN** una persona con la sesión abierta pulsa «Cerrar sesión»
- **THEN** el botón muestra «Cerrando sesión…», la persona acaba en `/login` sin aviso y, si después escribe `/profile`, vuelve a `/login`

#### Scenario: Cierre con el servidor caído
- **WHEN** una persona pulsa «Cerrar sesión» mientras el servidor no responde
- **THEN** igualmente acaba en `/login` sin aviso

---

## Parte B

### 1. Requisitos escritos y comprobados

- Escritos por el agente: 18
- Comprobados por mí abriendo el código: __

### 2. Incoherencias que aparecieron al escribirla

- 

### 3. Lo que no supe decidir si era un bug o el contrato

- 
