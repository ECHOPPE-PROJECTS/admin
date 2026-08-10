"use client";

import { useEffect } from "react";
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
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Paramètres</h1>
            <p className="mt-1 text-sm text-slate-500">
              Page de paramètres administrateur. Ajoute ici les préférences et les réglages systèmes.
            </p>
          </div>
        </div>

        <div className="rounded-3xl bg-white p-8 shadow ring-1 ring-slate-200">
          <p className="text-slate-700">
            Cette page est un espace réservé. Tu peux ajouter des contrôles pour la configuration des alertes,
            la gestion des rôles ou les paramètres de l’application.
          </p>
        </div>
      </div>
    </div>
  );
}
