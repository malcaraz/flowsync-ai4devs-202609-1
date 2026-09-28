# Alcance del MVP de FlowSync — MAJ

> Punto de partida: «Quiero que FlowSync sea una herramienta para que los equipos remotos sepan en qué está trabajando cada uno sin tener que hacer reuniones de sincronización. Algo tipo tareas compartidas pero más en tiempo real y menos rollo que Jira.»

## 1. El terreno que ya existe

- **Capabilities construidas:** solo identidad y sesión. Registro (email único, contraseña, nombre opcional), login con token, ver el perfil propio y logout. En el frontend: pantallas de login, registro y perfil con rutas protegidas.
- **Modelo de datos actual:** usuarios y sus tokens de sesión. No existe nada de tareas, equipos ni espacios.
- **Lo que no hay:** ninguna base para cambios en vivo (hay que construirla desde cero) y ningún test.
- **Consecuencia:** las cuentas y el login no se vuelven a especificar. El responsable de una tarea es uno de esos usuarios.

## 2. El interrogatorio, con las respuestas ya decididas

Una sola ronda de cinco preguntas, sin bajar a datos ni a endpoints. Las respuestas salen de la ficha de hechos del producto.

1. **¿Qué duele y a quién?** El "¿en qué estás?" constante y la ronda de la daily dedicada a esa pregunta. El valor se lo llevan los compañeros entre sí, no un lead. Episodio real: dos personas tocaron el mismo módulo la misma semana y se perdieron dos días.
2. **¿Qué decisión cambia y qué reunión desaparece?** No empezar algo que ya tiene otro y elegir lo siguiente sabiendo qué está libre. Desaparece la ronda de "¿en qué estás?", que es la mitad de la daily. Los bloqueos siguen, y este MVP no los resuelve.
3. **¿Qué es "tiempo real"?** Ver los cambios de estado de las tareas sin refrescar ni preguntar. Es frescura de la tarea, no presencia de la persona. Es un resumen que espera, no un aviso que interrumpe. No es chat, ni videollamada, ni edición a la vez.
4. **¿De dónde sale el estado y por qué se mantiene?** Lo teclea quien hace la tarea, en dos clics sobre la lista, que además es su propia cola de trabajo. FlowSync sustituye al gestor de tareas actual, no convive con él. Que la información se quede vieja es el riesgo #1.
5. **¿Qué equipo, qué tarea mínima y cuándo ha funcionado?** Equipos de 3 a 10 personas con roles planos, en un único espacio compartido. Una tarea lleva título, responsable, estado y fecha de vencimiento, y la lista se filtra por estado. Ha funcionado si, tras una semana de uso real, el equipo cancela la ronda de "¿en qué estás?" y nadie pide que vuelva.

**Supuestos** (lo que la ficha no cubre, decidido por la IA):

- **S1.** Quien se registra entra en el espacio único y puede ser responsable de una tarea. Vale para un caso de estudio, pero con el registro abierto un desconocido vería las tareas del equipo.
- **S2.** Hay tres estados fijos: pendiente, en curso y hecha. "Libre" no es un estado: es una tarea sin responsable.
- **S3.** Las tareas hechas se quedan en la lista y se esconden con el filtro de estado.
- **S4.** El choque de trabajo solo se evita si la persona crea o coge la tarea **antes** de empezar. Eso depende de un hábito, no lo garantiza el producto.
- **S5.** Solo el título es obligatorio, para respetar "sin campos obligatorios". Un responsable vacío es la señal de "libre".

## 3. El alcance

### Problema

En un equipo remoto nadie ve en qué está cada uno sin interrumpir a alguien. El resultado es trabajo duplicado, interrupciones por chat y media daily dedicada a preguntar "¿en qué estás?".

### Usuarios

Equipos remotos pequeños, de 3 a 10 personas, con roles planos. El valor es para los compañeros, no para un manager. Caso de estudio: un equipo de 6 personas de un producto SaaS, repartido en 3 husos horarios, que hoy usa un gestor de tareas pesado y una daily por videollamada.

### Propuesta de valor

Una única lista de tareas compartida donde se trabaja de verdad. Actualizar un estado cuesta dos clics y los cambios de los demás aparecen solos. Al volver ves en qué está cada uno y qué está libre sin preguntar a nadie, y así cae la ronda de "¿en qué estás?" de la daily.

**Hipótesis que el MVP valida:**
- **H1.** La gente mantiene el estado al día si le cuesta dos clics.
- **H2.** Ver quién está en qué evita trabajo duplicado y deja elegir lo que está libre.
- **H3.** Con eso, el equipo cancela la ronda de "¿en qué estás?".

### Alcance

