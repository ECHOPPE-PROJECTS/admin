"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { deleteUser, getUsers } from "@/lib/api";
import type { UserItem } from "@/type";

export default function UsersPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<UserItem[]>([]);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user, router]);

  useEffect(() => {
    if (!user) return;
    getUsers()
      .then(setUsers)
      .catch(() => setError("Impossible de charger la liste des utilisateurs."));
  }, [user]);

  const handleDelete = async (id: number, username: string) => {
    if (!window.confirm(`Supprimer définitivement l’utilisateur « ${username} » ?`)) return;
    setDeletingId(id);
    setError("");
    try {
      await deleteUser(id);
      setUsers((prev) => prev.filter((item) => item.id !== id));
    } catch {
      setError("La suppression a échoué. Vérifie tes permissions.");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Chargement...</div>;
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Utilisateurs</h1>
            <p className="mt-1 text-sm text-slate-500">Liste des utilisateurs gérés par le backend.</p>
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
                <th className="px-4 py-3 text-left font-semibold text-slate-600">Nom</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-600">Email</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-600">Rôle</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-600">Département</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-600">Actif</th>
                <th className="px-4 py-3 text-right font-semibold text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {users.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50">
                  <td className="px-4 py-4 text-slate-900">{item.username}</td>
                  <td className="px-4 py-4 text-slate-700">{item.email}</td>
                  <td className="px-4 py-4 text-slate-700">{item.role?.name || "—"}</td>
                  <td className="px-4 py-4 text-slate-700">{item.department?.name || "—"}</td>
                  <td className="px-4 py-4 text-slate-700">{item.is_active ? "Oui" : "Non"}</td>
                  <td className="px-4 py-4 text-right">
                    <button
                      type="button"
                      onClick={() => handleDelete(item.id, item.username)}
                      disabled={deletingId === item.id || item.id === user.id}
                      className="rounded-2xl bg-red-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {deletingId === item.id ? "Suppression..." : "Supprimer"}
                    </button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                    Aucun utilisateur trouvé.
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
