import { User, LogOut, Bell } from "lucide-react";

export default function HeaderSection() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-lg shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
            Administration
          </p>
          <h1 className="text-lg font-semibold text-slate-900 sm:text-xl">
            Tableau de bord admin
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            <Bell className="h-4 w-4" />
            Notifications
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-2xl bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-200"
          >
            <User className="h-4 w-4" />
            Admin
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-2xl bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
          >
            <LogOut className="h-4 w-4" />
            Déconnexion
          </button>
        </div>
      </div>
    </header>
  );
}