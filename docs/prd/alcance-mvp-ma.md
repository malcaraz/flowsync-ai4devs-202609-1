# Alcance del MVP de FlowSync

> Punto de partida: «Quiero que FlowSync sea una herramienta para que los equipos remotos sepan en qué está trabajando cada uno sin tener que hacer reuniones de sincronización. Algo tipo tareas compartidas pero más en tiempo real y menos rollo que Jira.»

## 1. El terreno que ya existe

- Está construido de punta a punta el ciclo de cuenta: registro, login, ver el propio perfil y cerrar sesión, con sus pantallas en el frontend. Los usuarios tienen nombre (opcional), email y contraseña, y la sesión se mantiene con un token.
- No existe nada del dominio: ni tareas, ni estados, ni equipos, ni roles, ni ningún mecanismo para ver cambios sin refrescar.
- **Consecuencia para este alcance:** la gestión de cuentas se da por hecha y no se vuelve a especificar. El MVP empieza con el usuario ya dentro, y el «responsable» de una tarea es una de esas cuentas que ya existen.

## 2. El interrogatorio

Antes de proponer nada, la IA hizo una sola ronda de cinco preguntas, sin entrar en modelo de datos ni en endpoints:

1. **Problema:** ¿qué dolor concreto desaparece?
2. **Usuarios:** ¿quién saca el valor y con qué estructura de equipo?
3. **«Tiempo real»:** ¿qué significa y qué decisión cambia?
4. **«Menos rollo que Jira»:** ¿qué mínimo necesita una tarea? ¿Se sustituye el gestor actual o se convive con él?
5. **Fronteras y riesgo:** ¿cuántos espacios hay, de dónde sale el estado y qué pasa si se queda viejo?

Las respuestas salen de la ficha de hechos del producto, pegada entera y de una vez, más la lista de funcionalidades descartadas. Lo que la ficha no cubría lo decidió la IA y queda marcado como **supuesto** al final.

## 3. El alcance

### Problema

Hoy nadie ve el estado del equipo sin interrumpir a alguien, ya sea preguntando «¿en qué estás?» por chat o con la ronda de la daily, que se come la mitad de sus 15 minutos. Esto tiene un coste real: dos personas tocaron el mismo módulo la misma semana porque una empezó sin que la otra lo supiera, y se perdieron dos días.

### Usuarios

- Equipos remotos pequeños, de 3 a 10 personas, con roles planos: todos ven y editan lo mismo.
- Quienes sacan el valor son los compañeros entre sí, no un lead: el que iba a empezar algo que ya estaba cogido y el que pregunta cómo va una tarea. No hay reporte hacia arriba.
- Caso de estudio (no es un cliente real): un equipo de producto SaaS de 6 personas, repartido en 3 husos horarios, que hoy usa un gestor de tareas pesado y hace una daily de 15 minutos por videollamada.

### Propuesta de valor

Una única lista de tareas compartida que es a la vez la cola de trabajo de cada persona y el estado del equipo. Actualizarla cuesta dos clics sobre una lista que ya tienes abierta, y quien la actualiza se beneficia en el momento: con ella decide qué coge y deja de recibir preguntas. Los cambios aparecen sin refrescar, y al volver de una reunión o al empezar el día se ve qué se ha movido, sin avisos que interrumpan.

La decisión que cambia es doble: no empezar algo que otra persona ya está tocando, y elegir lo siguiente sabiendo qué está libre. La daily **no** desaparece: desaparece su ronda de «¿en qué estás?», y la parte de bloqueos sigue igual.

- **Éxito:** tras una semana de uso real, el equipo cancela la ronda de «¿en qué estás?» y nadie pide que vuelva. Si la siguen haciendo igual, no funcionó.
- **Riesgo #1 que hay que validar:** que la información se quede vieja. La mitigación es que actualizar sea casi gratis, nunca obligar a nadie.

### Alcance: una sola vertical, terminada

