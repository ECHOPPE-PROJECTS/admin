"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import api from "@/lib/api";

interface Incident {
  id: number;
  numero_ticket: string;
  title: string;
  author: { first_name: string; last_name: string; email: string };
  status: { name: string };
  priority: { name: string };
  created_at: string;
}

const statusColors: Record<string, string> = {
  Nouveau: "bg-yellow-100 text-yellow-800",
  Assigné: "bg-purple-100 text-purple-800",
  "En cours": "bg-orange-100 text-orange-800",
  Résolu: "bg-green-100 text-green-800",
  Fermé: "bg-gray-100 text-gray-600",
};

export default function IncidentsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [incidents, setIncidents] = useState<Incident[]>([]);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user, router]);

  useEffect(() => {
    if (!user) return;
    api
      .get("/api/incidents/")
      .then((res) => setIncidents(res.data.results || res.data))
      .catch((err) => console.error(err));
  }, [user]);

  if (loading) {
    return <div className="p-8 text-center">Chargement...</div>;
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Incidents</h1>
            <p className="mt-1 text-sm text-slate-500">
              Gérez les tickets, assignez des techniciens et suivez les statuts.
            </p>
          </div>
        </div>

        <div className="overflow-hidden rounded-3xl bg-white shadow ring-1 ring-slate-200">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-slate-600">Ticket</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-600">Titre</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-600">Auteur</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-600">Statut</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-600">Priorité</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-600">Créé le</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {incidents.map((incident) => (
                <tr
                  key={incident.id}
                  className="cursor-pointer hover:bg-slate-50"
                  onClick={() => router.push(`/incidents/${incident.id}`)}
                >
                  <td className="px-4 py-4 font-medium text-slate-900">{incident.numero_ticket}</td>
                  <td className="px-4 py-4 text-slate-700">{incident.title}</td>
                  <td className="px-4 py-4 text-slate-700">
                    {incident.author?.first_name} {incident.author?.last_name}
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        statusColors[incident.status?.name] || "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {incident.status?.name || "N/A"}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-slate-700">{incident.priority?.name || "N/A"}</td>
                  <td className="px-4 py-4 text-slate-700">
                    {new Date(incident.created_at).toLocaleDateString("fr-FR")}
                  </td>
                </tr>
              ))}
              {incidents.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                    Aucun incident trouvé.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
