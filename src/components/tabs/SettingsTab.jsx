import { FiBell, FiMapPin, FiShield, FiInfo } from 'react-icons/fi';

const SettingsTab = () => {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-semibold text-gray-800 mb-3">Notifications</h3>
        <div className="space-y-2">
          <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer">
            <div className="flex items-center gap-3">
              <FiBell className="text-gray-600" />
              <span className="text-sm">Emergency Alerts</span>
            </div>
            <input type="checkbox" defaultChecked className="w-5 h-5" />
          </label>
          
          <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer">
            <div className="flex items-center gap-3">
              <FiBell className="text-gray-600" />
              <span className="text-sm">Donation Requests</span>
            </div>
            <input type="checkbox" defaultChecked className="w-5 h-5" />
          </label>
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-gray-800 mb-3">Location</h3>
        <div className="space-y-2">
          <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer">
            <div className="flex items-center gap-3">
              <FiMapPin className="text-gray-600" />
              <span className="text-sm">Share Location</span>
            </div>
            <input type="checkbox" defaultChecked className="w-5 h-5" />
          </label>
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-gray-800 mb-3">Privacy</h3>
        <div className="space-y-2">
          <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer">
            <div className="flex items-center gap-3">
              <FiShield className="text-gray-600" />
              <span className="text-sm">Show Profile Publicly</span>
            </div>
            <input type="checkbox" defaultChecked className="w-5 h-5" />
          </label>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <FiInfo className="text-blue-600 mt-1" />
          <div>
            <h4 className="font-semibold text-blue-900 mb-1">About EmBraze</h4>
            <p className="text-sm text-blue-700">Community Crisis Support Platform for Cebu City</p>
            <p className="text-xs text-blue-600 mt-2">Version 1.0.0</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsTab;
