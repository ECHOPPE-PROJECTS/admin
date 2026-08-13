"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createUser } from "@/lib/api";
import { useAuth } from "@/lib/auth";

type CreateUserForm = {
  username: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  role: string;
  department: string;
  is_active: boolean;
};

const initialForm: CreateUserForm = {
  username: "",
  email: "",
  password: "",
  first_name: "",
  last_name: "",
  role: "",
  department: "",
  is_active: true,
};

export default function CreateUserPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState<CreateUserForm>(initialForm);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user, router]);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = event.target;
    const fieldName = name as keyof CreateUserForm;

    setForm((prev) => ({
      ...prev,
      [fieldName]:
        type === "checkbox" ? (event.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSending(true);
    setMessage(null);

    try {
      const payload = {
        username: form.username.trim(),
        email: form.email.trim(),
        password: form.password,
        first_name: form.first_name.trim(),
        last_name: form.last_name.trim(),
        role: form.role ? Number(form.role) : null,
        department: form.department ? Number(form.department) : null,
        is_active: form.is_active,
      };

      await createUser(payload);
      setMessage({ type: "success", text: "L’utilisateur a bien été créé." });
      setForm(initialForm);
    } catch (error) {
      const text =
        error instanceof Error
          ? error.message
          : "Une erreur est survenue lors de la création de l’utilisateur.";
      setMessage({ type: "error", text });
    } finally {
      setSending(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Chargement...</div>;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-3xl rounded-[2rem] bg-white p-8 shadow-xl ring-1 ring-slate-200">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Utilisateurs</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900">Créer un utilisateur</h1>
          </div>
          <button
            type="button"
            onClick={() => router.push("/users")}
            className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Retour
          </button>
        </div>

        {message && (
          <div
            className={`mb-6 rounded-2xl p-4 text-sm ${
              message.type === "success"
                ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                : "bg-red-50 text-red-700 ring-1 ring-red-200"
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-5 md:grid-cols-2">
            <label className="block text-sm font-medium text-slate-700">
              Nom d’utilisateur
              <input
                name="username"
                value={form.username}
                onChange={handleChange}
                required
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-slate-400 focus:bg-white"
                placeholder="jdoe"
              />
            </label>

            <label className="block text-sm font-medium text-slate-700">
              Email
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-slate-400 focus:bg-white"
                placeholder="admin@echoppe.tg"
              />
            </label>

            <label className="block text-sm font-medium text-slate-700">
              Mot de passe
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                required
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-slate-400 focus:bg-white"
                placeholder="********"
              />
            </label>

            <label className="block text-sm font-medium text-slate-700">
              Rôle
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-slate-400 focus:bg-white"
              >
                <option value="">Sélectionner un rôle</option>
                <option value="1">Admin</option>
                <option value="2">Utilisateur</option>
              </select>
            </label>

            <label className="block text-sm font-medium text-slate-700">
              Prénom
              <input
                name="first_name"
                value={form.first_name}
                onChange={handleChange}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-slate-400 focus:bg-white"
                placeholder="Jean"
              />
            </label>

            <label className="block text-sm font-medium text-slate-700">
              Nom
              <input
                name="last_name"
                value={form.last_name}
                onChange={handleChange}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-slate-400 focus:bg-white"
                placeholder="Dupont"
              />
            </label>

            <label className="block text-sm font-medium text-slate-700 md:col-span-2">
              Département
              <select
                name="department"
                value={form.department}
                onChange={handleChange}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-slate-400 focus:bg-white"
              >
                <option value="">Sélectionner un département</option>
                <option value="1">Technique</option>
                <option value="2">Support</option>
                <option value="3">Administration</option>
              </select>
            </label>
          </div>

          <label className="flex items-center gap-3 text-sm font-medium text-slate-700">
            <input
              type="checkbox"
              name="is_active"
              checked={form.is_active}
              onChange={handleChange}
              className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-500"
            />
            Compte actif
          </label>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => router.push("/users")}
              className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={sending}
              className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {sending ? "Création..." : "Créer l’utilisateur"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
