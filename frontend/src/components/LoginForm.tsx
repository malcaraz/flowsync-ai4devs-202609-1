import { useState, type FormEvent } from "react";
import { ApiError, login } from "../lib/api.ts";

type Props = {
  onSuccess: (token: string) => void;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(email: string, password: string): string | null {
  if (!email.trim()) return "El email es obligatorio";
  if (!EMAIL_PATTERN.test(email.trim()))
    return "El email no tiene un formato válido";
  if (!password) return "La contraseña es obligatoria";
  return null;
}

function errorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.isNetworkError) return "No se pudo conectar con el servidor";
    if (error.status === 400) return "Email o contraseña incorrectos";
    // Los mensajes de VineJS llegan en inglés: se muestra uno propio
    if (error.status === 422) return "Revisa el email y la contraseña";
  }
  return "Ha ocurrido un error inesperado. Inténtalo de nuevo";
}

function LoginForm({ onSuccess }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;

    const validationError = validate(email, password);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setSubmitting(true);
    try {
      const { token } = await login(email.trim(), password);
      onSuccess(token);
    } catch (err) {
      setError(errorMessage(err));
      setSubmitting(false);
    }
  }

  return (
    <form className="login-form" onSubmit={handleSubmit} noValidate>
      <h1>Iniciar sesión</h1>

      <label htmlFor="email">Email</label>
      <input
        id="email"
        type="email"
        autoComplete="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        disabled={submitting}
      />

      <label htmlFor="password">Contraseña</label>
      <input
        id="password"
        type="password"
        autoComplete="current-password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        disabled={submitting}
      />

      {error && (
        <p className="login-error" role="alert">
          {error}
        </p>
      )}

      <button type="submit" disabled={submitting}>
        {submitting ? "Entrando…" : "Entrar"}
      </button>
    </form>
  );
}

export default LoginForm;
