# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Qué es

FlowSync: proyecto de práctica de un curso (gestión de tareas en equipo). Monorepo sin workspaces con dos proyectos independientes, cada uno con su propio `package.json` y `node_modules`:

- `backend/` — API REST en AdonisJS 7 (TypeScript, ESM), SQLite vía Lucid. Puerto 3333.
- `frontend/` — React 19 + Vite 8 + TypeScript. Puerto 5173. Ahora mismo es la plantilla de Vite sin tocar: no hay router, cliente HTTP ni gestión de estado.

Los comandos se ejecutan siempre desde dentro de `backend/` o `frontend/`, no desde la raíz. Backend y frontend corren en terminales separadas.

## Comandos

### Backend (`cd backend`)

```bash
npm install
cp .env.example .env && node ace generate:key   # primera vez
node ace migration:run                          # crea tmp/db.sqlite3 y regenera database/schema.ts
npm run dev          # node ace serve --hmr
npm test             # node ace test (Japa)
npm run lint         # eslint
npm run typecheck    # tsc --noEmit
npm run format       # prettier (@adonisjs/prettier-config)
```

Tests (Japa), suites definidas en `adonisrc.ts`:
- `unit` → `tests/unit/**/*.spec.ts` (timeout 2s)
- `functional` → `tests/functional/**/*.spec.ts` (timeout 30s; arranca el servidor HTTP)

Aún no existen esos directorios. Para ejecutar un subconjunto:

```bash
node ace test unit                       # una suite
node ace test --files=tests/unit/foo.spec.ts
node ace test --tests="nombre del test"
```

`.env.test` usa `SESSION_DRIVER=memory`.

Generadores habituales: `node ace make:controller`, `make:model`, `make:migration`, `make:validator`, `make:transformer`, `make:test`.

### Frontend (`cd frontend`)

```bash
npm install
npm run dev       # vite
npm run build     # tsc -b && vite build
npm run lint      # oxlint (.oxlintrc.json)
npm run test:e2e  # Playwright (e2e/), primera vez: npx playwright install chromium
```

Tests e2e con Playwright en `frontend/e2e/`: la API se mockea con `page.route` (no necesitan backend) y levantan su propio Vite en el puerto 5174.

## Arquitectura del backend

Flujo de una petición: `start/kernel.ts` (middleware) → `start/routes.ts` → controlador → validador VineJS → modelo Lucid → transformer → `ctx.serialize()`.

Piezas que no son obvias leyendo un solo archivo:

- **Imports con alias `#`** (definidos en `package.json` → `imports`): `#controllers/*`, `#models/*`, `#validators/*`, `#transformers/*`, `#database/*`, `#generated/*`, etc. Se escriben sin extensión `.ts`. Usar siempre estos alias en lugar de rutas relativas.
- **Código generado en `.adonisjs/`** (hooks `indexEntities` y `generateRegistry` de `adonisrc.ts`, se regenera al arrancar `node ace serve`/`build`). No editar a mano:
  - `.adonisjs/server/controllers.ts` → objeto `controllers` que las rutas usan como `[controllers.Profile, 'show']` (import `#generated/controllers`). Un controlador nuevo en `app/controllers/` aparece ahí automáticamente.
  - `.adonisjs/client/registry/*` → registro tipado de rutas para Tuyau (`@tuyau/core`), exportado por el backend como `backend/registry` y `backend/data`. Pensado para que un cliente tipado lo consuma; también tipa las rutas en `@japa/api-client` (`tests/bootstrap.ts`).
- **Modelos generados desde migraciones**: `database/schema.ts` lo genera `node ace migration:run` (NO editar). Los modelos extienden esas clases base, p. ej. `class User extends compose(UserSchema, withAuthFinder(hash))`. Para añadir columnas: crear migración → `migration:run` → el schema se actualiza. Reglas de tipos personalizadas en `database/schema_rules.ts`.
- **Respuestas envueltas en `data`**: `providers/api_provider.ts` añade `ctx.serialize()` al `HttpContext`, que envuelve todo en `{ data: ... }` y valida metadatos de paginación de Lucid. Los controladores devuelven `serialize(Transformer.transform(model))` en vez del modelo en bruto. `serialize.withoutWrapping()` existe para casos sin envoltorio.
- **Transformers** (`app/transformers/`, extienden `BaseTransformer`) controlan qué campos se exponen (`this.pick(...)`); incluyen getters computados como `User.initials`.
- **Validadores**: `vine.create({...})` en `app/validators/`, usados con `request.validateUsing(...)`.
- **Autenticación**: guard por defecto `api` = access tokens opacos en BD (`User.accessTokens`, tabla de `auth_access_tokens`). Existe también un guard `web` de sesión, no usado por las rutas. El token se envía como `Authorization: Bearer <token>`. Rutas protegidas con `.use(middleware.auth())`.
- **Middleware global**: `force_json_response_middleware` fuerza `Accept: application/json` (los errores siempre salen en JSON); `silent_auth_middleware` hace `auth.check()` en todas las rutas.
- **CORS**: en desarrollo acepta cualquier origen con credenciales; en producción la lista está vacía.

### Endpoints actuales (prefijo `/api/v1`)

| Método | Ruta | Auth | Controlador |
|---|---|---|---|
| POST | `/auth/signup` | no | `NewAccountController.store` (fullName, email, password, passwordConfirmation) |
| POST | `/auth/login` | no | `AccessTokensController.store` (email, password) |
| GET | `/account/profile` | sí | `ProfileController.show` |
| POST | `/account/logout` | sí | `AccessTokensController.destroy` |

Signup y login responden `{ data: { user, token } }`.

## Contexto del curso

`README.md` contiene el enunciado del ejercicio (comparar el mismo encargo con y sin harness de Claude Code). La entrega es un PR con solo `docs/harness/comparacion.md` y `prompts.md` (raíz). `prompts.md` debe registrar cada prompt tal cual se lanzó, con modelo y herramienta.

## Reglas de proceso

- Antes de tocar código: crear una rama nueva (`git checkout -b feat/<slug>`). Nunca
commitear directo en `main`/`s1/start`.
- Al cerrar la tarea: usar la skill `/commit`, luego `gh pr create` con una descripción
completa de los cambios en el cuerpo del PR.
- Después de abrir el PR: usar el subagente `adversarial-reviewer` sobre él, antes de
darlo por terminado.
- No repitas ese resumen en el chat: la sesión se va a perder, el PR no. Responde solo
con la URL del PR.
