import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBuilding, faDroplet, faUtensils, faBowlRice, faChartBar, faHandHoldingHeart, faPersonCircleExclamation } from '@fortawesome/free-solid-svg-icons';

const StatisticsMoreTab = ({ alerts = [] }) => {
  const total = alerts.length;
  const donations = alerts.filter(a => a.type === 'donation').length;
  const emergencies = alerts.filter(a => a.type !== 'donation').length;
  const claimed = alerts.filter(a => a.type === 'donation' && a.claimed).length;
  const boosts = alerts.reduce((acc, a) => acc + (a.boosts || 0), 0);

  const needLabels = {
    water: 'Water',
    food: 'Food',
    medicine: 'Medicine',
    shelter: 'Shelter',
    clothing: 'Clothing',
    blankets: 'Blankets',
    transport: 'Transport'
  };

  const distribution = Object.keys(needLabels).reduce((acc, key) => ({ ...acc, [key]: 0 }), {});
  alerts
    .filter(a => a.type === 'donation' && a.needs)
    .forEach(a => {
      Object.entries(a.needs).forEach(([k, v]) => {
        if (v && distribution[k] !== undefined) distribution[k] += 1;
      });
    });
  const maxVal = Math.max(1, ...Object.values(distribution));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
          <div className="flex items-center gap-2 text-gray-700 mb-1">
            <FontAwesomeIcon icon={faChartBar} className="text-teal-600" />
            <span className="text-sm font-semibold">Total Requests</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{total}</p>
        </div>
        <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
          <div className="flex items-center gap-2 text-blue-700 mb-1">
            <FontAwesomeIcon icon={faHandHoldingHeart} />
            <span className="text-sm font-semibold">Donations</span>
          </div>
          <p className="text-2xl font-bold text-blue-900">{donations}</p>
        </div>
        <div className="p-4 bg-red-50 rounded-xl border border-red-200">
          <div className="flex items-center gap-2 text-red-700 mb-1">
            <FontAwesomeIcon icon={faPersonCircleExclamation} />
            <span className="text-sm font-semibold">Emergencies</span>
          </div>
          <p className="text-2xl font-bold text-red-900">{emergencies}</p>
        </div>
        <div className="p-4 bg-orange-50 rounded-xl border border-orange-200">
          <div className="flex items-center gap-2 text-orange-700 mb-1">
            <FontAwesomeIcon icon={faUtensils} />
            <span className="text-sm font-semibold">Claimed Donations</span>
          </div>
          <p className="text-2xl font-bold text-orange-900">{claimed}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <h3 className="text-base font-semibold text-gray-900 mb-4">Top Needs Distribution</h3>
        <div className="grid grid-cols-7 gap-3 items-end h-48">
          {Object.entries(distribution).map(([key, val]) => (
            <div key={key} className="flex flex-col items-center">
              <div
                className="w-8 rounded-t bg-green-500"
                style={{ height: `${Math.round((val / maxVal) * 160)}px` }}
                title={`${needLabels[key]}: ${val}`}
              />
              <span className="mt-2 text-[10px] text-gray-600">{needLabels[key]}</span>
              <span className="text-[10px] text-gray-500">{val}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatisticsMoreTab;
