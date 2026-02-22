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
    
    // Declare url variable outside try block
    let url;
    
    try {
      // Construct the URL correctly
      url = API_BASE.startsWith('http') 
        ? `${API_BASE}/api/profiles` 
        : '/api/profiles';
      
      console.log('=== REQUEST DETAILS ===');
      console.log('API_BASE:', API_BASE);
      console.log('Full URL:', url);
      console.log('Form data:', form);
      
      const res = await fetch(url, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });
      
      console.log('Response status:', res.status);
      console.log('Response headers:', Object.fromEntries(res.headers.entries()));
      
      // Try to parse the response
      let data;
      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await res.json();
      } else {
        const text = await res.text();
        console.log('Non-JSON response:', text);
        throw new Error('Server returned non-JSON response');
      }
      
      console.log('Response data:', data);
      
      if (!res.ok) {
        setError(data.error || `Server error: ${res.status}`);
        return;
      }
      
      if (data.id) {
        console.log('✅ Success! Profile created:');
        console.log('Profile ID:', data.id);
        console.log('Owner Token:', data.owner_token);
        console.log('Redirecting to:', `/qr/${data.id}`);
        
        // Store owner token in localStorage if you need it later
        if (data.owner_token) {
          localStorage.setItem(`profile_${data.id}_token`, data.owner_token);
        }
        
        // Navigate to QR page
        navigate(`/qr/${data.id}`);
      } else {
        console.error('Invalid response format - missing id:', data);
        setError('Invalid response from server.');
      }
      
    } catch (err) {
      console.error('=== NETWORK ERROR DETAILS ===');
      console.error('Error object:', err);
      console.error('Error message:', err.message);
      console.error('Error name:', err.name);
      console.error('API_BASE:', API_BASE);
      console.error('URL attempted:', url);
      console.error('Request method: POST');
      console.error('Request headers:', { 'Content-Type': 'application/json' });
      console.error('Request body:', JSON.stringify(form));
      console.error('Browser URL:', window.location.href);
      console.error('CORS Error? Check if backend allows origin:', window.location.origin);
      
      // User-friendly error message
      if (err.message.includes('Failed to fetch')) {
        setError(`Cannot connect to backend. Please verify:
         • Backend URL: ${API_BASE}
         • Backend is running
         • CORS is configured properly`);
      } else {
        setError(`Network error: ${err.message}. Check console for details.`);
      }
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
          <div className="rounded-xl bg-red-50 text-red-700 px-4 py-3 text-sm whitespace-pre-line">
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
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
              disabled={loading}
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
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
              disabled={loading}
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
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
              disabled={loading}
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
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
              disabled={loading}
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
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 resize-none"
              disabled={loading}
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
