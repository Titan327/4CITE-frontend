"use client";
import { useEffect, useState } from "react";
import Header from "../components/Header";
import Link from "next/link"; // Assurez-vous d'importer Link pour la navigation

export default function HotelsPage() {
  const [hotels, setHotels] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // Page actuelle
  const [totalPages, setTotalPages] = useState(1); // Nombre total de pages
  const [limit] = useState(10); // Nombre d'hôtels par page

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `http://localhost:3001/api/hotel/search?page=${currentPage}&limit=${limit}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();

        if (data.success && Array.isArray(data.success.hotels)) {
          setHotels(data.success.hotels);
          setTotalPages(data.success.totalPages || 1); 
        } else {
          setHotels([]);
          setTotalPages(1);
        }
      } catch (error) {
        console.error("Error fetching hotels:", error);
        setHotels([]);
        setTotalPages(1);
      }
    };

    fetchHotels();
  }, [currentPage, limit]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Liste des Hôtels</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hotels.map((hotel) => (
            <Link key={hotel.id} href={`/hotel/${hotel.id}`}>
                <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-2">{hotel.name}</h2>
                  <p className="text-gray-700">
                    {hotel.address}, {hotel.city}, {hotel.country}
                  </p>
                  <p className="mt-3 text-gray-600">{hotel.description}</p>
                </div>
            </Link>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-6">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 mx-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-400"
            >
              Précédent
            </button>
            <span className="px-4 py-2">
              Page {currentPage} sur {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 mx-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-400"
            >
              Suivant
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
