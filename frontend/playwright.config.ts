import { defineConfig, devices } from "@playwright/test";

// Puerto propio para no chocar con el `npm run dev` habitual (5173)
const PORT = 5174;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: "on-first-retry",
    // E2E_VIDEO=1 graba cada test en test-results/ (lo usa la skill /e2e-gif)
    video: process.env.E2E_VIDEO
      ? { mode: "on", size: { width: 1280, height: 720 } }
      : "off",
  },
  projects: process.env.E2E_CHROME
    ? [
        // Google Chrome instalado en el sistema, ralentizado para poder seguir la ejecución
        {
          name: "chrome",
          use: {
            ...devices["Desktop Chrome"],
            channel: "chrome",
            launchOptions: { slowMo: Number(process.env.E2E_SLOWMO ?? 1000) },
          },
        },
      ]
    : [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  // La API se mockea en cada test: solo hace falta el servidor de Vite
  webServer: {
    command: `npm run dev -- --port ${PORT} --strictPort`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
  },
});
