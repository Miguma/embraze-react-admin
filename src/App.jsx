import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import Map from './components/Map';
import SidePanel from './components/SidePanel';
import AlertModal from './components/AlertModal';

function App() {
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [user] = useState({
    name: 'Juan Dela Cruz',
    email: 'juan@example.com',
    phone: '+63 912 345 6789'
  });

  return (
    <div className="h-screen w-screen overflow-hidden bg-gray-100 relative">
      {/* Map Layer - Base layer */}
      <div className="absolute inset-0 z-0">
        <Map onMarkerClick={setSelectedAlert} />
      </div>
      
      {/* Side Panel - Above map */}
      <div className="absolute inset-0 pointer-events-none z-30">
        <div className="pointer-events-auto">
          <SidePanel user={user} />
        </div>
      </div>
      
      {/* Alert Modal - Top layer */}
      <AnimatePresence>
        {selectedAlert && (
          <AlertModal 
            alert={selectedAlert} 
            onClose={() => setSelectedAlert(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
