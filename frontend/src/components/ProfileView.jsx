import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { MapPin, Phone, MessageCircle, FileText } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

export default function ProfileView() {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      setError('Invalid profile ID');
      return;
    }
    const url = API_BASE.startsWith('http') ? `${API_BASE}/api/profiles/${id}` : `/api/profiles/${id}`;
    fetch(url)
      .then((res) => {
        if (res.status === 404) throw new Error('not_found');
        return res.json();
      })
      .then((data) => {
        setProfile(data);
        setError(null);
      })
      .catch((err) => {
        setProfile(null);
        setError(err.message === 'not_found' ? 'not_found' : 'Failed to load profile');
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-card p-6 sm:p-8 animate-pulse">
        <div className="h-8 bg-gray-200 rounded-lg w-3/4 mb-6" />
        <div className="space-y-4">
          <div className="h-4 bg-gray-100 rounded w-full" />
          <div className="h-4 bg-gray-100 rounded w-5/6" />
          <div className="h-4 bg-gray-100 rounded w-4/6" />
        </div>
        <div className="mt-8 flex gap-3">
          <div className="h-10 bg-gray-100 rounded-xl w-24" />
          <div className="h-10 bg-gray-100 rounded-xl w-28" />
        </div>
      </div>
    );
  }

  if (error === 'not_found' || !profile) {
    return (
      <div className="bg-white rounded-2xl shadow-card p-8 text-center">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Profile not found</h2>
        <p className="text-gray-500 mb-6">This profile may have been removed or the link is invalid.</p>
        <Link to="/" className="text-primary-600 font-medium hover:underline">
          Create your own profile
        </Link>
      </div>
    );
  }

  const tel = profile.phone ? profile.phone.replace(/\s/g, '') : '';
  const whatsappNum = profile.whatsapp ? profile.whatsapp.replace(/\D/g, '') : '';
  const whatsappUrl = whatsappNum ? `https://wa.me/${whatsappNum}` : null;

  return (
    <div className="bg-white rounded-2xl shadow-card p-6 sm:p-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">{profile.name}</h1>

      {profile.location && (
        <div className="flex items-center gap-3 text-gray-700 mb-4">
          <MapPin size={20} className="text-gray-500 shrink-0" />
          <span>{profile.location}</span>
        </div>
      )}

      {profile.phone && (
        <div className="flex items-center gap-3 text-gray-700 mb-4">
          <Phone size={20} className="text-gray-500 shrink-0" />
          <a href={`tel:${tel}`} className="text-primary-600 hover:underline">
            {profile.phone}
          </a>
        </div>
      )}

      {profile.whatsapp && (
        <div className="flex items-center gap-3 text-gray-700 mb-4">
          <MessageCircle size={20} className="text-gray-500 shrink-0" />
          {whatsappUrl ? (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-600 hover:underline"
            >
              {profile.whatsapp}
            </a>
          ) : (
            <span>{profile.whatsapp}</span>
          )}
        </div>
      )}

      {profile.bio && (
        <div className="mt-6 pt-6 border-t border-gray-100">
          <div className="flex items-center gap-2 text-gray-700 mb-2">
            <FileText size={20} className="text-gray-500 shrink-0" />
            <span className="font-medium">Bio</span>
          </div>
          <p className="text-gray-600 whitespace-pre-wrap">{profile.bio}</p>
        </div>
      )}

      <div className="mt-8">
        <Link
          to="/"
          className="inline-block text-primary-600 font-medium hover:underline"
        >
          Create your own QR profile
        </Link>
      </div>
    </div>
  );
}
