import { useState } from 'react';
import { ref, push, set } from 'firebase/database';
import { database } from '../../config/firebase';
import { FiMapPin, FiAlertTriangle } from 'react-icons/fi';

const HelpRequestTab = () => {
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    address: '',
    description: '',
    type: 'emergency'
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
          const alertRef = ref(database, 'alerts');
          const newAlertRef = push(alertRef);
          
          await set(newAlertRef, {
            ...formData,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            timestamp: Date.now(),
            status: 'active'
          });

          alert('Help request sent successfully!');
          setFormData({ name: '', contact: '', address: '', description: '', type: 'emergency' });
        });
      }
    } catch (error) {
      console.error('Error sending help request:', error);
      alert('Failed to send help request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
        <FiAlertTriangle className="text-red-600 mt-1" size={20} />
        <div>
          <h3 className="font-semibold text-red-900">Emergency Alert</h3>
          <p className="text-sm text-red-700">Request immediate help from nearby volunteers</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Juan Dela Cruz"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
          <input
            type="tel"
            required
            value={formData.contact}
            onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="+63 912 345 6789"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
          <input
            type="text"
            required
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Barangay, Street"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Type</label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="emergency">Emergency</option>
            <option value="medical">Medical</option>
            <option value="rescue">Rescue</option>
            <option value="shelter">Shelter Needed</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            required
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Describe your situation..."
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <FiMapPin />
          {loading ? 'Sending...' : 'Send Help Request'}
        </button>
      </form>
    </div>
  );
};

export default HelpRequestTab;
