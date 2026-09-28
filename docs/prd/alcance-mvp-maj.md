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

1. Crear una tarea con solo el título. El responsable y la fecha de vencimiento son opcionales.
2. Poner, cambiar o quitar el responsable. Sin responsable, la tarea está libre. *(H2)*
3. Cambiar el estado desde la lista en dos clics como mucho, entre tres estados fijos. *(H1)*
4. Una lista única compartida con título, responsable, estado y vencimiento, y una marca en lo que se ha pasado de plazo. *(H2, H3)*
5. Filtro por estado. *(H3)*
6. Los cambios de los demás aparecen sin refrescar. *(H2)*

### NO-alcance

- **"Hace cuánto cambió" en cada tarea.** La decisión que cambia necesita el estado actual, no su antigüedad. Por eso la promesa es "ves en qué está cada uno", no "qué se ha movido".
- **Editar el título y la fecha.** No ayuda a validar H1, H2 ni H3. Una tarea mal escrita se da por hecha y se crea otra.
- **Notificaciones push, email, resúmenes y recordatorios de vencimiento.** Interrumpen, y la señal que se busca es la que espera. Además, si alguien actualiza porque le llega un aviso, H1 deja de poder medirse.
- **Integración con Slack.** Devuelve la conversación al canal de interrupciones que H3 quiere eliminar.
- **Presencia e indicadores de actividad.** El estado es de la tarea, no de la persona. Sería vigilancia, y se rechaza a propósito.
- **Roles y permisos.** Los roles son planos. Ninguna hipótesis depende de quién puede hacer qué.
- **Varios equipos o espacios, entidad "equipo", invitaciones.** H3 se valida con un solo equipo en un solo espacio.
- **Estado derivado de Git, CI o calendario, e importar tareas de otro gestor.** Es otro producto. Convivir con otra herramienta mediría la doble actualización, no H1.
- **Sprints, estimaciones, épicas, prioridades, etiquetas y estados configurables.** Son el "rollo" que se quiere quitar. Cada campo o ajuste de más encarece la actualización y juega contra H1.
- **Analítica e informes.** Nadie los lee: el valor es para los compañeros, no hacia arriba.
- **Comentarios, descripción, adjuntos, subtareas y dependencias.** Para saber quién está en qué bastan título, responsable y estado (H2).
- **Estado "bloqueada" y gestión de bloqueos.** Los bloqueos siguen en la daily, y este MVP no los resuelve.
- **Historial de cambios.** Responde a "¿quién cambió qué?", que no es la decisión que se quiere cambiar.
- **Borrar o archivar tareas.** No valida nada. Lo que no sirve se da por hecho y se esconde con el filtro.
- **Varios responsables por tarea.** Rompe la respuesta simple a "¿quién está en esto?" (H2).
- **Filtrar por responsable.** La ficha fija el filtro por estado. Con 3 a 10 personas, la lista se lee entera.
- **App móvil y modo offline.** H3 se valida igual en el navegador de escritorio, que es donde se trabaja.

---

## Parte B: las tres líneas

1. **Los dos números:** 9 propuestas por la IA · 6 dentro después del recorte.

2. **Tres cosas que dejé fuera y por qué** (qué hipótesis no ayudan a validar):
   - **Filtrar por responsable ("mis tareas").** Era mi primera intuición, pero no valida nada: con 3 a 10 personas la lista entera ya responde "¿quién está en qué?" (H2). Filtrar por persona es comodidad de lectura, no una prueba de que la gente mantenga el estado (H1) ni de que caiga la ronda (H3).
   - **Estado "bloqueada".** Suena razonable, pero H3 va de la ronda de "¿en qué estás?", no de los bloqueos, que siguen en la daily. Meterlo mediría otra parte de la reunión y ensuciaría el criterio de éxito.
   - **Editar el título y la fecha.** Ni H1, ni H2, ni H3 dependen de corregir una tarea mal escrita. Lo que se valida es cambiar estado y responsable, no el contenido.

3. **La exclusión de la que menos seguro estoy:** "hace cuánto cambió" en cada tarea. Se contradicen el recorte (la ficha no la pide y la decisión solo necesita el estado actual) y el riesgo #1 (sin ese dato, una tarea "en curso" abandonada es indistinguible de una viva, y el estado viejo no se detecta). Entraría si en la semana de prueba aparecen tareas "en curso" que llevan días sin tocarse y el equipo vuelve a preguntar "¿sigues con esto?".

> 📌 **La IA me corrigió y tenía razón.** En mi primera versión de esta parte B excluía crear una tarea con solo el título, las tareas sin responsable y el filtro por estado, y decía que quedaban 3. La revisión adversarial del PR señaló que las tres contradecían la ficha ("sin campos obligatorios", "saber qué está libre", "filtrando por estado") y el propio documento (H2, S2, S5), y que el alcance seguía listando 6. Lo corregí aquí.
