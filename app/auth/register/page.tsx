"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function RegisterPage() {
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

    const supabase = createClient(); // cliente del navegador
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${window.location.origin}/auth/login` },
    });

    if (error) setError(error.message);
    else setSuccess(true);
  };

  if (success) return <p>Revisa tu correo para confirmar la cuenta</p>;

  return (
    <form onSubmit={handleSignUp} className="flex flex-col gap-2 max-w-sm mx-auto mt-10">
      <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="border p-2" />
      <input value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" type="password" className="border p-2" />
      <input value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Confirm Password" type="password" className="border p-2" />
      {error && <p className="text-red-500">{error}</p>}
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Registrarse</button>
    </form>
  );
}
