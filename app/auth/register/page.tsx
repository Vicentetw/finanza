"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function RegisterPage() {
  const [name, setName] = useState("");              // 👈 NUEVO
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    const supabase = createClient();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          nombre: name,   // 👈 Envia el nombre al metadata
        },
        emailRedirectTo: `${window.location.origin}/auth/login`,
      },
    });

    if (error) setError(error.message);
    else setSuccess(true);
  };

  if (success)
    return (
      <p className="text-center text-green-500">
        Revisa tu correo para confirmar la cuenta.
      </p>
    );

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 px-4 md:px-8">
      <div className="w-full max-w-md p-6 rounded-lg shadow-lg bg-card">
        <form onSubmit={handleSignUp} className="space-y-4">
          <h2 className="text-3xl font-bold text-center text-primary-foreground">
            Registrarse
          </h2>

          {/* NOMBRE */}
          <div className="input-group">
            <label htmlFor="name" className="block text-sm font-medium text-foreground">
              Nombre
            </label>
            <input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Tu nombre"
              type="text"
              required
              className="w-full p-3 mt-2 border rounded-md text-foreground bg-input focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* EMAIL */}
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

          {/* CONTRASEÑA */}
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

          {/* CONFIRMAR CONTRASEÑA */}
          <div className="input-group">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground">
              Confirmar Contraseña
            </label>
            <input
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirmar Contraseña"
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
            Registrarse
          </button>
        </form>
      </div>
    </div>
  );
}
