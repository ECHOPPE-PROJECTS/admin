"use client";

import Link from "next/link";
import { Bell, House, MessageSquare, Settings, Users, Info } from "lucide-react";
import { usePathname } from "next/navigation";

const sidebarItems = [
  { label: "Tableau de bord", href: "/", icon: House },
  { label: "Utilisateurs", href: "/users", icon: Users },
  { label: "Incidents", href: "/incidents", icon: Bell },
  { label: "Messages", href: "/discussions", icon: MessageSquare },
  { label: "Paramètres", href: "/settings", icon: Settings },
  { label: "Audit", href: "/audit", icon: Info },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="relative z-10 flex-shrink-0 w-72 border-r border-slate-200 bg-slate-950 text-slate-100">
      <div className="flex h-full flex-col p-6">
        <div className="mb-8">
          <div className="mb-3 text-sm uppercase tracking-[0.2em] text-slate-400">
            Echoppe Admin
          </div>
          <div className="text-2xl font-semibold text-white">Gestion incidents</div>
        </div>

        <nav className="space-y-1 flex-1">
          {sidebarItems.map((item) => {
            const active = pathname === item.href || pathname?.startsWith(`${item.href}/`);
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-colors ${
                  active
                    ? "bg-slate-800 text-white shadow-lg"
                    : "text-slate-300 hover:bg-slate-900 hover:text-white"
                }`}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-8 rounded-3xl bg-slate-900 p-4 text-sm text-slate-400 ring-1 ring-slate-800">
          <div className="font-semibold text-slate-100">Espace admin</div>
          <p className="mt-2 text-sm leading-6">
            Gérez les incidents, les utilisateurs et suivez les activités .
          </p>
        </div>
      </div>
    </div>
  );
}