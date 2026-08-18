"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import {
  getCategories,
  createCategory,
  deleteCategory,
  getRoles,
  createRole,
  deleteRole,
  getDepartments,
  createDepartment,
  deleteDepartment,
  getStatus,
  createStatus,
  deleteStatus,
  getPriority,
  createPriority,
  deletePriority,
} from "@/lib/api";
import type {
  CategoryItem,
  RoleItem,
  DepartmentItem,
  StatusItem,
  PriorityItem,
} from "@/type";
import { toast } from "sonner";

type Tab = "categories" | "priorities" | "statuses" | "roles" | "departments" | "profil";

export default function SettingsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("profil");

  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [priorities, setPriorities] = useState<PriorityItem[]>([]);
  const [statuses, setStatuses] = useState<StatusItem[]>([]);
  const [roles, setRoles] = useState<RoleItem[]>([]);
  const [departments, setDepartments] = useState<DepartmentItem[]>([]);

  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newLevel, setNewLevel] = useState(1);
  const [newSla, setNewSla] = useState<string>("");

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;
    getCategories().then(setCategories).catch(() => {});
    getPriority().then(setPriorities).catch(() => {});
    getStatus().then(setStatuses).catch(() => {});
    getRoles().then(setRoles).catch(() => {});
    getDepartments().then(setDepartments).catch(() => {});
  }, [user]);

  const resetForm = () => {
    setNewName("");
    setNewDesc("");
    setNewLevel(1);
    setNewSla("");
  };

  const handleAdd = async () => {
    if (!newName.trim()) return;
    try {
      if (tab === "categories") {
        await createCategory({ name: newName, description: newDesc });
        setCategories(await getCategories());
      } else if (tab === "priorities") {
        await createPriority({ name: newName, level: newLevel, sla_hours: newSla ? Number(newSla) : null });
        setPriorities(await getPriority());
      } else if (tab === "statuses") {
        await createStatus({ name: newName, description: newDesc });
        setStatuses(await getStatus());
      } else if (tab === "roles") {
        await createRole({ name: newName, description: newDesc });
        setRoles(await getRoles());
      } else if (tab === "departments") {
        await createDepartment({ name: newName, description: newDesc });
        setDepartments(await getDepartments());
      }
      resetForm();
      toast.success("Ajouté avec succès");
    } catch {
      toast.error("Erreur lors de l'ajout");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      if (tab === "categories") {
        await deleteCategory(id);
        setCategories((prev) => prev.filter((c) => c.id !== id));
      } else if (tab === "priorities") {
        await deletePriority(id);
        setPriorities((prev) => prev.filter((p) => p.id !== id));
      } else if (tab === "statuses") {
        await deleteStatus(id);
        setStatuses((prev) => prev.filter((s) => s.id !== id));
      } else if (tab === "roles") {
        await deleteRole(id);
        setRoles((prev) => prev.filter((r) => r.id !== id));
      } else if (tab === "departments") {
        await deleteDepartment(id);
        setDepartments((prev) => prev.filter((d) => d.id !== id));
      }
      toast.success("Supprimé");
    } catch {
      toast.error("Erreur lors de la suppression");
    }
  };

  const tabs: { key: Tab; label: string }[] = [
    { key: "profil", label: "Profil" },
    { key: "categories", label: "Catégories" },
    { key: "priorities", label: "Priorités" },
    { key: "statuses", label: "Statuts" },
    { key: "roles", label: "Rôles" },
    { key: "departments", label: "Départements" },
  ];

  if (loading || !user) return <div className="p-8 text-center text-slate-500">Chargement...</div>;

  const showForm = tab !== "profil";
  const showLevel = tab === "priorities";

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-slate-900">Paramètres</h1>
          <p className="mt-1 text-sm text-slate-500">
            Gérez la configuration de l&apos;application.
          </p>
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => { setTab(t.key); resetForm(); }}
              className={`rounded-2xl px-4 py-2 text-sm font-medium transition ${
                tab === t.key
                  ? "bg-slate-950 text-white"
                  : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === "profil" ? (
          <div className="rounded-3xl bg-white p-8 shadow ring-1 ring-slate-200">
            <h2 className="text-lg font-semibold text-slate-900">Mon profil</h2>
            <dl className="mt-6 space-y-4 text-sm">
              <div className="flex items-center justify-between gap-4">
                <dt className="text-slate-500">Nom d&apos;utilisateur</dt>
                <dd className="font-medium text-slate-900">{user.username}</dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-slate-500">Email</dt>
                <dd className="font-medium text-slate-900">{user.email}</dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-slate-500">Rôle</dt>
                <dd className="font-medium text-slate-900">{user.role?.name || "—"}</dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-slate-500">Département</dt>
                <dd className="font-medium text-slate-900">{user.department?.name || "—"}</dd>
              </div>
            </dl>
          </div>
        ) : (
          <div className="rounded-3xl bg-white p-8 shadow ring-1 ring-slate-200">
            <h2 className="text-lg font-semibold text-slate-900">
              {tabs.find((t) => t.key === tab)?.label}
            </h2>

            <div className="mt-6 flex flex-wrap items-end gap-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-500">Nom</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="rounded-2xl border border-slate-300 px-4 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="Nom"
                />
              </div>
              {!showLevel && (
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-500">Description</label>
                  <input
                    type="text"
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    className="rounded-2xl border border-slate-300 px-4 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    placeholder="Description (optionnel)"
                  />
                </div>
              )}
              {showLevel && (
                <>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-500">Niveau (1-4)</label>
                    <input
                      type="number"
                      min={1}
                      max={4}
                      value={newLevel}
                      onChange={(e) => setNewLevel(Number(e.target.value))}
                      className="w-20 rounded-2xl border border-slate-300 px-4 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-500">SLA (heures)</label>
                    <input
                      type="number"
                      min={0}
                      value={newSla}
                      onChange={(e) => setNewSla(e.target.value)}
                      className="w-24 rounded-2xl border border-slate-300 px-4 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      placeholder="Optionnel"
                    />
                  </div>
                </>
              )}
              <button
                onClick={handleAdd}
                disabled={!newName.trim()}
                className="rounded-2xl bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
              >
                Ajouter
              </button>
            </div>

            <div className="mt-6 overflow-hidden rounded-2xl ring-1 ring-slate-200">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-slate-600">ID</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-600">Nom</th>
                    {tab === "priorities" && (
                      <>
                        <th className="px-4 py-3 text-left font-semibold text-slate-600">Niveau</th>
                        <th className="px-4 py-3 text-left font-semibold text-slate-600">SLA (h)</th>
                      </>
                    )}
                    {tab !== "priorities" && (
                      <th className="px-4 py-3 text-left font-semibold text-slate-600">Description</th>
                    )}
                    <th className="px-4 py-3 text-right font-semibold text-slate-600">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {tab === "categories" && categories.map((item) => (
                    <tr key={item.id}>
                      <td className="px-4 py-3 text-slate-500">{item.id}</td>
                      <td className="px-4 py-3 font-medium text-slate-900">{item.name}</td>
                      <td className="px-4 py-3 text-slate-600">{item.description || "—"}</td>
                      <td className="px-4 py-3 text-right">
                        <button onClick={() => handleDelete(item.id)} className="text-xs font-medium text-red-600 hover:text-red-800">Supprimer</button>
                      </td>
                    </tr>
                  ))}
                  {tab === "priorities" && priorities.map((item) => (
                    <tr key={item.id}>
                      <td className="px-4 py-3 text-slate-500">{item.id}</td>
                      <td className="px-4 py-3 font-medium text-slate-900">{item.name}</td>
                      <td className="px-4 py-3 text-slate-600">{item.level}</td>
                      <td className="px-4 py-3 text-slate-600">{item.sla_hours ?? "—"}</td>
                      <td className="px-4 py-3 text-right">
                        <button onClick={() => handleDelete(item.id)} className="text-xs font-medium text-red-600 hover:text-red-800">Supprimer</button>
                      </td>
                    </tr>
                  ))}
                  {tab === "statuses" && statuses.map((item) => (
                    <tr key={item.id}>
                      <td className="px-4 py-3 text-slate-500">{item.id}</td>
                      <td className="px-4 py-3 font-medium text-slate-900">{item.name}</td>
                      <td className="px-4 py-3 text-slate-600">{item.description || "—"}</td>
                      <td className="px-4 py-3 text-right">
                        <button onClick={() => handleDelete(item.id)} className="text-xs font-medium text-red-600 hover:text-red-800">Supprimer</button>
                      </td>
                    </tr>
                  ))}
                  {tab === "roles" && roles.map((item) => (
                    <tr key={item.id}>
                      <td className="px-4 py-3 text-slate-500">{item.id}</td>
                      <td className="px-4 py-3 font-medium text-slate-900">{item.name}</td>
                      <td className="px-4 py-3 text-slate-600">{item.description || "—"}</td>
                      <td className="px-4 py-3 text-right">
                        <button onClick={() => handleDelete(item.id)} className="text-xs font-medium text-red-600 hover:text-red-800">Supprimer</button>
                      </td>
                    </tr>
                  ))}
                  {tab === "departments" && departments.map((item) => (
                    <tr key={item.id}>
                      <td className="px-4 py-3 text-slate-500">{item.id}</td>
                      <td className="px-4 py-3 font-medium text-slate-900">{item.name}</td>
                      <td className="px-4 py-3 text-slate-600">{item.description || "—"}</td>
                      <td className="px-4 py-3 text-right">
                        <button onClick={() => handleDelete(item.id)} className="text-xs font-medium text-red-600 hover:text-red-800">Supprimer</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
