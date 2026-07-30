import React from "react";
import { User, LogOut, Bell } from "lucide-react";

export default function HeaderSection() {
  return (
    <header className="sticky top-0 z-50 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
      <div className="flex items-center justify-between px-6 py-3.5 bg-white/75 dark:bg-gray-800/75 backdrop-blur-md rounded-2xl border border-white/20 dark:border-gray-700/50 shadow-lg transition-all">
        
        {/* Titre du tableau de bord */}
        <h1 className="text-lg sm:text-xl lg:text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          Tableau de bord
          
        </h1>

        {/* Actions à droite */}
        <div className="flex items-center gap-3 sm:gap-4">
          
          {/* Bouton Se déconnecter */}
          <button 
            type="button"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-medium text-xs sm:text-sm shadow-sm hover:shadow transition-all duration-200"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Se déconnecter</span>
          </button>

          {/* Avatar Utilisateur */}
          <button
            type="button"
            aria-label="Profil utilisateur"
            className="flex items-center justify-center p-2 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 transition-colors"
          >
            <User className="w-5 h-5" />
          </button>

        </div>

        <div className="relative">
            <span className="flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-fex rounded-full h-3 w-3 bg-blue-500"></span>
            </span>
            <Bell className=" w-5 sm:w-6 h-5 sm:h-6 text-gray-300 cursor-pointer hover:text-blue-500"/>
        </div>


      </div>
    </header>
  );
}