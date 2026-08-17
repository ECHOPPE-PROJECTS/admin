"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import {
  getIncidentDetail,
  getUsers,
  assignIncident,
  resolveIncident,
  closeIncident,
} from "@/lib/api";
import type { IncidentDetailItem, UserItem } from "@/type";
import { toast } from "sonner";

export default function IncidentDetailPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const [incident, setIncident] = useState<IncidentDetailItem | null>(null);
  const [users, setUsers] = useState<UserItem[]>([]);
  const [selectedTech, setSelectedTech] = useState<number | null>(null);

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading, router]);

  useEffect(() => {
    if (!user || !params.id) return;
    getIncidentDetail(Number(params.id)).then(setIncident);
    getUsers().then(setUsers);
  }, [user, params.id]);

  const handleAssign = async () => {
    if (!selectedTech || !incident) return;
    try {
      const updated = await assignIncident(incident.id, selectedTech);
      setIncident(updated);
      toast.success("Technicien assigné");
    } catch {
      toast.error("Erreur lors de l'assignation");
    }
  };

  const handleResolve = async () => {
    if (!incident) return;
    try {
      const updated = await resolveIncident(incident.id);
      setIncident(updated);
      toast.success("Ticket résolu");
    } catch {
      toast.error("Erreur lors de la résolution");
    }
  };

  const handleClose = async () => {
    if (!incident) return;
    try {
      const updated = await closeIncident(incident.id);
      setIncident(updated);
      toast.success("Ticket fermé");
    } catch {
      toast.error("Erreur lors de la fermeture");
    }
  };

  if (loading || !incident)
    return <div className="p-8 text-center text-slate-500">Chargement...</div>;
  if (!user) return null;

  const technicians = users.filter(
    (u) => u.role?.name === "Technicien" || u.role?.name === "Administrateur"
  );

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="mx-auto max-w-4xl px-6 py-8">
        <button
          onClick={() => router.push("/incidents")}
          className="mb-4 text-sm text-slate-500 hover:text-slate-700"
        >
          &larr; Retour
        </button>

        <div className="rounded-3xl bg-white p-8 shadow ring-1 ring-slate-200">
          <div className="mb-6 flex items-start justify-between">
            <div>
              <p className="text-sm text-slate-500">{incident.numero_ticket}</p>
              <h1 className="text-2xl font-bold text-slate-900">{incident.title}</h1>
            </div>
            <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
              {incident.status?.name || "N/A"}
            </span>
          </div>

          <div className="mb-6 grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-slate-500">Catégorie</span>
              <p className="text-slate-900">{incident.category?.name || "N/A"}</p>
            </div>
            <div>
              <span className="font-medium text-slate-500">Priorité</span>
              <p className="text-slate-900">{incident.priority?.name || "N/A"}</p>
            </div>
            <div>
              <span className="font-medium text-slate-500">Auteur</span>
              <p className="text-slate-900">
                {incident.author?.first_name} {incident.author?.last_name}
              </p>
            </div>
            <div>
              <span className="font-medium text-slate-500">Technicien</span>
              <p className="text-slate-900">
                {incident.technician
                  ? `${incident.technician.first_name} ${incident.technician.last_name}`
                  : "Non assigné"}
              </p>
            </div>
            <div>
              <span className="font-medium text-slate-500">Créé le</span>
              <p className="text-slate-900">
                {new Date(incident.created_at).toLocaleDateString("fr-FR", {
                  dateStyle: "long",
                })}
              </p>
            </div>
            {incident.resolved_at && (
              <div>
                <span className="font-medium text-slate-500">Résolu le</span>
                <p className="text-slate-900">
                  {new Date(incident.resolved_at).toLocaleDateString("fr-FR", {
                    dateStyle: "long",
                  })}
                </p>
              </div>
            )}
            {incident.closed_at && (
              <div>
                <span className="font-medium text-slate-500">Fermé le</span>
                <p className="text-slate-900">
                  {new Date(incident.closed_at).toLocaleDateString("fr-FR", {
                    dateStyle: "long",
                  })}
                </p>
              </div>
            )}
          </div>

          <div className="mb-8">
            <h3 className="mb-2 text-sm font-medium text-slate-500">Description</h3>
            <p className="whitespace-pre-wrap text-slate-900">{incident.description}</p>
          </div>

          <div className="mb-8 space-y-4 rounded-2xl bg-slate-50 p-6 ring-1 ring-slate-200">
            <h3 className="text-sm font-semibold text-slate-700">Actions</h3>

            {!incident.technician && incident.status?.name !== "Fermé" && (
              <div className="flex items-center gap-3">
                <select
                  value={selectedTech ?? ""}
                  onChange={(e) => setSelectedTech(Number(e.target.value))}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                >
                  <option value="">Sélectionner un technicien</option>
                  {technicians.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.first_name} {t.last_name}
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleAssign}
                  disabled={!selectedTech}
                  className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
                >
                  Assigner
                </button>
              </div>
            )}

            <div className="flex gap-3">
              {incident.status?.name !== "Résolu" &&
                incident.status?.name !== "Fermé" && (
                  <button
                    onClick={handleResolve}
                    className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
                  >
                    Résoudre
                  </button>
                )}
              {incident.status?.name !== "Fermé" && (
                <button
                  onClick={handleClose}
                  className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                >
                  Fermer
                </button>
              )}
            </div>
          </div>

          {incident.comments.length > 0 && (
            <div className="mt-6">
              <h3 className="mb-4 text-sm font-semibold text-slate-700">
                Commentaires ({incident.comments.length})
              </h3>
              <div className="space-y-3">
                {incident.comments.map((c) => (
                  <div key={c.id} className="rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200">
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-900">
                        {c.author?.first_name} {c.author?.last_name}
                      </span>
                      <span className="text-xs text-slate-400">
                        {new Date(c.created_at).toLocaleString("fr-FR")}
                      </span>
                    </div>
                    <p className="text-sm text-slate-700">{c.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
