"use client";

import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { getIncidentStatistics } from "@/lib/api";
import type { IncidentStatistic } from "@/type";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

export default function Statistique() {
  const [data, setData] = useState<IncidentStatistic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getIncidentStatistics()
      .then(setData)
      .catch(() => setError("Impossible de charger les statistiques."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="rounded-3xl bg-white p-6 shadow-lg ring-1 ring-slate-200">
      <h2 className="mb-6 text-lg font-semibold text-slate-900">Statistiques des incidents</h2>
      {loading && <div className="text-center text-sm text-slate-500">Chargement...</div>}
      {error && <div className="text-center text-sm text-red-600">{error}</div>}
      {!loading && !error && (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              label
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      )}
      {!loading && !error && data.length === 0 && (
        <div className="mt-4 text-center text-sm text-slate-500">
          Aucune statistique disponible pour le moment.
        </div>
      )}
    </div>
  );
}
