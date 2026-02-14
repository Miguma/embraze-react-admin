import { useEffect, useState, useRef } from 'react';
import { Map, Marker, Popup } from 'react-map-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { ref, onValue } from 'firebase/database';
import { database } from '../config/firebase';
import { CEBU_CITY_CENTER } from '../config/mapbox';

const MapView = ({ onMarkerClick }) => {
  const [alerts, setAlerts] = useState({});
  const [error, setError] = useState(null);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [viewState, setViewState] = useState({
    longitude: CEBU_CITY_CENTER.longitude,
    latitude: CEBU_CITY_CENTER.latitude,
    zoom: CEBU_CITY_CENTER.zoom,
    pitch: 60, // Camera tilt angle (0-85 degrees)
    bearing: 0
  });

  useEffect(() => {
    try {
      const alertsRef = ref(database, 'alerts');
      onValue(alertsRef, (snapshot) => {
        const data = snapshot.val();
        setAlerts(data || {});
      }, (error) => {
        console.error('Firebase error:', error);
        if (error.code === 'PERMISSION_DENIED') {
          setError('Firebase permission denied. Please update database rules.');
        }
      });
    } catch (err) {
      console.error('Firebase initialization error:', err);
      setError('Failed to connect to database.');
    }
  }, []);

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Map Error</h3>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <Map
        {...viewState}
        onMove={evt => setViewState(evt.viewState)}
        mapLib={import('maplibre-gl')}
        mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
        style={{ width: '100%', height: '100%' }}
      >
        {/* Markers */}
        {Object.entries(alerts).map(([id, alert]) => (
          <Marker
            key={id}
            longitude={alert.longitude}
            latitude={alert.latitude}
            anchor="bottom"
            onClick={(e) => {
              e.originalEvent.stopPropagation();
              setSelectedAlert({ id, ...alert });
              onMarkerClick({ id, ...alert });
            }}
          >
            <div
              style={{
                width: '30px',
                height: '30px',
                background: alert.type === 'emergency' ? '#ef4444' : '#3b82f6',
                border: '3px solid white',
                borderRadius: '50%',
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                cursor: 'pointer'
              }}
            />
          </Marker>
        ))}

        {/* Popup */}
        {selectedAlert && (
          <Popup
            longitude={selectedAlert.longitude}
            latitude={selectedAlert.latitude}
            anchor="top"
            onClose={() => setSelectedAlert(null)}
            closeButton={true}
            closeOnClick={false}
          >
            <div className="text-sm p-2">
              <p className="font-bold">{selectedAlert.name}</p>
              <p className="text-gray-600">{selectedAlert.address}</p>
              <p className="text-xs text-gray-500 mt-1">
                {selectedAlert.type === 'emergency' ? '🚨 Emergency' : 'ℹ️ Help Request'}
              </p>
            </div>
          </Popup>
        )}
      </Map>
    </div>
  );
};

export default MapView;
