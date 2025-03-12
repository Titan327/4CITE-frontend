"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';

export default function Header() {
  const [role, setRole] = useState(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/user/me", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          const userRole = data.success.role; // Suppose the response includes the user's role
          
          // Enregistrer le rôle dans le localStorage
          localStorage.setItem("role", userRole);
          
          // Mettre à jour l'état avec le rôle
          setRole(userRole);
        } else {
          console.error("Erreur lors de la récupération du rôle de l'utilisateur");
        }
      } catch (error) {
        console.error("Erreur de requête API:", error);
      }
    };

    fetchUserRole();
  }, []);

  return (
    <header className="bg-white shadow-md p-4 flex justify-between items-center">
      {/* Bouton "Voir mes réservations" */}
      <Link href="/mes-reservations">
        <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
          Voir mes réservations
        </button>
      </Link>

      {/* Si l'utilisateur est admin, afficher le bouton "Admin" */}
      {role === "admin" && (
        <Link href="/admin">
          <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
            Admin
          </button>
        </Link>
      )}

      {/* Avatar cliquable avec une icône */}
      <Link href="/mon-compte">
        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-500 text-white cursor-pointer">
          <FontAwesomeIcon icon={faUserCircle} size="lg" />
        </div>
      </Link>
    </header>
  );
}
