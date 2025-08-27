const BASE_URL = "https://hardcore-ramanujan.37-148-206-126.plesk.page";

export async function fetchAdminLogin(credentials) {
  try {
    const response = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });
    if (!response.ok)
      throw new Error(
        "Erreur lors de la récupération des informations d'authentification"
      );
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function fetchProfileAdmin() {
  try {
    const token = localStorage.getItem("admin_token");
    const response = await fetch(`${BASE_URL}/api/auth/profile`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    if (!response.ok)
      throw new Error("Erreur lors de la récupération du profil");
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}
