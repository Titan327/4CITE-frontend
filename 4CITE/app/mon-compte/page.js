"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function MonCompte() {
  const [userData, setUserData] = useState({
    name: "",
    surname: "",
    email: "",
  });
  const [editing, setEditing] = useState(false); // Permet d'activer ou désactiver le mode édition
  const router = useRouter();

  useEffect(() => {
    // Récupérer les informations de l'utilisateur
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:3001/api/user/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (data.success) {
          setUserData({
            name: data.success.name,
            surname: data.success.surname,
            email: data.success.email,
          });
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des données utilisateur", error);
      }
    };
    fetchUserData();
  }, []);

  const handleSaveChanges = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3001/api/user/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        alert("Informations mises à jour avec succès !");
        setEditing(false);
      } else {
        alert("Erreur lors de la mise à jour des informations");
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour", error);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3001/api/user/me", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        alert("Compte supprimé avec succès !");
        localStorage.removeItem("token"); // Supprimer le token
        router.push("/"); // Rediriger vers la page d'accueil après suppression
      } else {
        alert("Erreur lors de la suppression du compte");
      }
    } catch (error) {
      console.error("Erreur lors de la suppression du compte", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/"); // Rediriger vers la page de connexion après déconnexion
  };

  return (
    <div className="container mx-auto p-6 bg-white">
      <h1 className="text-3xl font-bold mb-4 text-black">Mon Compte</h1>

      <div className="space-y-4">
        <div>
          <label className="block text-lg font-medium text-black">Nom</label>
          <input
            type="text"
            value={userData.name}
            onChange={(e) => setUserData({ ...userData, name: e.target.value })}
            disabled={!editing}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-lg font-medium text-black">Prénom</label>
          <input
            type="text"
            value={userData.surname}
            onChange={(e) => setUserData({ ...userData, surname: e.target.value })}
            disabled={!editing}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-lg font-medium text-black">Email</label>
          <input
            type="email"
            value={userData.email}
            onChange={(e) => setUserData({ ...userData, email: e.target.value })}
            disabled={!editing}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="flex gap-4">
          {editing ? (
            <button
              onClick={handleSaveChanges}
              className="px-4 py-2 bg-blue-500 text-white rounded-md"
            >
              Sauvegarder
            </button>
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="px-4 py-2 bg-yellow-500 text-white rounded-md"
            >
              Modifier
            </button>
          )}

          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded-md"
          >
            Se Déconnecter
          </button>

          <button
            onClick={handleDeleteAccount}
            className="px-4 py-2 bg-red-600 text-white rounded-md"
          >
            Supprimer le compte
          </button>
        </div>
      </div>
    </div>
  );
}
