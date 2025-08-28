import React from "react";
import { Menu, PlusCircle, Search } from "lucide-react";

function IconButton({ children, onClick, className = "" }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-2xl shadow-sm hover:shadow-md transition ${className}`}
    >
      {children}
    </button>
  );
}

export default function Topbar({ onSearch, profile }) {
  return (
    <div className="bg-slate-50/80 backdrop-blur-sm border-b border-slate-200 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <IconButton
          className="bg-slate-100/80 hover:bg-slate-200/80"
          onClick={() => {}}
        >
          <Menu className="w-4 h-4 text-slate-600" />
        </IconButton>
        <div className="text-lg font-semibold">Tableau de bord</div>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative">
          <input
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Rechercher quizzes, utilisateurs..."
            className="pl-10 pr-4 py-2 rounded-2xl border border-slate-200/60 bg-white/70 backdrop-blur-sm w-80 focus:outline-none focus:ring-1 focus:ring-indigo-300 focus:border-indigo-300"
          />
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
        </div>



        <div className="flex items-center gap-2 px-3 py-1 rounded-xl border border-slate-200/60 bg-white/70 backdrop-blur-sm hover:bg-white/90 transition-all">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-yellow-300 flex items-center justify-center text-white font-semibold">
            {profile?.name ? profile.name[0].toUpperCase() : "A"}
          </div>
          <div className="text-sm">
            {profile?.name}
            {profile?.email && (
              <span className="ml-2 text-slate-400">{profile.email}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