1. Crear una tarea con solo el título. El responsable y la fecha de vencimiento son opcionales. *(H1)*
2. Poner, cambiar o quitar el responsable. Sin responsable, la tarea está libre. *(H2)*
3. Cambiar el estado desde la lista en dos clics como mucho, entre tres estados fijos. *(H1)*
4. Una lista única compartida con título, responsable, estado y vencimiento, y una marca en lo que se ha pasado de plazo. *(H2, H3)*
5. Filtro por estado. *(H3)*
6. Los cambios de los demás aparecen sin refrescar. *(H2)*

### NO-alcance

- **"Hace cuánto cambió" en cada tarea.** H2 se decide con el estado actual, no con su antigüedad. Por eso la promesa es "ves en qué está cada uno", no "qué se ha movido".
- **Notificaciones push, email, resúmenes, recordatorios e integración con Slack.** Si alguien actualiza porque le llega un aviso, H1 deja de medirse. Y Slack devuelve la conversación al canal de interrupciones que H3 quiere eliminar.
- **Presencia e indicadores de actividad.** No aportan a H2: lo que evita pisarse es el estado de la tarea, no saber si alguien está conectado. Además sería vigilancia, y se rechaza a propósito.
- **Roles, permisos, varios equipos o espacios, invitaciones.** H3 se valida con un solo equipo de roles planos en un solo espacio. Ninguna hipótesis depende de quién puede hacer qué.
- **Estado derivado de Git, CI o calendario, e importar desde otro gestor.** H1 comprueba si la gente teclea su estado. Derivarlo esquiva la prueba, y convivir con otra herramienta mediría la doble actualización.
- **Sprints, estimaciones, épicas, prioridades, etiquetas y estados configurables.** Cada campo o ajuste de más encarece la actualización y juega contra H1.
- **Analítica e informes.** H1–H3 se miden en el propio equipo (¿cae la ronda?), no con informes hacia arriba que nadie lee.
- **Editar título y fecha, comentarios, descripción, adjuntos, subtareas, dependencias y varios responsables.** Para H2 bastan título, responsable y estado. Nada de eso cambia la respuesta a "¿quién está en qué?", y varios responsables la emborronan.
- **Estado "bloqueada" y gestión de bloqueos.** H3 va de la ronda de "¿en qué estás?". Los bloqueos son otra parte de la daily, y medirlos ensuciaría el criterio de éxito.
- **Historial de cambios, borrar o archivar.** Ni H1 ni H2 dependen de saber cómo se llegó al estado ni de limpiar la lista. Lo hecho se esconde con el filtro.
- **Filtrar por responsable.** Con 3 a 10 personas la lista entera ya responde a H2, y la ficha fija el filtro por estado.
- **App móvil y modo offline.** H1–H3 se validan igual en el navegador.

---

## Parte B: las tres líneas

1. **Los dos números:**

    > 9 propuestas introducidas por la IA y 6 propuestas restantes después de mi recorte.


2. **Tres cosas que dejé fuera y por qué** (qué hipótesis no ayudan a validar):

    Ninguna, inicialmente puse estas tres:

    >
    >1- "Crear una tarea con solo el título. El responsable y la fecha de vencimiento son opcionales."
    >
    > FlowSync trata de eliminar el "¿En que estás?" en la daily. Tener una tarea creada sólo con el título no elimina esta pregunta, "¿En qué estás?" Implica que un desarrollador está trabajando en una tarea. H3
    >
    >2- "Poner, cambiar o quitar el responsable. Sin responsable, la tarea está libre. (H2)"
    >
    > Mismo planteamiento, si se puede quitar el responsable, la tarea quedaría libre y no sería necesario mostrarla en FlowSync. Sólo queremos tareas asignadas a desarrolladores para cumplir con H3 y responder a la pregunta "¿En qué estás?. Si que permitiría cambiar de usuario.
    >
    > Tener una tarea sin asignar a nadie en FlowSync podría dar lugar a la pregunta "¿Y quién está en esta tarea?" en la daily.
    >
    >3- "Filtro por estado. (H3)"
    >
    > Si se filtra sólo por estado, el listado de tareas podría estar desordenado, interesa saber en que tarea está trabajando cada usuario. H3

    Al final la IA me informó que mis exclusiones chocan con la ficha de hechos y con el propio documento, finalmente no he podido defender mis exclusiones:

    >Filtro por estado: la ficha dice textualmente "filtrando por estado", y el propio NO-alcance del documento lo da como algo fijado por la ficha.
    >
    >Tareas sin responsable: rompen la idea de "qué está libre", que aparece en la ficha, en la hipótesis H2, en la propuesta de valor y en el supuesto S2.
    >
    >Crear con solo el título: contradice "sin campos obligatorios" y el supuesto S5.


3. **La exclusión de la que menos seguro estoy**, y qué tendría que pasar para que entrara:

    Mi primera respuesta fue:
    > Filtro por estado. (H3)
    >
    > Mejor filtrar por Usuario y estado, para ver de forma más clara "¿Quién está con qué?".

    La ficha dice explicitamente que hay que filtrar por estado, pero tras no poder defender mis exclusiones, este apartado queda sin responder.
