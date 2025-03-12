"use client";
import { useEffect, useState } from "react";

export default function Reservations() {
  const [bookings, setBookings] = useState([]);
  const [updatedBooking, setUpdatedBooking] = useState({
    id: null,
    number_of_people: 0,
    date_in: "",
    date_out: "",
  });
  const [isEditing, setIsEditing] = useState(null); // Etat pour savoir si l'on édite la réservation

  // Récupérer les réservations de l'API
  useEffect(() => {
    const fetchBookings = async () => {
      try {
            const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:3001/api/booking/search?page=1&limit=10",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
        const data = await response.json();
        if (data.success && data.success.bookings) {
          setBookings(data.success.bookings);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des réservations", error);
      }
    };
    
    fetchBookings();
  }, []);

  // Mettre à jour une réservation
  const handleUpdate = async (bookingId) => {
    const { number_of_people, date_in, date_out } = updatedBooking;
    if (!number_of_people || !date_in || !date_out) {
      alert("Veuillez remplir toutes les informations pour la mise à jour.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:3001/api/booking/${bookingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          number_of_people,
          date_in,
          date_out,
        }),
      });

      if (response.ok) {
        alert("Réservation mise à jour !");
        // Rafraîchir la liste des réservations après mise à jour
        fetchBookings();
        setIsEditing(null); // Cacher les champs de modification après la mise à jour
      } else {
        alert("Erreur lors de la mise à jour.");
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la réservation", error);
    }
  };

  // Annuler une réservation
  const handleCancel = async (bookingId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:3001/api/booking/${bookingId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        alert("Réservation annulée !");
        // Rafraîchir la liste après annulation
        fetchBookings();
      } else {
        alert("Erreur lors de l'annulation.");
      }
    } catch (error) {
      console.error("Erreur lors de l'annulation de la réservation", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedBooking((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditClick = (booking) => {
    // Afficher les champs de modification uniquement pour cette réservation
    setUpdatedBooking({
      id: booking.id,
      number_of_people: booking.number_of_people,
      date_in: booking.date_in.split("T")[0], // Format date
      date_out: booking.date_out.split("T")[0], // Format date
    });
    setIsEditing(booking.id);
  };

  return (
    <div className="container mx-auto p-6 bg-white">
      <h1 className="text-3xl font-bold mb-4 text-black">Mes Réservations</h1>
      
      {bookings.length === 0 ? (
        <p>Aucune réservation à afficher.</p>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div key={booking.id} className="p-4 border border-gray-300 rounded-lg">
              <h2 className="text-2xl font-semibold">{`Chambre ${booking.room_id}`}</h2>
              <p className="text-lg">Nombre de personnes : {booking.number_of_people}</p>
              <p className="text-lg">Date d'arrivée : {new Date(booking.date_in).toLocaleDateString()}</p>
              <p className="text-lg">Date de départ : {new Date(booking.date_out).toLocaleDateString()}</p>
              
              <div className="mt-4 flex gap-4">
                {/* Bouton Modifier */}
                {isEditing === booking.id ? (
                  <>
                    <div className="mt-4">
                      <label className="block text-lg">Modifier le nombre de personnes :</label>
                      <input
                        type="number"
                        name="number_of_people"
                        value={updatedBooking.number_of_people}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      />

                      <label className="block text-lg mt-4">Date d'arrivée :</label>
                      <input
                        type="date"
                        name="date_in"
                        value={updatedBooking.date_in}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      />

                      <label className="block text-lg mt-4">Date de départ :</label>
                      <input
                        type="date"
                        name="date_out"
                        value={updatedBooking.date_out}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      />

                      <div className="mt-6 flex gap-4">
                        <button
                          onClick={() => handleUpdate(booking.id)}
                          className="px-6 py-3 bg-blue-500 text-white rounded-md"
                        >
                          Mettre à jour
                        </button>
                        <button
                          onClick={() => handleCancel(booking.id)}
                          className="px-6 py-3 bg-red-500 text-white rounded-md"
                        >
                          Annuler la réservation
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleEditClick(booking)}
                      className="px-6 py-2 bg-green-500 text-white rounded-md"
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => handleCancel(booking.id)}
                      className="px-6 py-2 bg-red-500 text-white rounded-md"
                    >
                      Annuler la réservation
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
