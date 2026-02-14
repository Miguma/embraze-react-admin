import { useState } from 'react';
import { ref, push, set } from 'firebase/database';
import { database } from '../../config/firebase';
import { FiPackage, FiDroplet, FiShoppingBag } from 'react-icons/fi';

const DonationsTab = () => {
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    address: '',
    needs: {
      food: false,
      water: false,
      blankets: false,
      medicine: false,
      clothing: false
    },
    familySize: 1,
    specificNeeds: '',
    urgency: 'medium'
  });
  const [loading, setLoading] = useState(false);

  const handleNeedToggle = (need) => {
    setFormData({
      ...formData,
      needs: { ...formData.needs, [need]: !formData.needs[need] }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
          const donationRef = ref(database, 'alerts');
          const newDonationRef = push(donationRef);
          
          await set(newDonationRef, {
            ...formData,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            timestamp: Date.now(),
            type: 'donation',
            status: 'active'
          });

          alert('Donation request posted successfully!');
          setFormData({
            name: '',
            contact: '',
            address: '',
            needs: { food: false, water: false, blankets: false, medicine: false, clothing: false },
            familySize: 1,
            specificNeeds: '',
            urgency: 'medium'
          });
        });
      }
    } catch (error) {
      console.error('Error posting donation request:', error);
      alert('Failed to post donation request');
    } finally {
      setLoading(false);
    }
  };

  const needsOptions = [
    { id: 'food', label: 'Food', icon: FiShoppingBag },
    { id: 'water', label: 'Water', icon: FiDroplet },
    { id: 'blankets', label: 'Blankets', icon: FiPackage },
    { id: 'medicine', label: 'Medicine', icon: FiPackage },
    { id: 'clothing', label: 'Clothing', icon: FiPackage }
  ];

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-1">Request Donations</h3>
        <p className="text-sm text-blue-700">Let the community know what you need</p>
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
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">What do you need?</label>
          <div className="grid grid-cols-2 gap-2">
            {needsOptions.map((need) => (
              <button
                key={need.id}
                type="button"
                onClick={() => handleNeedToggle(need.id)}
                className={`p-3 rounded-lg border-2 transition-all flex items-center gap-2 ${
                  formData.needs[need.id]
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <need.icon size={18} />
                <span className="text-sm font-medium">{need.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Family Size</label>
          <input
            type="number"
            min="1"
            value={formData.familySize}
            onChange={(e) => setFormData({ ...formData, familySize: parseInt(e.target.value) })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Urgency Level</label>
          <select
            value={formData.urgency}
            onChange={(e) => setFormData({ ...formData, urgency: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="low">Low - Can wait a few days</option>
            <option value="medium">Medium - Needed soon</option>
            <option value="high">High - Urgent</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Specific Needs (Optional)</label>
          <textarea
            value={formData.specificNeeds}
            onChange={(e) => setFormData({ ...formData, specificNeeds: e.target.value })}
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Any specific requirements..."
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {loading ? 'Posting...' : 'Post Donation Request'}
        </button>
      </form>
    </div>
  );
};

export default DonationsTab;
