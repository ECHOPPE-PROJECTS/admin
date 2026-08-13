"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { getDashboardStats, getNotificationItems } from "@/lib/api";
import type { DashboardStats, NotificationItem } from "@/type";
import Statistique from "./statistique/state";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    users: 0,
    incidents: 0,
    notifications: 0,
    activities: 0,
  });
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user, router]);

  useEffect(() => {
    if (!user) return;
    getDashboardStats()
      .then(setStats)
      .catch(() => setError("Impossible de charger les statistiques du tableau de bord."));
    getNotificationItems()
      .then((items) => setNotifications(items.slice(0, 5)))
      .catch(() => {});
  }, [user]);

  if (loading) {
    return <div className="p-8 text-center">Chargement...</div>;
  }

  if (!user) return null;

  const cards = [
    { title: "Utilisateurs", value: stats.users, helper: "Actifs et rôles" },
    { title: "Incidents", value: stats.incidents, helper: "Ouverts / assignés" },
    { title: "Notifications", value: stats.notifications, helper: "Alertes récentes" },
    { title: "Activité", value: stats.activities, helper: "Logs administrateurs" },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8 overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-2xl shadow-slate-950/30 backdrop-blur-xl">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-slate-400">
                Bienvenue sur l’espace admin
              </p>
              <h1 className="mt-2 text-4xl font-semibold text-white">
                Tableau de bord incidents
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
                {user.first_name || user.username}, voici l’activité du backend Django REST.
              </p>
            </div>
            <Link
              href="/users"
              className="inline-flex items-center justify-center rounded-3xl bg-white/15 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-slate-950/20 transition hover:bg-white/25"
            >
              Gérer les utilisateurs
            </Link>
          </div>

          {error && (
            <div className="mt-6 rounded-3xl bg-red-500/10 p-4 text-sm text-red-300 ring-1 ring-red-500/30">
              {error}
            </div>
          )}

          <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {cards.map((card) => (
              <div
                key={card.title}
                className="rounded-[1.75rem] border border-white/10 bg-white/10 p-6 shadow-xl shadow-slate-950/20 backdrop-blur-xl transition hover:-translate-y-0.5 hover:bg-white/15"
              >
                <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-300">
                  {card.title}
                </p>
                <p className="mt-5 text-3xl font-semibold text-white">{card.value}</p>
                <p className="mt-3 text-sm text-slate-400">{card.helper}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.4fr_0.95fr]">
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-slate-950/25 backdrop-blur-xl">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-slate-400">
                  Analyse visuelle
                </p>
                <h2 className="text-2xl font-semibold text-white">Statistiques des incidents</h2>
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-white/15 bg-slate-950/40 p-4 shadow-inner shadow-slate-950/20">
              <Statistique />
            </div>
          </div>

          <div className="space-y-6 rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-slate-950/25 backdrop-blur-xl">
            <div className="rounded-[1.75rem] border border-white/10 bg-slate-950/40 p-5">
              <h2 className="text-lg font-semibold text-white">Notifications récentes</h2>
              <ul className="mt-4 space-y-3 text-sm text-slate-300">
                {notifications.map((notification) => (
                  <li key={notification.id} className="flex items-start justify-between gap-3">
                    <span>{notification.message}</span>
                    {notification.created_at && (
                      <span className="shrink-0 text-xs text-slate-500">
                        {new Date(notification.created_at).toLocaleDateString("fr-FR")}
                      </span>
                    )}
                  </li>
                ))}
                {notifications.length === 0 && (
                  <li className="text-slate-500">Aucune notification récente.</li>
                )}
              </ul>
            </div>

            <div className="rounded-[1.75rem] border border-white/10 bg-slate-950/40 p-5">
              <h2 className="text-lg font-semibold text-white">Connexion au backend</h2>
              <p className="mt-4 text-sm leading-6 text-slate-300">
                {error
                  ? "Le backend est actuellement injoignable."
                  : "Connecté à l’API Django REST."}
              </p>
              <code className="mt-2 inline-block whitespace-pre rounded bg-slate-900/70 px-1.5 py-0.5 text-xs text-slate-200">
                {process.env.NEXT_PUBLIC_API_URL || "https://backend-t8k0.onrender.com"}
              </code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
