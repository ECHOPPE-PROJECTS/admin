"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";

export default function SettingsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user, router]);

  if (loading) {
    return <div className="p-8 text-center">Chargement...</div>;
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-slate-900">Paramètres</h1>
          <p className="mt-1 text-sm text-slate-500">
            Profil de l’administrateur connecté et accès à la gestion.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl bg-white p-8 shadow ring-1 ring-slate-200">
            <h2 className="text-lg font-semibold text-slate-900">Mon profil</h2>
            <dl className="mt-6 space-y-4 text-sm">
              <div className="flex items-center justify-between gap-4">
                <dt className="text-slate-500">Nom d’utilisateur</dt>
                <dd className="font-medium text-slate-900">{user.username}</dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-slate-500">Email</dt>
                <dd className="font-medium text-slate-900">{user.email}</dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-slate-500">Rôle</dt>
                <dd className="font-medium text-slate-900">{user.role?.name || "—"}</dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-slate-500">Département</dt>
                <dd className="font-medium text-slate-900">{user.department?.name || "—"}</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-3xl bg-white p-8 shadow ring-1 ring-slate-200">
            <h2 className="text-lg font-semibold text-slate-900">Gestion des utilisateurs</h2>
            <p className="mt-3 text-sm text-slate-700">
              Les actions de création, de modification et de suppression des comptes se font depuis
              la page dédiée aux utilisateurs.
            </p>
            <Link
              href="/users"
              className="mt-6 inline-flex items-center justify-center rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Accéder à la gestion des utilisateurs
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
