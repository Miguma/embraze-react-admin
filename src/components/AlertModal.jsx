import { motion } from 'framer-motion';
import { FiX, FiMapPin, FiPhone, FiUser, FiClock, FiPackage } from 'react-icons/fi';

const AlertModal = ({ alert, onClose }) => {
  if (!alert) return null;

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`p-6 text-white ${
          alert.type === 'emergency' ? 'bg-gradient-to-r from-red-500 to-pink-500' : 
          'bg-gradient-to-r from-blue-500 to-cyan-500'
        }`}>
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-2xl font-bold mb-1">
                {alert.type === 'donation' ? 'Donation Request' : 'Emergency Alert'}
              </h3>
              <p className="text-sm opacity-90">Active Request</p>
            </div>
            <button
              onClick={onClose}
              className="bg-white bg-opacity-20 p-2 rounded-full hover:bg-opacity-30 transition-all"
            >
              <FiX size={20} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <FiUser className="text-gray-600" size={20} />
            <div>
              <p className="text-xs text-gray-500">Name</p>
              <p className="font-semibold">{alert.name}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <FiPhone className="text-gray-600" size={20} />
            <div>
              <p className="text-xs text-gray-500">Contact</p>
              <p className="font-semibold">{alert.contact}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <FiMapPin className="text-gray-600" size={20} />
            <div>
              <p className="text-xs text-gray-500">Address</p>
              <p className="font-semibold">{alert.address}</p>
            </div>
          </div>

          {alert.type === 'donation' && alert.needs && (
            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <FiPackage className="text-blue-600" size={20} />
                <p className="font-semibold text-blue-900">Needs</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {Object.entries(alert.needs).map(([key, value]) => 
                  value && (
                    <span key={key} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </span>
                  )
                )}
              </div>
              {alert.familySize && (
                <p className="text-sm text-blue-700 mt-2">Family size: {alert.familySize} people</p>
              )}
            </div>
          )}

          {alert.description && (
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-700">{alert.description}</p>
            </div>
          )}

          {alert.specificNeeds && (
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500 mb-1">Specific Needs</p>
              <p className="text-sm text-gray-700">{alert.specificNeeds}</p>
            </div>
          )}

          <div className="flex items-center gap-2 text-sm text-gray-500">
            <FiClock size={16} />
            <span>{formatTime(alert.timestamp)}</span>
          </div>

          <div className="flex gap-3">
            <button className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors">
              Offer Help
            </button>
            <button className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
              Contact
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AlertModal;
