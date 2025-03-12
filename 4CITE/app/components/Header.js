"use client";
import Link from "next/link";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';

export default function Header({ search, setSearch }) {

  return (
    <header className="bg-white shadow-md p-4 flex justify-between items-center">
      <input
        type="text"
        placeholder="Rechercher un hôtel..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      
      {/* Avatar cliquable avec une icône */}
      <Link href="/mon-compte">
        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-500 text-white cursor-pointer">
          <FontAwesomeIcon icon={faUserCircle} size="lg" />
        </div>
      </Link>
    </header>
  );
}
