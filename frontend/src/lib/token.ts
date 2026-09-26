const TOKEN_KEY = "flowsync.token";

// localStorage puede lanzar (modo privado, almacenamiento bloqueado): se degrada a sin sesión
export function getToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setToken(token: string) {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch {
    // Sin persistencia: el token sigue en memoria en el estado de App
  }
}

export function clearToken() {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch {
    // Nada que limpiar
  }
}
