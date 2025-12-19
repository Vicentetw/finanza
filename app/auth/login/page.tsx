"use client";

import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const res = await fetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: { "Content-Type": "application/json" },
    });

    const json = await res.json();
    if (!res.ok) return setError(json.error);

    window.location.href = "/dashboard";
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 px-4 md:px-8">
      <div className="w-full max-w-md p-6 rounded-lg shadow-lg bg-card">
        <form onSubmit={handleLogin} className="space-y-4">
          <h2 className="text-3xl font-bold text-center text-primary-foreground">
            Iniciar Sesión
          </h2>

          <div className="input-group">
            <label htmlFor="email" className="block text-sm font-medium text-foreground">
              Email
            </label>
            <input
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              type="email"
              required
              className="w-full p-3 mt-2 border rounded-md text-foreground bg-input focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="input-group">
            <label htmlFor="password" className="block text-sm font-medium text-foreground">
              Contraseña
            </label>
            <input
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña"
              type="password"
              required
              className="w-full p-3 mt-2 border rounded-md text-foreground bg-input focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center mt-2">{error}</p>
          )}

          <button
            type="submit"
            className="w-full py-3 mt-4 bg-primary text-white rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}
