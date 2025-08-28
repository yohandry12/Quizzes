import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  fetchAdminLogin,
  fetchProfileAdmin,
} from "./services/loginAdminService";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      // 1. Tentative de connexion
      const loginResult = await fetchAdminLogin({ email, password });
      // --- AJOUT POUR LE DÉBOGAGE ---
      // Affiche la réponse complète de l'API de login dans la console
      console.log("Réponse de l'API de login :", loginResult);

      // 2. Vérification du succès de la connexion et de la présence du token
      if (loginResult && loginResult.data && loginResult.data.token) {
        // Stockage temporaire du token pour l'appel suivant
        localStorage.setItem("admin_token", loginResult.data.token);

        // 3. Récupération du profil admin avec le token
        const profileResult = await fetchProfileAdmin();
        // --- AJOUT POUR LE DÉBOGAGE ---
        console.log("Réponse de l'API de profil :", profileResult);

        // 4. Vérification du succès de la récupération du profil
        if (profileResult && profileResult.data && profileResult.data.user) {
          // Stockage du profil utilisateur
          localStorage.setItem("user", JSON.stringify(profileResult.data.user));
          console.log(
            "Connexion et récupération du profil réussies. Redirection..."
          );
          // 5. Redirection vers le dashboard
          navigate("/");
        } else {
          // En cas d'échec de la récupération du profil, on nettoie
          setError("Impossible de récupérer le profil administrateur.");
          localStorage.removeItem("admin_token");
        }
      } else {
        setError(loginResult?.message || "Identifiants invalides");
      }
    } catch (err) {
      setError("Erreur serveur ou réseau");
      // On s'assure que le token est retiré en cas d'erreur
      localStorage.removeItem("admin_token");
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-white">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-100"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Connexion Admin</h2>
        {error && <div className="mb-4 text-red-600 text-sm">{error}</div>}
        <div className="mb-4">
          <label className="block text-sm mb-1 text-slate-600">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-xl focus:outline-none"
          />
        </div>
        <div className="mb-6">
          <label className="block text-sm mb-1 text-slate-600">
            Mot de passe
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-xl focus:outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
        >
          {loading ? "Connexion..." : "Se connecter"}
        </button>
      </form>
    </div>
  );
}
