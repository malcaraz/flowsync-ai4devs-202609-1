import { useCallback, useState } from "react";
import LoginForm from "./components/LoginForm.tsx";
import Profile from "./components/Profile.tsx";
import { clearToken, getToken, setToken } from "./lib/token.ts";
import "./App.css";

function App() {
  const [token, setTokenState] = useState<string | null>(() => getToken());

  const handleLogin = useCallback((newToken: string) => {
    setToken(newToken);
    setTokenState(newToken);
  }, []);

  const handleUnauthorized = useCallback(() => {
    clearToken();
    setTokenState(null);
  }, []);

  return (
    <main className="app">
      {token ? (
        <Profile token={token} onUnauthorized={handleUnauthorized} />
      ) : (
        <LoginForm onSuccess={handleLogin} />
      )}
    </main>
  );
}

export default App;
