import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartBar, faHandHoldingHeart, faPersonCircleExclamation } from '@fortawesome/free-solid-svg-icons';

const StatisticsTab = ({ alerts = [], onViewMore }) => {
  const total = alerts.length;
  const donations = alerts.filter(a => a.type === 'donation').length;
  const emergencies = alerts.filter(a => a.type !== 'donation').length;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
          <div className="flex items-center gap-2 mb-1 text-gray-800 min-w-0">
            <FontAwesomeIcon icon={faChartBar} className="text-teal-600" />
            <span className="text-sm font-semibold truncate">Total</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{total}</p>
          <p className="text-xs text-gray-500">All requests</p>
        </div>
        <div className="p-4 bg-blue-50 rounded-xl border border-blue-200 overflow-hidden">
          <div className="flex items-center gap-2 mb-1 text-gray-800 min-w-0">
            <FontAwesomeIcon icon={faHandHoldingHeart} className="text-blue-600" />
            <span className="text-sm font-semibold truncate">Donations</span>
          </div>
          <p className="text-2xl font-bold text-blue-900">{donations}</p>
          <p className="text-xs text-blue-600">Donation requests</p>
        </div>
        <div className="p-4 bg-red-50 rounded-xl border border-red-200 overflow-hidden">
          <div className="flex items-center gap-2 mb-1 text-gray-800 min-w-0">
            <FontAwesomeIcon icon={faPersonCircleExclamation} className="text-red-600" />
            <span className="text-sm font-semibold truncate">Emergencies</span>
          </div>
          <p className="text-2xl font-bold text-red-900">{emergencies}</p>
          <p className="text-xs text-red-600">Emergency alerts</p>
        </div>
      </div>
      <button
        type="button"
        onClick={onViewMore}
        className="w-full bg-gray-900 text-white py-2.5 rounded-lg font-medium text-sm hover:bg-black transition-colors"
      >
        See More
      </button>
    </div>
  );
};

export default StatisticsTab;