1. **Lista compartida del espacio.** Todos los usuarios ven todas las tareas en una única lista, que muestra de cada una el título, el responsable (o «libre»), el estado, la fecha de vencimiento y cuánto hace que cambió por última vez.
2. **Crear una tarea en segundos**, escribiendo solo el título, desde la propia lista. Nace «pendiente» y «libre». El responsable y la fecha son opcionales y se pueden añadir en ese momento o más tarde.
3. **Cambiar el estado en dos clics** desde la lista, sin abrir la tarea. Hay tres estados fijos: *Pendiente*, *En curso* y *Hecha*.
4. **Coger una tarea libre o reasignarla** a cualquier persona del espacio. «Libre» es un estado visible de primera clase, porque es lo que responde a «¿qué puedo coger?».
5. **Editar el título y la fecha de vencimiento.** Cualquiera puede editar cualquier tarea.
6. **Ver los cambios de los demás sin refrescar:** si otra persona crea, coge o cambia de estado una tarea, tu lista abierta se actualiza sola.
7. **Filtrar por estado**, para centrarse en lo pendiente.
8. **Ver las vencidas de un vistazo:** una tarea no hecha cuya fecha ya pasó se distingue visualmente.
9. **Ver qué se ha movido desde tu última visita:** al entrar, se resaltan las tareas que cambiaron mientras no estabas. Es un resumen que espera, no un aviso.

### NO-alcance, y por qué

Cada exclusión se justifica por la hipótesis que **no** ayuda a validar. Las hipótesis del MVP son dos: (H1) si ver el estado sin preguntar evita el trabajo duplicado y la ronda de la daily, y (H2) si el estado se mantiene fresco cuando actualizarlo cuesta dos clics.

- **Notificaciones push, emails y recordatorios de «actualiza tu estado».** La forma de la señal es un resumen que espera, y un aviso interrumpe, que es justo el dolor que queremos quitar. Además, obligar a actualizar enmascararía H2: queremos saber si el estado se mantiene fresco sin forzarlo.
- **Integración con Slack.** Llevar el estado al chat no reduce la dependencia del chat, que es parte del problema. No valida H1 ni H2.
- **Derivar el estado de Git/PRs, CI o calendario.** Es otro producto, con integraciones y OAuth de terceros. Además invalidaría H2, que pregunta justamente si la gente lo teclea.
- **Importar o sincronizar con otro gestor de tareas.** FlowSync lo sustituye, no convive con él. Convivir exige actualizar dos veces, y así es como muere esta categoría de producto.
- **Presencia («quién está conectado») e indicadores de actividad.** El estado es de la tarea, no de la persona. Esto es vigilancia y se rechaza a propósito.
- **Comentarios, chat o menciones en tareas.** Convierten la herramienta en otro canal de conversación, y «tiempo real» aquí no es chat. No aportan nada a H1.
- **Estado «bloqueada» o gestión de bloqueos.** La parte de bloqueos de la daily sigue existiendo y este MVP no la resuelve. Meterla a medias daría una promesa falsa y ensuciaría la métrica de éxito, que solo mide la ronda de «¿en qué estás?».
- **Roles y permisos.** Los roles son planos en equipos de 3 a 10 personas. Los permisos solo protegen de problemas que este usuario no tiene.
- **Varios equipos o espacios, e invitaciones.** Hay un único espacio compartido. Tener más no cambia la decisión que queremos provocar dentro de un equipo, y se anota como supuesto.
- **Analítica, informes y métricas del equipo.** El valor es para los compañeros y a un manager le daría igual. Un informe no evita ni un solapamiento.
- **Sprints, estimaciones, épicas, prioridades y backlog priorizado.** Es la renuncia explícita del producto: quien los necesita no es nuestro usuario, y cada campo más es rozamiento que ataca H2.
- **Estados o flujos configurables.** «Menos rollo que Jira» significa cero configuración. Con tres estados fijos basta para saber quién está en qué.
- **Descripción, etiquetas, adjuntos, subtareas y varios responsables.** Lo mínimo para saber quién está en qué son título, responsable, estado y fecha. Cada campo extra invita a dejar la tarea «para rellenarla luego».
- **Historial completo de cambios por tarea.** El punto 9 del alcance ya cubre «qué se ha movido». La auditoría de quién cambió qué y cuándo es trazabilidad, y no se necesita para decidir qué coger.
- **Borrar o archivar tareas.** No valida ninguna hipótesis. Las tareas terminadas se esconden filtrando por estado, y una tarea creada por error se corrige editándola.
- **Búsqueda, ordenación configurable y filtros por responsable o por fecha.** Con 3 a 10 personas la lista cabe en una pantalla. El único filtro que pide el uso real es por estado.
- **Edición del perfil y recuperación de contraseña.** La gestión de cuentas ya existe y no forma parte de la vertical que se valida.
- **Edición simultánea del mismo contenido, app móvil y modo sin conexión.** «Tiempo real» significa ver cambios de estado, no colaborar a la vez sobre un documento. Móvil y offline amplían canales antes de saber si el canal principal funciona.

