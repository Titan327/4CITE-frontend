"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link"; // Importation de Link

export default function HotelDetails() {
  const [hotel, setHotel] = useState(null);
  const [rooms, setRooms] = useState([]); // Ajouter un état pour les chambres
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1); // Nombre total de pages pour les chambres
  const params = useParams();
  const id = params.id;
  const [limit] = useState(10); // Nombre de chambres par page

  useEffect(() => {
    if (!id) return;

    // Fetch hotel details
    const fetchHotelDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `http://localhost:3001/api/hotel/search?page=1&limit=1&id=${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();

        if (data.success && data.success.hotels && data.success.hotels.length > 0) {
          setHotel(data.success.hotels[0]);
        } else {
          console.error("Erreur de récupération des détails de l'hôtel");
        }
      } catch (error) {
        console.error("Error fetching hotel details:", error);
      }
    };

    // Fetch rooms available for this hotel
    const fetchRooms = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `http://localhost:3001/api/room/search?page=${currentPage}&limit=${limit}&hotel_id=${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();

        if (data.success && data.success.rooms) {
          setRooms(data.success.rooms);
          setTotalPages(data.success.totalPages); // Total number of pages
        } else {
          console.error("Erreur de récupération des chambres");
        }
      } catch (error) {
        console.error("Error fetching rooms:", error);
      }
    };

    fetchHotelDetails();
    fetchRooms(); // Fetch rooms when component mounts or when hotel id changes
  }, [id, currentPage]); // Re-fetch rooms if currentPage changes

  if (!hotel) {
    return <div className="text-center text-lg">Chargement...</div>;
  }

  return (
    <div className="container mx-auto p-6 bg-white">
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h1 className="text-3xl font-bold text-blue-600 mb-4">{hotel.name}</h1>
        <p className="text-lg text-gray-700">Adresse: {hotel.address}</p>
        <p className="text-lg text-gray-700">Ville: {hotel.city}</p>
        <p className="text-lg text-gray-700">Pays: {hotel.country}</p>
        <p className="mt-4 text-gray-600">{hotel.description}</p>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-semibold text-blue-600 mb-4">Chambres disponibles</h2>
        {rooms.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map((room) => (
              <div
                key={room.id}
                className="bg-white p-4 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition"
              >
                <Link href={`/room/${room.id}?hotel_id=${hotel.id}`}> {/* Redirection avec l'ID de l'hôtel */}
                  <h3 className="text-xl font-semibold text-blue-600">{room.type_room}</h3>
                  <p className="text-lg text-gray-700">Capacité maximale: {room.max_nb_people} personnes</p>
                  <p className="text-gray-600">{room.description}</p>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <p>Aucune chambre disponible.</p>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-between mt-4">
            <button
              className="bg-blue-500 text-white py-2 px-4 rounded-full hover:bg-blue-600 transition"
              onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
            >
              Précédent
            </button>
            <button
              className="bg-blue-500 text-white py-2 px-4 rounded-full hover:bg-blue-600 transition"
              onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
            >
              Suivant
            </button>
          </div>
        )}
      </div>

      <div className="flex justify-center mt-4">
        <button
          className="bg-blue-500 text-white py-2 px-4 rounded-full hover:bg-blue-600 transition"
          onClick={() => window.history.back()}
        >
          Retour à la liste
        </button>
      </div>
    </div>
  );
}
