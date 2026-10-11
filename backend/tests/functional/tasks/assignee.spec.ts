import Task from '#models/task'
import User from '#models/user'
import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'

/**
 * El responsable que acompaña a cada tarea. Cubre los tres scenarios del
 * requisito «Lo que cada tarea muestra de su responsable» de
 * `openspec/specs/tasks/spec.md`: nombre e iniciales, ningún dato de cuenta, y
 * el responsable que se registró sin nombre.
 */
test.group('Tasks | responsable', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  const hoy = '2026-10-11'

  async function sesion(client: any) {
    await User.create({
      fullName: 'Grace Hopper',
      email: 'grace@example.com',
      password: 'secreto123',
    })

    const response = await client
      .post('/api/v1/auth/login')
      .json({ email: 'grace@example.com', password: 'secreto123' })

    return response.body().data.token as string
  }

  async function tareaDe(fullName: string | null, email: string) {
    const responsable = await User.create({ fullName, email, password: 'secreto123' })
    return Task.create({
      title: 'Revisar el informe',
      status: 'pending',
      assigneeId: responsable.id,
    })
  }

  test('el responsable llega con su nombre y sus iniciales', async ({ client, assert }) => {
    const token = await sesion(client)
    const tarea = await tareaDe('Ada Lovelace', 'ada@example.com')

    const response = await client
      .get(`/api/v1/tasks/${tarea.id}`)
      .qs({ today: hoy })
      .header('Authorization', `Bearer ${token}`)

    response.assertStatus(200)

    const responsable = response.body().data.assignee
    assert.equal(responsable.fullName, 'Ada Lovelace')
    assert.equal(responsable.initials, 'AL')
  })

  test('el responsable no trae el email ni datos de acceso, ni suelto ni en la lista', async ({
    client,
    assert,
  }) => {
    const token = await sesion(client)
    const tarea = await tareaDe('Ada Lovelace', 'ada@example.com')

    const suelta = await client
      .get(`/api/v1/tasks/${tarea.id}`)
      .qs({ today: hoy })
      .header('Authorization', `Bearer ${token}`)
    const lista = await client.get('/api/v1/tasks').header('Authorization', `Bearer ${token}`)

    suelta.assertStatus(200)
    lista.assertStatus(200)

    const tareas = lista.body().data as Array<{ id: number; assignee: Record<string, unknown> }>
    const enLista = tareas.find((t) => t.id === tarea.id)!
    assert.exists(enLista)

    for (const responsable of [suelta.body().data.assignee, enLista.assignee]) {
      // Que no traiga el email no vale si no trae nada: el responsable sigue
      // siendo identificable.
      assert.equal(responsable.fullName, 'Ada Lovelace')
      assert.equal(responsable.initials, 'AL')

      assert.notProperty(responsable, 'email')
      assert.notProperty(responsable, 'password')
      // Ni bajo otro nombre: el email no aparece en ningún valor del responsable.
      assert.notInclude(JSON.stringify(responsable).toLowerCase(), 'ada@example.com')
    }
  })

  test('un responsable sin nombre llega con el nombre nulo y sus iniciales', async ({
    client,
    assert,
  }) => {
    const token = await sesion(client)
    const tarea = await tareaDe(null, 'ada@example.com')

    const response = await client
      .get(`/api/v1/tasks/${tarea.id}`)
      .qs({ today: hoy })
      .header('Authorization', `Bearer ${token}`)

    response.assertStatus(200)

    const responsable = response.body().data.assignee
    assert.isNull(responsable.fullName)
    // Sin nombre, las iniciales salen del email (regla de auth), pero el email
    // en sí no llega: la interfaz lo representa sin recurrir a él.
    assert.equal(responsable.initials, 'AE')
    assert.notProperty(responsable, 'email')
  })
})
