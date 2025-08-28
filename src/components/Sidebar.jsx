import React from "react";
import {
  Grid,
  PieChart,
  Users,
  Settings,
  FolderTree,
  Building2,
  LogOut,
  FileQuestion,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Sidebar({ active, setActive }) {
  const navigate = useNavigate();

  const nav = [
    { key: "dashboard", label: "Dashboard", icon: Grid, path: "/" },
    {
      key: "sector_activity",
      label: "Secteur d'activité",
      icon: Building2,
      path: "/business-sectors",
    },
    {
      key: "category",
      label: "Catégories",
      icon: FolderTree,
      path: "/categories",
    },
    { key: "quiz", label: "Quiz", icon: PieChart, path: "/quiz" },
    {
      key: "questions",
      label: "Questions",
      icon: FileQuestion,
      path: "/questions",
    },
    { key: "settings", label: "Settings", icon: Settings, path: "/" },
  ];

  return (
    <aside className="w-72 bg-indigo-50/80 backdrop-blur-md border-r border-indigo-200 p-4 h-screen sticky top-0">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-indigo-600 text-white w-10 h-10 rounded-2xl flex items-center justify-center text-lg font-semibold">
          Q
        </div>
        <div>
          <div className="font-semibold">Quiz Studio</div>
          <div className="text-sm text-slate-500">Admin Panel</div>
        </div>
      </div>

      <nav className="flex flex-col gap-1">
        {nav.map((n) => {
          const Icon = n.icon;
          const isActive = active === n.key;
          return (
            <button
              key={n.key}
              onClick={() => {
                setActive(n.key);
                if (n.path) {
                  navigate(n.path);
                }
              }}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-left w-full ${
                isActive
                  ? "bg-indigo-50 text-indigo-700 font-medium"
                  : "text-slate-700 hover:bg-slate-50"
              }`}
            >
              <Icon
                className={`w-5 h-5 ${
                  isActive ? "text-indigo-600" : "text-slate-400"
                }`}
              />
              <span>{n.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="mt-auto pt-6">
        <button
          className="flex items-center gap-3 text-sm text-slate-600 hover:text-slate-800"
          onClick={() => {
            localStorage.removeItem("admin_token");
            window.location.href = "/login";
          }}
        >
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </div>
    </aside>
  );
}
