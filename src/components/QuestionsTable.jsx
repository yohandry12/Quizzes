import React from "react";

export default function QuestionsTable({
  questions,
  onEdit,
  onManageQuestions,
  onSoftDelete,
  onRestore,
  onPermanentDelete,
  isTrash = false,
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-50 text-slate-600 font-medium">
          <tr>
            <th className="p-3 text-left">Titre</th>
            <th className="p-3 text-left">Catégorie</th>
            <th className="p-3 text-left">Type</th>
            <th className="p-3 text-left">Créé le</th>
            <th className="p-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {(Array.isArray(questions) ? questions : []).map((q) => (
            <tr
              key={q.id}
              className="border-t last:border-b hover:bg-slate-50 transition"
            >
              <td className="p-3 font-medium text-slate-800">{q.title}</td>
              <td className="p-3">{q.category_name || "N/A"}</td>
              <td className="p-3">{q.question_type}</td>
              <td className="p-3 text-slate-500">
                {q.created_at
                  ? new Date(q.created_at).toLocaleDateString("fr-FR")
                  : "—"}
              </td>
              <td className="p-3 flex items-center justify-end gap-2">
                {isTrash ? (
                  <>
                    <button
                      onClick={() => onRestore(q)}
                      className="px-3 py-1 rounded-lg border bg-white hover:bg-green-50 text-green-600 hover:border-green-300 font-semibold"
                    >
                      Restaurer
                    </button>
                    <button
                      onClick={() => onPermanentDelete(q)}
                      className="px-3 py-1 rounded-lg bg-red-600 text-white hover:bg-red-700 font-semibold"
                    >
                      Supprimer définitivement
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => onEdit(q)}
                      className="px-3 py-1 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 font-semibold"
                    >
                      Éditer
                    </button>
                    <button
                      onClick={() => onSoftDelete(q)}
                      className="px-3 py-1 rounded-lg border bg-white hover:bg-red-50 text-red-600 hover:border-red-300 font-semibold"
                    >
                      Supprimer
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
  // return (
  //   <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
  //     <table className="min-w-full text-sm">
  //       <thead className="bg-slate-50 text-slate-600 font-medium">
  //         <tr>
  //           <th className="p-3 text-left">Titre</th>
  //           <th className="p-3 text-left">Catégorie</th>
  //           <th className="p-3 text-left">Type</th>
  //           <th className="p-3 text-left">Créé le</th>
  //           <th className="p-3 text-right">Actions</th>{" "}
  //           {/* Alignement à droite */}
  //         </tr>
  //       </thead>
  //       <tbody>
  //         {(Array.isArray(questions) ? questions : []).map((q) => (
  //           <tr
  //             key={q.id}
  //             className="border-t last:border-b hover:bg-slate-50 transition"
  //           >
  //             <td className="p-3 font-medium text-slate-800">{q.title}</td>
  //             <td className="p-3">{q.category_name || "N/A"}</td>
  //             <td className="p-3">{q.question_type}</td>
  //             <td className="p-3 text-slate-500">
  //               {q.created_at
  //                 ? new Date(q.created_at).toLocaleDateString("fr-FR")
  //                 : "—"}
  //             </td>
  //             <td className="p-3 flex items-center justify-end gap-2">
  //               <button
  //                 onClick={() => onEdit(q)}
  //                 className="px-3 py-1 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 font-semibold"
  //               >
  //                 Éditer
  //               </button>
  //               <button
  //                 onClick={() => onDelete(q)}
  //                 className="px-3 py-1 rounded-lg border bg-white hover:bg-red-50 text-red-600 hover:border-red-300 font-semibold"
  //               >
  //                 Supprimer
  //               </button>
  //             </td>
  //           </tr>
  //         ))}
  //       </tbody>
  //     </table>
  //   </div>
  // );
}
