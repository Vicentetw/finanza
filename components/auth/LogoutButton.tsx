"use client";

import { signOut } from "@/app/actions/auth";

export default function LogoutButton() {
  return (
    <form action={signOut}>
      <button
        type="submit"
        className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
      >
        Cerrar sesión
      </button>
    </form>
  );
}
