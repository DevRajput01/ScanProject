import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, MapPin, Phone, MessageCircle, FileText } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

export default function UserForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '',
    location: '',
    phone: '',
    whatsapp: '',
    bio: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.name.trim()) {
      setError('Name is required.');
      return;
    }
    setLoading(true);
    try {
      const url = API_BASE.startsWith('http') ? `${API_BASE}/profiles` : '/api/profiles';
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || 'Failed to create profile.');
        return;
      }
      if (data.id) navigate(`/qr/${data.id}`);
      else setError('Invalid response from server.');
    } catch (err) {
      setError('Network error. Is the backend running on port 5000?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Create your QR profile</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-card p-6 sm:p-8 space-y-5"
      >
        {error && (
          <div className="rounded-xl bg-red-50 text-red-700 px-4 py-3 text-sm">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Name <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              id="name"
              name="name"
              type="text"
              required
              value={form.name}
              onChange={handleChange}
              placeholder="Your name"
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500"
            />
          </div>
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
            Location
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              id="location"
              name="location"
              type="text"
              value={form.location}
              onChange={handleChange}
              placeholder="City or address"
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500"
            />
          </div>
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Phone
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              id="phone"
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange}
              placeholder="+1 234 567 8900"
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500"
            />
          </div>
        </div>

        <div>
          <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-700 mb-1">
            WhatsApp
          </label>
          <div className="relative">
            <MessageCircle className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              id="whatsapp"
              name="whatsapp"
              type="text"
              value={form.whatsapp}
              onChange={handleChange}
              placeholder="Number with country code"
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500"
            />
          </div>
        </div>

        <div>
          <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
            Bio
          </label>
          <div className="relative">
            <FileText className="absolute left-3 top-4 text-gray-400" size={18} />
            <textarea
              id="bio"
              name="bio"
              rows={4}
              value={form.bio}
              onChange={handleChange}
              placeholder="Short bio or description"
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 resize-none"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-medium disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Creating...' : 'Create profile & get QR code'}
        </button>
      </form>
    </div>
  );
}
