"use client";

import { Fragment, useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { getIncidentItems, getAuditItems } from "@/lib/api";
import type { IncidentItem, AuditItem } from "@/type";

const statusColors: Record<string, string> = {
  Nouveau: "bg-yellow-100 text-yellow-800",
  Assigné: "bg-purple-100 text-purple-800",
  "En cours": "bg-orange-100 text-orange-800",
  Résolu: "bg-green-100 text-green-800",
  Fermé: "bg-gray-100 text-gray-600",
};

const statusOptions = ["Tous", "Nouveau", "Assigné", "En cours", "Résolu", "Fermé"];

export default function HistoryPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [incidents, setIncidents] = useState<IncidentItem[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditItem[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Tous");
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;
    Promise.all([getIncidentItems(), getAuditItems()]).then(([inc, aud]) => {
      setIncidents(inc);
      setAuditLogs(aud);
    });
  }, [user]);

  const filtered = useMemo(() => {
    return incidents.filter((inc) => {
      const matchSearch =
        !search ||
        inc.numero_ticket.toLowerCase().includes(search.toLowerCase()) ||
        inc.title.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "Tous" || inc.status?.name === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [incidents, search, statusFilter]);

  const getIncidentLogs = (numeroTicket: string): AuditItem[] => {
    return auditLogs.filter((log) => log.description.includes(numeroTicket));
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("fr-FR", { dateStyle: "medium", timeStyle: "short" });

  if (loading || !user) return <div className="p-8 text-center text-slate-500">Chargement...</div>;

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-slate-900">Historique des incidents</h1>
          <p className="mt-1 text-sm text-slate-500">
            Suivi complet de tous les incidents et de leur cycle de vie.
          </p>
        </div>

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par numéro ou titre..."
            className="flex-1 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            {statusOptions.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div className="overflow-hidden rounded-3xl bg-white shadow ring-1 ring-slate-200">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-slate-600">Ticket</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-600">Titre</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-600">Statut</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-600">Priorité</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-600">Créé le</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-600">Détails</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {filtered.map((inc) => {
                const logs = getIncidentLogs(inc.numero_ticket);
                const isExpanded = expandedId === inc.id;
                return (
                  <Fragment key={inc.id}>
                    <tr className="hover:bg-slate-50">
                      <td className="px-4 py-4 font-medium text-slate-900">{inc.numero_ticket}</td>
                      <td className="px-4 py-4 text-slate-700">{inc.title}</td>
                      <td className="px-4 py-4">
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[inc.status?.name || ""] || "bg-blue-100 text-blue-800"}`}>
                          {inc.status?.name || "N/A"}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-slate-700">{inc.priority?.name || "N/A"}</td>
                      <td className="px-4 py-4 text-slate-700">
                        {new Date(inc.created_at).toLocaleDateString("fr-FR", { dateStyle: "medium" })}
                      </td>
                      <td className="px-4 py-4">
                        <button
                          onClick={() => setExpandedId(isExpanded ? null : inc.id)}
                          className="text-xs font-medium text-indigo-600 hover:text-indigo-800"
                        >
                          {isExpanded ? "Masquer" : "Voir l'historique"}
                        </button>
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr>
                        <td colSpan={6} className="bg-slate-50 px-6 py-4">
                          <div className="space-y-3">
                            <h4 className="text-sm font-semibold text-slate-700">
                              Historique de {inc.numero_ticket}
                            </h4>
                            {logs.length > 0 ? (
                              <div className="relative ml-2 border-l-2 border-indigo-200 pl-4 space-y-4">
                                {logs.map((log) => (
                                  <div key={log.id} className="relative">
                                    <div className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-indigo-500 ring-2 ring-white" />
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3">
                                      <span className="text-xs text-slate-400 w-36 flex-shrink-0">
                                        {formatDate(log.created_at)}
                                      </span>
                                      <span className="text-sm font-medium text-slate-800">{log.action}</span>
                                    </div>
                                    <p className="mt-0.5 text-xs text-slate-500">
                                      {log.description}
                                      {log.user && <> — par <span className="font-medium text-slate-700">{log.user}</span></>}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-sm text-slate-400">Aucune activité enregistrée pour ce ticket.</p>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
              {filtered.length === 0 && (
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

