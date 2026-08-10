"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { getAuditItems } from "@/lib/api";

interface AuditEntry {
  id: number;
  user: string;
  action: string;
  description: string;
  ip_address: string | null;
  created_at: string;
}

export default function AuditPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [entries, setEntries] = useState<AuditEntry[]>([]);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user, router]);

  useEffect(() => {
    if (!user) return;

    getAuditItems()
      .then((data) => setEntries(data))
      .catch((err) => {
        console.error(err);
        setError("Impossible de charger les journaux d'activité.");
      });
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
            <h1 className="text-2xl font-semibold text-slate-900">Audit</h1>
            <p className="mt-1 text-sm text-slate-500">Derniers journaux d'activité du backend.</p>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-3xl bg-red-50 p-4 text-sm text-red-700 ring-1 ring-red-200">
            {error}
          </div>
        )}

        <div className="overflow-hidden rounded-3xl bg-white shadow ring-1 ring-slate-200">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-slate-600">Date</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-600">Utilisateur</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-600">Action</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-600">IP</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-600">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {entries.map((entry) => (
                <tr key={entry.id} className="hover:bg-slate-50">
                  <td className="px-4 py-4 text-slate-700">
                    {new Date(entry.created_at).toLocaleString("fr-FR")}
                  </td>
                  <td className="px-4 py-4 text-slate-700">{entry.user || "Anonyme"}</td>
                  <td className="px-4 py-4 text-slate-700">{entry.action}</td>
                  <td className="px-4 py-4 text-slate-700">{entry.ip_address || "—"}</td>
                  <td className="px-4 py-4 text-slate-700">{entry.description}</td>
                </tr>
              ))}
              {entries.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-slate-400">
                    Aucun journal d'activité trouvé.
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
