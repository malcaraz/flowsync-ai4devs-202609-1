import { expect, test, type Page, type Route } from "@playwright/test";

const TOKEN_KEY = "flowsync.token";
const TOKEN = "oat_test_token";

const user = {
  id: 1,
  fullName: "Flow Test",
  email: "flow@test.dev",
  initials: "FT",
  createdAt: "2026-09-26T00:00:00.000+00:00",
  updatedAt: null,
};

function json(route: Route, status: number, body: unknown) {
  return route.fulfill({
    status,
    contentType: "application/json",
    body: JSON.stringify(body),
  });
}

// Registra cada petición a la API para poder comprobar qué se envió (o que no se envió nada)
function trackApiRequests(page: Page) {
  const urls: string[] = [];
  page.on("request", (request) => {
    if (request.url().includes("/api/")) urls.push(request.url());
  });
  return urls;
}

async function fillAndSubmit(page: Page, email: string, password: string) {
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Contraseña").fill(password);
  await page.getByRole("button", { name: "Entrar" }).click();
}

test.describe("login", () => {
  test("valida en cliente sin llamar a la API", async ({ page }) => {
    const apiRequests = trackApiRequests(page);
    await page.goto("/");

    await page.getByRole("button", { name: "Entrar" }).click();
    await expect(page.getByRole("alert")).toHaveText("El email es obligatorio");

    await fillAndSubmit(page, "no-es-un-email", "password123");
    await expect(page.getByRole("alert")).toHaveText(
      "El email no tiene un formato válido",
    );

    await fillAndSubmit(page, "flow@test.dev", "");
    await expect(page.getByRole("alert")).toHaveText(
      "La contraseña es obligatoria",
    );

    expect(apiRequests).toEqual([]);
  });

  test("muestra error con credenciales inválidas (400)", async ({ page }) => {
    await page.route("**/api/v1/auth/login", (route) =>
      json(route, 400, { errors: [{ message: "Invalid user credentials" }] }),
    );
    await page.goto("/");

    await fillAndSubmit(page, "flow@test.dev", "mala");

    await expect(page.getByRole("alert")).toHaveText(
      "Email o contraseña incorrectos",
    );
    await expect(page.getByRole("button", { name: "Entrar" })).toBeEnabled();
  });

  test("muestra error en español cuando el backend rechaza la validación (422)", async ({
    page,
  }) => {
    await page.route("**/api/v1/auth/login", (route) =>
      json(route, 422, {
        errors: [
          {
            message: "The email field must be a valid email address",
            field: "email",
            rule: "email",
          },
        ],
      }),
    );
    await page.goto("/");

    await fillAndSubmit(page, "flow@test.dev", "password123");

    await expect(page.getByRole("alert")).toHaveText(
      "Revisa el email y la contraseña",
    );
  });

  test("muestra error cuando no hay conexión con el servidor", async ({
    page,
  }) => {
    await page.route("**/api/v1/auth/login", (route) =>
      route.abort("connectionrefused"),
    );
    await page.goto("/");

    await fillAndSubmit(page, "flow@test.dev", "password123");

    await expect(page.getByRole("alert")).toHaveText(
      "No se pudo conectar con el servidor",
    );
  });

  test("inicia sesión, guarda el token y lo usa para cargar el perfil", async ({
    page,
  }) => {
    let loginBody: unknown;
    let profileAuth: string | undefined;

    await page.route("**/api/v1/auth/login", (route) => {
      loginBody = route.request().postDataJSON();
      return json(route, 200, { data: { user, token: TOKEN } });
    });
    await page.route("**/api/v1/account/profile", (route) => {
      profileAuth = route.request().headers().authorization;
      return json(route, 200, { data: user });
    });
    await page.goto("/");

    await fillAndSubmit(page, "  flow@test.dev  ", "password123");

    await expect(
      page.getByRole("heading", { name: "Sesión iniciada" }),
    ).toBeVisible();
    await expect(page.getByText("Has entrado como Flow Test")).toBeVisible();
    expect(loginBody).toEqual({
      email: "flow@test.dev",
      password: "password123",
    });
    expect(profileAuth).toBe(`Bearer ${TOKEN}`);
    expect(
      await page.evaluate((key) => localStorage.getItem(key), TOKEN_KEY),
    ).toBe(TOKEN);
    expect(page.url()).not.toContain(TOKEN);
  });

  test("mantiene la sesión al recargar si hay token guardado", async ({
    page,
  }) => {
    await page.addInitScript(
      ([key, token]) => localStorage.setItem(key, token),
      [TOKEN_KEY, TOKEN] as const,
    );
    await page.route("**/api/v1/account/profile", (route) =>
      json(route, 200, { data: user }),
    );

    await page.goto("/");

    await expect(page.getByText("Has entrado como Flow Test")).toBeVisible();
  });

  test("vuelve al login y borra el token si el perfil responde 401", async ({
    page,
  }) => {
    await page.addInitScript(
      ([key, token]) => {
        // Solo en la primera carga, para poder comprobar después que se borró
        if (!sessionStorage.getItem("seeded")) {
          localStorage.setItem(key, token);
          sessionStorage.setItem("seeded", "1");
        }
      },
      [TOKEN_KEY, "oat_caducado"] as const,
    );
    await page.route("**/api/v1/account/profile", (route) =>
      json(route, 401, { errors: [{ message: "Unauthorized access" }] }),
    );

    await page.goto("/");

    await expect(
      page.getByRole("heading", { name: "Iniciar sesión" }),
    ).toBeVisible();
    expect(
      await page.evaluate((key) => localStorage.getItem(key), TOKEN_KEY),
    ).toBeNull();
  });
});
