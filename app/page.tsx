import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-100">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8 rounded-3xl bg-white p-8 shadow-lg ring-1 ring-slate-200">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500">
                Bienvenue sur l’espace admin
              </p>
              <h1 className="mt-2 text-3xl font-semibold text-slate-900">
                Tableau de bord incident
              </h1>
            </div>
            <Link
              href="/users"
              className="inline-flex items-center justify-center rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Gérer les utilisateurs
            </Link>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              { title: "Utilisateurs", value: "--", helper: "Actifs et rôles" },
              { title: "Incidents", value: "--", helper: "Ouverts / assignés" },
              { title: "Notifications", value: "--", helper: "Alertes récentes" },
              { title: "Activité", value: "--", helper: "Logs administrateurs" },
            ].map((card) => (
              <div
                key={card.title}
                className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm"
              >
                <p className="text-sm font-medium text-slate-600">
                  {card.title}
                </p>
                <p className="mt-4 text-3xl font-semibold text-slate-950">
                  {card.value}
                </p>
                <p className="mt-2 text-sm text-slate-500">{card.helper}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl bg-white p-6 shadow-lg ring-1 ring-slate-200">
            <h2 className="text-lg font-semibold text-slate-900">Prochaines étapes</h2>
            <ul className="mt-4 space-y-3 text-sm text-slate-600">
              <li>• Ajouter des pages de gestion des utilisateurs et des incidents.</li>
              <li>• Consommer l’API Django REST du backend.</li>
              <li>• Implémenter l’authentification et la protection des routes.</li>
              <li>• Ajouter des indicateurs en temps réel et des logs d’activité.</li>
            </ul>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-lg ring-1 ring-slate-200">
            <h2 className="text-lg font-semibold text-slate-900">Connectivité</h2>
            <p className="mt-4 text-sm text-slate-600">
              Le projet admin peut consommer le backend Django via des appels API REST. Pense à définir
              <code className="ml-1 whitespace-pre rounded bg-slate-100 px-1.5 py-0.5 text-xs text-slate-700">
                NEXT_PUBLIC_API_URL
              </code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
