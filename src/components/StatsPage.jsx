import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { ref, onValue } from 'firebase/database';
import { database } from '../config/firebase';
// Blank page (non-stats) as requested

function StatsPage({ onClose }) {
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

  const alertsArray = Object.entries(alerts).map(([id, alert]) => ({ id, ...alert }));

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
            <h1 className="text-xl font-semibold text-gray-900">Page</h1>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">This is a new page</h2>
              <p className="text-sm text-gray-700">You can place any content here. The See More button simply navigates to this page.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StatsPage;
