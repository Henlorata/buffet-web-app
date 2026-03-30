import { Utensils } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">

          {/* Logo */}
          <div className="flex items-center gap-2 text-amber-600">
            <Utensils className="w-6 h-6" />
            <span className="text-lg font-bold tracking-tight">
              Buffet<span className="text-gray-800">App</span>
            </span>
          </div>

          {/* Copyright */}
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} Buffet App. Minden jog fenntartva.
          </p>

          {/* Links */}
          <div className="flex gap-6 text-sm font-medium text-gray-500">
            <Link to="/" className="hover:text-amber-600 transition-colors">ÁSZF</Link>
            <Link to="/" className="hover:text-amber-600 transition-colors">Adatvédelem</Link>
            <Link to="/" className="hover:text-amber-600 transition-colors">Kapcsolat</Link>
          </div>

        </div>
      </div>
    </footer>
  );
}