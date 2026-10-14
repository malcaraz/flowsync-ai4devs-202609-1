## MODIFIED Requirements

### Requirement: Pantalla de registro
La aplicación web SHALL ofrecer en `/register` un formulario "Crea tu cuenta" con los campos "Nombre completo (opcional)", "Email", "Contraseña" (con la ayuda "Entre 8 y 32 caracteres.") y "Repite la contraseña", un botón "Crear cuenta" y un enlace "Inicia sesión" hacia `/login`.

#### Scenario: Registro correcto desde la pantalla
- **WHEN** la persona rellena el formulario con datos válidos y pulsa "Crear cuenta"
- **THEN** el botón pasa a "Creando cuenta…" y queda deshabilitado mientras espera, y al terminar la persona llega a la lista de tareas con la sesión iniciada

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
- **THEN** el botón pasa a "Entrando…" y queda deshabilitado mientras espera, y al terminar la persona llega a la lista de tareas

#### Scenario: Credenciales incorrectas en pantalla
- **WHEN** la persona introduce un email o una contraseña que no son correctos
- **THEN** aparece un aviso destacado sobre el formulario con "El email o la contraseña no son correctos."

### Requirement: Protección de pantallas
La aplicación web SHALL mostrar la lista de tareas y el perfil solo con sesión iniciada, SHALL mostrar las pantallas de registro e inicio de sesión solo sin sesión, y SHALL llevar cualquier otra dirección a la lista de tareas.

#### Scenario: Perfil sin sesión
- **WHEN** una persona sin sesión abre `/profile`
- **THEN** es llevada a `/login`

#### Scenario: Lista de tareas sin sesión
- **WHEN** una persona sin sesión abre `/tasks`
- **THEN** es llevada a `/login`

#### Scenario: Acceso con sesión ya iniciada
- **WHEN** una persona con sesión abre `/login` o `/register`
- **THEN** es llevada a `/tasks`

#### Scenario: Dirección desconocida
- **WHEN** una persona abre cualquier dirección que no sea `/login`, `/register`, `/tasks` ni `/profile`
- **THEN** es llevada a `/tasks`, y de ahí a `/login` si no tiene sesión

### Requirement: Pantalla de perfil
La aplicación web SHALL mostrar en el perfil un círculo con las iniciales de la cuenta, el nombre completo (o "Sin nombre" si no lo tiene), el email, la fecha de alta como "Miembro desde" en formato de fecha larga en castellano, y un enlace "Volver a las tareas" que lleva a `/tasks`.

#### Scenario: Cuenta sin nombre
- **WHEN** una persona registrada sin nombre abre su perfil
- **THEN** ve "Sin nombre" como título, su email debajo y las iniciales calculadas a partir del email

#### Scenario: Fecha de alta
- **WHEN** la cuenta se creó el 13 de octubre de 2026
- **THEN** el perfil muestra "Miembro desde" con "13 de octubre de 2026", según la zona horaria del navegador

#### Scenario: Volver a la lista
- **WHEN** la persona pulsa "Volver a las tareas" en su perfil
- **THEN** llega a la lista de tareas sin perder la sesión
