const API_BASE = "/api/v1";

// Espejo de backend/app/transformers/user_transformer.ts
export type User = {
  id: number;
  fullName: string | null;
  email: string;
  initials: string;
  createdAt: string;
  updatedAt: string | null;
};

export class ApiError extends Error {
  // status 0 = no se pudo contactar con el servidor
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }

  get isNetworkError() {
    return this.status === 0;
  }
}

type RequestOptions = {
  method?: "GET" | "POST";
  body?: unknown;
  token?: string;
};

async function request<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const headers: Record<string, string> = { Accept: "application/json" };
  if (options.body !== undefined) headers["Content-Type"] = "application/json";
  if (options.token) headers.Authorization = `Bearer ${options.token}`;

  let response: Response;
  try {
    response = await fetch(`${API_BASE}${path}`, {
      method: options.method ?? "GET",
      headers,
      body:
        options.body === undefined ? undefined : JSON.stringify(options.body),
    });
  } catch {
    throw new ApiError(0, "No se pudo conectar con el servidor");
  }

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    // El backend responde los errores como { errors: [{ message }] }
    const message = payload?.errors?.[0]?.message ?? `Error ${response.status}`;
    throw new ApiError(response.status, message);
  }

  // El backend envuelve las respuestas en { data: ... }
  return payload.data as T;
}

export function login(email: string, password: string) {
  return request<{ user: User; token: string }>("/auth/login", {
    method: "POST",
    body: { email, password },
  });
}

export function getProfile(token: string) {
  return request<User>("/account/profile", { token });
}
