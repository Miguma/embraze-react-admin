import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { ref, onValue } from 'firebase/database';
import { database } from '../config/firebase';
import StatisticsMoreTab from './tabs/StatisticsMoreTab';

function MorePage({ onClose, userLocation }) {
  const [alerts, setAlerts] = useState({});

  useEffect(() => {
    try {
      const alertsRef = ref(database, 'alerts');
      const unsub = onValue(alertsRef, (snapshot) => {
        setAlerts(snapshot.val() || {});
      });
      return () => unsub();
    } catch (err) {
      console.error('Firebase error:', err);
    }
  }, []);

  const alertsArray = Object.entries(alerts).map(([id, a]) => ({ id, ...a }));
  const donationAlerts = alertsArray.filter(a => a.type === 'donation');

  const cityCenters = {
    'Cebu City': { lat: 10.3157, lng: 123.8854 },
    'Mandaue City': { lat: 10.329, lng: 123.943 },
    'Lapu-Lapu City': { lat: 10.3103, lng: 123.949 },
    'Talisay City': { lat: 10.292, lng: 123.86 },
    'Consolacion': { lat: 10.376, lng: 123.958 },
    'Liloan': { lat: 10.396, lng: 123.993 },
    'Cordova': { lat: 10.251, lng: 123.948 },
    'Naga City': { lat: 10.208, lng: 123.757 },
    'Minglanilla': { lat: 10.244, lng: 123.796 }
  };

  const haversine = (lat1, lon1, lat2, lon2) => {
    const toRad = v => (v * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const getCity = (a) => {
    const addr = (a.address || '').toLowerCase();
    if (addr.includes('cebu city')) return 'Cebu City';
    if (addr.includes('mandaue')) return 'Mandaue City';
    if (addr.includes('talisay')) return 'Talisay City';
    if (addr.includes('lapu-lapu') || addr.includes('lapulapu') || addr.includes('mactan')) return 'Lapu-Lapu City';
    if (addr.includes('consolacion')) return 'Consolacion';
    if (addr.includes('liloan')) return 'Liloan';
    if (addr.includes('cordova')) return 'Cordova';
    if (addr.includes('naga city')) return 'Naga City';
    if (addr.includes('minglanilla')) return 'Minglanilla';
    if (a.latitude != null && a.longitude != null) {
      let best = null;
      let bestDist = Infinity;
      Object.entries(cityCenters).forEach(([name, c]) => {
        const d = haversine(a.latitude, a.longitude, c.lat, c.lng);
        if (d < bestDist) {
          bestDist = d;
          best = name;
        }
      });
      if (bestDist <= 20) return best;
    }
    return null;
  };

  const cityNames = Array.from(
    new Set(
      donationAlerts
        .map(a => getCity(a))
        .filter(Boolean)
    )
  );
  const cityData = cityNames.map(city => {
    const list = donationAlerts
      .filter(a => getCity(a) === city)
      .sort((a,b) => (b.claimedAt || b.timestamp || 0) - (a.claimedAt || a.timestamp || 0));
    const latestDonors = list
      .filter(a => a.claimedBy || a.name)
      .slice(0, 5)
      .map(a => a.claimedBy || a.name || 'Anonymous');
    return { city, total: list.length, donors: latestDonors };
  });
  const orderedCities = (() => {
    if (!userLocation) return cityNames.sort();
    return cityNames
      .map(name => ({
        name,
        dist: haversine(
          userLocation.latitude,
          userLocation.longitude,
          cityCenters[name]?.lat ?? 0,
          cityCenters[name]?.lng ?? 0
        )
      }))
      .sort((a,b) => a.dist - b.dist)
      .map(d => d.name);
  })();

  return (
    <div className="fixed inset-0 z-[1000] bg-gray-100">
      <div className="max-w-6xl mx-auto h-full flex flex-col">
        <div className="px-6 py-4 border-b bg-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-lg hover:bg-gray-100 flex items-center justify-center"
            >
              <FontAwesomeIcon icon={faChevronLeft} />
            </button>
            <h1 className="text-xl font-semibold text-gray-900">Overall Statistics</h1>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <StatisticsMoreTab alerts={alertsArray} />

          <div className="mt-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">City Donations</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {orderedCities.map(cityName => {
                const data = cityData.find(c => c.city === cityName) || { city: cityName, total: 0, donors: [] };
                const { city, total, donors } = data;
                return (
                <div key={city} className="p-4 bg-white rounded-xl border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-900">{city}</span>
                    <span className="text-xs text-gray-500">Total Donations</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-900">{total}</p>
                  <div className="mt-3">
                    <p className="text-xs font-semibold text-gray-700 mb-1">Latest Donors</p>
                    {donors.length === 0 ? (
                      <p className="text-xs text-gray-500">No donors yet</p>
                    ) : (
                      <ul className="space-y-1">
                        {donors.map((name, idx) => (
                          <li key={idx} className="text-xs text-gray-700">{name}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MorePage;
