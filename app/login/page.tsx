"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      } catch (err) {
        let msg = "Échec de la connexion. Vérifie ton email et ton mot de passe.";
        if (axios.isAxiosError(err) && err.response) {
          const data = err.response.data as Record<string, unknown>;
          if (typeof data?.detail === "string") msg = data.detail;
          else if (Array.isArray(data?.non_field_errors)) msg = String(data.non_field_errors[0]);
          else if (typeof data?.non_field_errors === "string") msg = data.non_field_errors;
          else if (Array.isArray(data?.email)) msg = String(data.email[0]);
          else if (typeof data?.email === "string") msg = data.email;
        }
        setError(msg);
        console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl ring-1 ring-slate-200">
        <h1 className="text-2xl font-semibold text-slate-900">Connexion admin</h1>
        <p className="mt-2 text-sm text-slate-500">
          Connecte-toi pour accéder à la gestion des incidents.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
              placeholder="admin@echoppe.tg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60"
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        <button
          type="button"
          onClick={() => router.push("/")}
          className="mt-6 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 transition hover:bg-slate-50"
        >
          Retour au tableau de bord
        </button>
      </div>
    </div>
  );
}
