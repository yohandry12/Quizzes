import React from "react";

export default function StatCard({ title, value, delta, icon: Icon }) {
  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-slate-500">{title}</div>
          <div className="text-2xl font-semibold">{value}</div>
        </div>
        <div className="bg-slate-50 p-2 rounded-lg">
          {Icon && <Icon className="w-6 h-6 text-slate-600" />}
        </div>
      </div>
      {delta && (
        <div className="mt-2 text-sm text-green-600">▲ {delta} depuis 30j</div>
      )}
    </div>
  );
}
