"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import api from "@/lib/api";

interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: { name: string } | null;
  department: { name: string } | null;
  is_active: boolean;
}

export default function UsersPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user, router]);

  useEffect(() => {
    if (!user) return;
    api
      .get("/users/")
      .then((res) => setUsers(res.data.results || res.data))
      .catch((err) => {
        console.error(err);
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
            <h1 className="text-2xl font-semibold text-slate-900">Utilisateurs</h1>
            <p className="mt-1 text-sm text-slate-500">Liste des utilisateurs gérés par le backend.</p>
          </div>
        </div>

        <div className="overflow-hidden rounded-3xl bg-white shadow ring-1 ring-slate-200">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-slate-600">Nom</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-600">Email</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-600">Rôle</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-600">Département</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-600">Actif</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {users.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50">
                  <td className="px-4 py-4 text-slate-900">{item.first_name} {item.last_name}</td>
                  <td className="px-4 py-4 text-slate-700">{item.email}</td>
                  <td className="px-4 py-4 text-slate-700">{item.role?.name || "—"}</td>
                  <td className="px-4 py-4 text-slate-700">{item.department?.name || "—"}</td>
                  <td className="px-4 py-4 text-slate-700">{item.is_active ? "Oui" : "Non"}</td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-slate-400">
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
