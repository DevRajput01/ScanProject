import { Link } from 'react-router-dom';
import { QrCode } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-white shadow-soft border-b border-gray-100">
      <div className="container mx-auto px-4 py-4 max-w-2xl">
        <Link
          to="/"
          className="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold"
        >
          <QrCode size={20} aria-hidden="true" />
          <span>ScanMyQr</span>
        </Link>
      </div>
    </header>
  );
}
