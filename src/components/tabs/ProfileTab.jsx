import { FiUser, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

const ProfileTab = ({ user }) => {
  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-6 text-center">
        <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full mx-auto flex items-center justify-center text-white text-3xl font-bold mb-4">
          {user?.name?.charAt(0) || 'U'}
        </div>
        <h3 className="text-xl font-semibold text-gray-800">{user?.name || 'Guest User'}</h3>
        <p className="text-sm text-gray-600">Community Member</p>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <FiUser className="text-gray-600" size={20} />
          <div>
            <p className="text-xs text-gray-500">Full Name</p>
            <p className="font-medium">{user?.name || 'Not set'}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <FiMail className="text-gray-600" size={20} />
          <div>
            <p className="text-xs text-gray-500">Email</p>
            <p className="font-medium">{user?.email || 'Not set'}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <FiPhone className="text-gray-600" size={20} />
          <div>
            <p className="text-xs text-gray-500">Contact</p>
            <p className="font-medium">{user?.phone || 'Not set'}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <FiMapPin className="text-gray-600" size={20} />
          <div>
            <p className="text-xs text-gray-500">Location</p>
            <p className="font-medium">Cebu City, Philippines</p>
          </div>
        </div>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h4 className="font-semibold text-green-900 mb-2">Volunteer Status</h4>
        <p className="text-sm text-green-700">Active volunteer ready to help</p>
      </div>
    </div>
  );
};

export default ProfileTab;
