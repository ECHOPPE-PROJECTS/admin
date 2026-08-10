import Link from "next/link";
import Statistique from "./statistique/state";

export default function Home() {
  const cards = [
    { title: "Utilisateurs", value: "--", helper: "Actifs et rôles" },
    { title: "Incidents", value: "--", helper: "Ouverts / assignés" },
    { title: "Notifications", value: "--", helper: "Alertes récentes" },
    { title: "Activité", value: "--", helper: "Logs administrateurs" },
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
                Visualise rapidement l’activité, les incidents et la connectivité avec le backend Django REST.
              </p>
            </div>
            <Link
              href="/users"
              className="inline-flex items-center justify-center rounded-3xl bg-white/15 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-slate-950/20 transition hover:bg-white/25"
            >
              Gérer les utilisateurs
            </Link>
          </div>

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
              <span className="inline-flex rounded-full bg-slate-900/70 px-4 py-2 text-xs font-medium uppercase tracking-[0.24em] text-slate-300">
                Liquid Glass
              </span>
            </div>

            <div className="rounded-[1.75rem] border border-white/15 bg-slate-950/40 p-4 shadow-inner shadow-slate-950/20">
              <Statistique />
            </div>
          </div>

          <div className="space-y-6 rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-slate-950/25 backdrop-blur-xl">
            <div className="rounded-[1.75rem] border border-white/10 bg-slate-950/40 p-5">
              <h2 className="text-lg font-semibold text-white">Prochaines étapes</h2>
              <ul className="mt-4 space-y-3 text-sm text-slate-300">
                <li>• Ajouter des pages de gestion des utilisateurs et des incidents.</li>
                <li>• Consommer l’API Django REST du backend.</li>
                <li>• Implémenter l’authentification et la protection des routes.</li>
                <li>• Ajouter des indicateurs en temps réel et des logs d’activité.</li>
              </ul>
            </div>

            <div className="rounded-[1.75rem] border border-white/10 bg-slate-950/40 p-5">
              <h2 className="text-lg font-semibold text-white">Connectivité</h2>
              <p className="mt-4 text-sm leading-6 text-slate-300">
                Le projet admin peut consommer le backend Django via des appels API REST. Pense à définir
                <code className="ml-1 whitespace-pre rounded bg-slate-900/70 px-1.5 py-0.5 text-xs text-slate-200">
                  NEXT_PUBLIC_API_URL
                </code>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