### Supuestos (decididos por la IA, la ficha no los cubre)

- **Una instalación equivale a un espacio.** Cualquier cuenta registrada pertenece al único espacio y puede ser responsable de tareas. El control de quién se registra queda fuera.
- **Si dos personas cambian la misma tarea a la vez, gana el último cambio**, y los demás lo ven sin refrescar. No hay bloqueo ni fusión de cambios.
- **La fecha de vencimiento es un día, sin hora.** Así se evita la ambigüedad entre los 3 husos horarios del caso de estudio. Una tarea se considera vencida a partir del día siguiente a su fecha.
- **«Última visita»** es la última vez que esa persona tuvo la lista abierta. No se muestra a nadie más, porque no es presencia.
- **Las tareas hechas se quedan en la lista** y se ocultan con el filtro.

## Parte B: las tres líneas

1. **Los dos números:** la IA propuso 9 cosas dentro del alcance; tras mi recorte quedaron 8, aunque honestamente no veo ningún motivo para descartar ninguna regla ya que no encuentro argumentos sólidos que no validen H1 y H2.

2. **Tres cosas que dejé fuera, y por qué** (qué hipótesis no ayudan a validar): 

    "Editar el título y la fecha de vencimiento. Cualquiera puede editar cualquier tarea."
     
    La tarea pertenece al desarrollador que la está implementando, si cualquiera puede editar cualquier cosa, creo que añadiría más ruido en la daily, introduciría preguntas como ¿Porqué has cambiado el título y fecha de la tarea?. No valida H1. 

3. **La exclusión de la que menos seguro estoy**, y qué tendría que pasar para que entrara:

    Tampoco eliminaría esta regla, simplemente dejaría editar al usuario asignado o si la tarea está libre.

    Opinión de la IA

    > Tienes razón en parte, pero la solución que propones choca con la ficha de hechos, y creo que hay una salida mejor.
    >
    > En qué tienes razón
    >
    > - Editar el título y la fecha no ayuda a validar H1: saber quién está en qué y qué está libre depende del responsable y del estado, no del título ni de la fecha.
    > - Que el título o la fecha cambien sin que el responsable se entere genera ruido y desconfianza en la lista. Eso ataca H2, porque si la lista no es fiable la gente vuelve a preguntar.
    >
    > Dónde choca con la ficha
    > - La ficha es explícita: «Roles planos: en el MVP todos ven y editan lo mismo, sin jerarquía de permisos». «Solo el responsable edita su tarea» es una regla de permisos, y los permisos están en el NO-alcance.
    > - Además arrastra casos que habría que especificar:
    > - Una tarea libre no tiene dueño, así que alguien tendría que poder editarla. ¿Quién?
    > - ¿Quién puede reasignar una tarea que ya tiene responsable?
    > - ¿Qué pasa con las tareas de alguien que se va de vacaciones?
    >
    > Es el tipo de crecimiento que el ejercicio pide evitar.
    > - Esta es una incoherencia de las que la lección pide anotar: tu propuesta prohíbe algo que la ficha permite de forma explícita.
    >
    > Mi recomendación
    > Tu propio argumento («no valida H1») apunta a recortar el punto 5 del alcance, no a restringirlo con permisos:
    >
    > - Recortarlo es más barato que protegerlo: no hay regla de propiedad que especificar ni casos raros.
    >- Lo que valida H1 (coger una tarea, reasignarla y cambiarle el estado) sigue dentro, con roles planos.
    > - El precio: una errata en el título o una fecha mal puesta no se pueden corregir. La salida sería marcar la tarea como hecha y crear otra, lo cual es tosco. Si en la prueba eso resulta molesto, es la señal para meterlo después.
    > - Para la parte B te deja un recorte con argumento: el alcance pasaría de 9 a 8 cosas, con una exclusión justificada por la hipótesis que no ayuda a validar."

    Con esta opinión, no descartaría esta regla.


