"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";

export default function RoomDetails() {
  const { id } = useParams(); // Utilisation de useParams pour obtenir l'ID de la chambre
  const searchParams = useSearchParams();
  const hotelId = searchParams.get("hotel_id"); // Utilisation de useSearchParams pour obtenir l'ID de l'hôtel

  const [room, setRoom] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [numPeople, setNumPeople] = useState(1); // Nombre de personnes par défaut à 1

  useEffect(() => {
    if (id && hotelId) {
      const fetchRoomDetails = async () => {
        try {
          const response = await fetch(`http://localhost:3001/api/room/search?page=1&limit=10&hotel_id=${hotelId}&id=${id}`);
          const data = await response.json();
          if (data.success && data.success.rooms && data.success.rooms.length > 0) {
            setRoom(data.success.rooms[0]);
          } else {
            console.error("Room not found");
          }
        } catch (error) {
          console.error("Error fetching room details:", error);
        }
      };

      fetchRoomDetails();
    }
  }, [id, hotelId]);

  const handleReservation = async () => {
    // Logique pour réserver la chambre avec les dates choisies et le nombre de personnes
    if (!startDate || !endDate) {
      alert("Veuillez sélectionner des dates de début et de fin.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3001/api/booking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          room_id: room.id,
          date_in:startDate,
          date_out:endDate,
          number_of_people:numPeople,
          "paid": true
        }),
      });

      if (response.ok) {
        alert("Réservation effectuée avec succès !");
        router.push("/reservations"); // Rediriger vers une page de réservations
      } else {
        alert("Erreur lors de la réservation");
      }
    } catch (error) {
      console.error("Erreur lors de la réservation", error);
    }
  };

  if (!room) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="container mx-auto p-6 bg-white">
      <h1 className="text-3xl font-bold mb-4 text-black">Détails de la Chambre</h1>

      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold text-black">{room.type_room} - {room.description}</h2>
          <p className="text-lg text-gray-700">Capacité : {room.max_nb_people} personnes</p>
          <p className="text-lg text-gray-700">Nombre de chambres disponibles : {room.number_of_room}</p>
        </div>

        <div>
          <label className="block text-lg font-medium text-black">Date de début</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-lg font-medium text-black">Date de fin</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-lg font-medium text-black">Nombre de personnes</label>
          <select
            value={numPeople}
            onChange={(e) => setNumPeople(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            {[...Array(room.max_nb_people).keys()].map((i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1} personne{(i + 1) > 1 ? 's' : ''}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-6">
          <button
            onClick={handleReservation}
            className="px-6 py-3 bg-blue-500 text-white rounded-md w-full"
          >
            Réserver et Payer
          </button>
        </div>
      </div>
    </div>
  );
}
