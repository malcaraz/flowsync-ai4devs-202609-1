import { useEffect, useState } from "react";
import { ApiError, getProfile, type User } from "../lib/api.ts";

type Props = {
  token: string;
  onUnauthorized: () => void;
};

function Profile({ token, onUnauthorized }: Props) {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    getProfile(token)
      .then((profile) => {
        if (!cancelled) setUser(profile);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        if (err instanceof ApiError && err.status === 401) {
          onUnauthorized();
          return;
        }
        setError(
          err instanceof ApiError && err.isNetworkError
            ? "No se pudo conectar con el servidor"
            : "No se pudo cargar tu perfil",
        );
      });

    return () => {
      cancelled = true;
    };
  }, [token, onUnauthorized]);

  if (error) {
    return (
      <p className="login-error" role="alert">
        {error}
      </p>
    );
  }

  if (!user) return <p>Cargando…</p>;

  return (
    <section className="profile">
      <h1>Sesión iniciada</h1>
      <p>
        Has entrado como <strong>{user.fullName ?? user.email}</strong>
      </p>
    </section>
  );
}

export default Profile;
