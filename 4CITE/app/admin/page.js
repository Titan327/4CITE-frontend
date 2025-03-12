"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Page Admin
export default function Admin() {
  const router = useRouter();
  const [role, setRole] = useState(null);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // Recherche d'utilisateur
  const token = localStorage.getItem("token");
  const [newHotel, setNewHotel] = useState({
    name: "",
    address: "",
    city: "",
    country: "",
    description: "",
  });
  const [newRoom, setNewRoom] = useState({
      hotel_id: "",
      type_room: "",
      max_nb_people: "",
      number_of_room: "",
      description: "",
  });
  const [hotels, setHotels] = useState([]);

  // Vérification du rôle admin
  useEffect(() => {
    const userRole = localStorage.getItem("role");

    if (userRole !== "admin") {
      router.push("/hotel"); // Rediriger vers une autre page si l'utilisateur n'est pas admin
    } else {
      setRole(userRole);
      fetchHotels(); // Récupérer les hôtels pour la création de chambres
    }
  }, [router]);

  // Fonction pour récupérer tous les utilisateurs selon la recherche
  const fetchUsers = async (searchTerm) => {
      try {
        const response = await fetch(
          `http://localhost:3001/api/user/search?email=${searchTerm}`, 
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          // Assurez-vous que les données sont sous la clé `success` et qu'elles contiennent des utilisateurs
          setUsers(data.success || []); // Définit les utilisateurs ou un tableau vide en cas d'erreur
        } else {
          console.error("Erreur lors de la récupération des utilisateurs");
        }
      } catch (error) {
        console.error("Erreur de requête API:", error);
      }
    };
    

  // Fonction pour récupérer tous les hôtels
  const fetchHotels = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/hotel/search?page=1&limit=500", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setHotels(data.success.hotels);
      } else {
        console.error("Erreur lors de la récupération des hôtels");
      }
    } catch (error) {
      console.error("Erreur de requête API:", error);
    }
  };

  // Fonction pour rechercher un utilisateur
  const handleSearchUser = (e) => {
      setSearchTerm(e.target.value);
      fetchUsers(e.target.value); // Recherche dynamique en fonction du terme de recherche
    };

  // Fonction pour créer un hôtel
  const handleCreateHotel = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/hotel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newHotel),
      });
      if (response.ok) {
        alert("Hôtel créé avec succès");
        setNewHotel({
          name: "",
          address: "",
          city: "",
          country: "",
          description: "",
        }); // Réinitialiser le formulaire
      } else {
        alert("Erreur lors de la création de l'hôtel");
      }
    } catch (error) {
      console.error("Erreur lors de la création de l'hôtel", error);
    }
  };
  

  // Fonction pour créer une chambre
  const handleCreateRoom = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/room", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newRoom),
      });
      if (response.ok) {
        alert("Chambre créée avec succès");
        setNewRoom({
            hotel_id: "",
            type_room: "",
            max_nb_people: "",
            number_of_room: "",
            description: "",
        }); // Réinitialiser le formulaire
      } else {
        alert("Erreur lors de la création de la chambre");
      }
    } catch (error) {
      console.error("Erreur lors de la création de la chambre", error);
    }
  };

  return (
    <div className="container mx-auto p-6 bg-white">
      <h1 className="text-3xl font-bold mb-6">Page Admin</h1>

      {/* Recherche d'utilisateur */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Rechercher un utilisateur</h2>
        <input
          type="text"
          placeholder="Nom ou Email de l'utilisateur"
          value={searchTerm}
          onChange={handleSearchUser}
          className="w-full p-2 border border-gray-300 rounded-md mb-4"
        />
        <table className="w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2">ID</th>
              <th className="border border-gray-300 px-4 py-2">Nom</th>
              <th className="border border-gray-300 px-4 py-2">Email</th>
              <th className="border border-gray-300 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
  {users.map((user) => (
    <tr key={user.id}>
      <td className="border border-gray-300 px-4 py-2">{user.id}</td>
      <td className="border border-gray-300 px-4 py-2">{user.name}</td>
      <td className="border border-gray-300 px-4 py-2">{user.email}</td>
      <td className="border border-gray-300 px-4 py-2">
        <button
          onClick={() => handleEditUser(user.id)}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Modifier
        </button>
      </td>
    </tr>
  ))}
</tbody>
        </table>
      </div>

      {/* Formulaire pour créer un hôtel */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Créer un Hôtel</h2>
        <div>
          <input
            type="text"
            placeholder="Nom de l'hôtel"
            value={newHotel.name}
            onChange={(e) => setNewHotel({ ...newHotel, name: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-md mb-2"
          />
          <input
            type="text"
            placeholder="Adresse"
            value={newHotel.address}
            onChange={(e) => setNewHotel({ ...newHotel, address: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-md mb-2"
          />
          <input
            type="text"
            placeholder="Ville"
            value={newHotel.city}
            onChange={(e) => setNewHotel({ ...newHotel, city: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-md mb-2"
          />
          <input
            type="text"
            placeholder="Pays"
            value={newHotel.country}
            onChange={(e) => setNewHotel({ ...newHotel, country: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-md mb-2"
          />
          <textarea
            placeholder="Description"
            value={newHotel.description}
            onChange={(e) => setNewHotel({ ...newHotel, description: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-md mb-4"
          ></textarea>
          <button
            onClick={handleCreateHotel}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            Créer l'Hôtel
          </button>
        </div>
      </div>

      {/* Formulaire pour créer une chambre */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Créer une Chambre</h2>
        <div>
          <select
            value={newRoom.hotel_id}
            onChange={(e) => setNewRoom({ ...newRoom, hotel_id: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-md mb-2"
          >
            <option value="">Sélectionnez un hôtel</option>
            {hotels.map((hotel) => (
              <option key={hotel.id} value={hotel.id}>
                {hotel.name}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Type de chambre"
            value={newRoom.type_room}
            onChange={(e) => setNewRoom({ ...newRoom, type_room: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-md mb-2"
          />
          <input
            type="number"
            placeholder="Capacité"
            value={newRoom.max_nb_people}
            onChange={(e) => setNewRoom({ ...newRoom, max_nb_people: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-md mb-2"
          />
          <input
            type="number"
            placeholder="Nombre de chambres"
            value={newRoom.number_of_room}
            onChange={(e) => setNewRoom({ ...newRoom, number_of_room: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-md mb-2"
          />
          <textarea
            placeholder="Description"
            value={newRoom.description}
            onChange={(e) => setNewRoom({ ...newRoom, description: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-md mb-4"
          ></textarea>
          <button
            onClick={handleCreateRoom}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Créer la Chambre
          </button>
        </div>
      </div>
    </div>
  );
}
