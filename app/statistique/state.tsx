"use client";

/**
 * Les statistiques de l'application admin en fonction de l'API Django REST du backend.
 * Exemple : nombre d'incidents ouverts, assignés, fermés.
 */
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const data = [
  { name: "Ouverts", value: 30 },
  { name: "Assignés", value: 30 },
  { name: "Fermés", value: 30 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

export default function Statistique() {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-lg ring-1 ring-slate-200">
      <h2 className="mb-6 text-lg font-semibold text-slate-900">Statistiques des incidents</h2>
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
    </div>
  );
}
