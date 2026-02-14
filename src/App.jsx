import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import Map from './components/Map';
import AlertsPanel from './components/AlertsPanel';
import AlertModal from './components/AlertModal';
import NavigationPanel from './components/NavigationPanel';
import LoadingScreen from './components/LoadingScreen';
import AuthBanner from './components/AuthBanner';
import LoginScreen from './components/LoginScreen';
import WelcomeModal from './components/WelcomeModal';
import MorePage from './components/MorePage';
import { getRoute } from './utils/routing';
import { signInWithEmailPassword, signInWithGoogle, signOutUser, onAuthChange, isAdminEmail } from './utils/auth';

function App() {
  const ADMIN_BYPASS = !(import.meta.env.VITE_ADMIN_BYPASS === 'false' || import.meta.env.VITE_ADMIN_BYPASS === '0');
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [showAuthBanner, setShowAuthBanner] = useState(true);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [flyToLocation, setFlyToLocation] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [navigationRoute, setNavigationRoute] = useState(null);
  const [navigationDestination, setNavigationDestination] = useState(null);
  const [loadingRoute, setLoadingRoute] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [showMorePage, setShowMorePage] = useState(false);

  // Simple hash-based routing for the stats page
  useEffect(() => {
    const syncFromHash = () => {
      const h = window.location.hash || '';
      setShowMorePage(h.includes('more'));
    };
    syncFromHash();
    window.addEventListener('hashchange', syncFromHash);
    return () => window.removeEventListener('hashchange', syncFromHash);
  }, []);

  // Track window resize for mobile detection
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Initialize app and listen to auth state
  useEffect(() => {
    const initializeApp = async () => {
      // Simulate loading time for smooth animation
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsLoading(false);
    };
    let unsubscribe = () => {};
    if (!ADMIN_BYPASS) {
      unsubscribe = onAuthChange((user) => {
        if (user) {
          if (isAdminEmail(user.email)) {
            setIsLoggedIn(true);
            setCurrentUser(user);
            setShowAuthBanner(false);
            const onboardingComplete = localStorage.getItem('embraze_onboarding_complete');
            if (!onboardingComplete) {
              setShowWelcomeModal(true);
            }
          } else {
            alert('Admin access only');
            signOutUser();
            setIsLoggedIn(false);
            setCurrentUser(null);
            setShowAuthBanner(true);
          }
        } else {
          setIsLoggedIn(false);
          setCurrentUser(null);
          setShowAuthBanner(true);
        }
      });
    } else {
      const stored = localStorage.getItem('embraze_admin_bypass_user');
      const mockUser = stored ? JSON.parse(stored) : {
        uid: 'dev-admin',
        email: 'dev@admin.local',
        displayName: 'Dev Admin',
        photoURL: null
      };
      localStorage.setItem('embraze_admin_bypass_user', JSON.stringify(mockUser));
      setIsLoggedIn(true);
      setCurrentUser(mockUser);
      setShowAuthBanner(false);
    }

    initializeApp();

    return () => unsubscribe();
  }, []);

  const handleLogin = async (email, password) => {
    if (ADMIN_BYPASS) {
      const mockUser = {
        uid: 'dev-admin',
        email: email || 'dev@admin.local',
        displayName: 'Dev Admin',
        photoURL: null
      };
      localStorage.setItem('embraze_admin_bypass_user', JSON.stringify(mockUser));
      setIsLoggedIn(true);
      setCurrentUser(mockUser);
      setShowAuthBanner(false);
      return { success: true, user: mockUser };
    } else {
      if (!isAdminEmail(email)) {
        return { success: false, error: 'Not an admin email' };
      }
      const result = await signInWithEmailPassword(email, password);
      if (result.success) {
        console.log('Signed in successfully:', result.user);
      }
      return result;
    }
  };

  const handleLoginGoogle = async () => {
    if (ADMIN_BYPASS) {
      const mockUser = {
        uid: 'dev-admin',
        email: 'dev@admin.local',
        displayName: 'Dev Admin',
        photoURL: null
      };
      localStorage.setItem('embraze_admin_bypass_user', JSON.stringify(mockUser));
      setIsLoggedIn(true);
      setCurrentUser(mockUser);
      setShowAuthBanner(false);
      return { success: true, user: mockUser };
    } else {
      const result = await signInWithGoogle();
      return result;
    }
  };

  const handleWelcomeComplete = (displayName) => {
    setShowWelcomeModal(false);
    localStorage.setItem('embraze_onboarding_complete', 'true');
    console.log('User display name set:', displayName);
  };

  const handleLogout = async () => {
    setIsSigningOut(true);
    const result = await signOutUser();
    
    if (result.success) {
      // Auth state change listener will handle the rest
      console.log('Signed out successfully');
      // Keep showing signing out screen for animation to complete
      setTimeout(() => {
        setIsSigningOut(false);
      }, 2500);
    } else {
      alert('Failed to sign out: ' + result.error);
      setIsSigningOut(false);
    }
  };

  const handleDismissBanner = () => {
    setShowAuthBanner(false);
  };

  // Get user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            longitude: position.coords.longitude,
            latitude: position.coords.latitude
          });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );

      // Watch position for real-time updates
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          setUserLocation({
            longitude: position.coords.longitude,
            latitude: position.coords.latitude
          });
        },
        (error) => {
          console.error('Error watching location:', error);
        },
        {
          enableHighAccuracy: true,
          maximumAge: 10000,
          timeout: 5000
        }
      );

      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, []);

  const handleAlertClick = (alert) => {
    setSelectedAlert(alert);
    setFlyToLocation({ longitude: alert.longitude, latitude: alert.latitude });
  };

  const handleGetDirections = async (alertData) => {
    if (!userLocation) {
      window.alert('Please enable location services to get directions');
      return;
    }

    setLoadingRoute(true);
    try {
      const route = await getRoute(
        userLocation.longitude,
        userLocation.latitude,
        alertData.longitude,
        alertData.latitude
      );
      
      setNavigationRoute(route);
      setNavigationDestination({
        name: alertData.name || 'Emergency Location',
        address: alertData.address
      });
      setSelectedAlert(null); // Close alert modal
    } catch (error) {
      console.error('Failed to get route:', error);
      window.alert('Failed to calculate route. Please try again.');
    } finally {
      setLoadingRoute(false);
    }
  };

  const handleCloseNavigation = () => {
    setNavigationRoute(null);
    setNavigationDestination(null);
  };

  return (
    <>
      {isLoading ? (
        <LoadingScreen key="loading" />
      ) : isSigningOut ? (
        <LoadingScreen key="signing-out" message="Signing out..." />
      ) : (
        <div className="h-screen w-screen overflow-hidden bg-gray-100 relative">
          {/* Auth Banner - Shows at top when not logged in */}
          <AnimatePresence>
            {!isLoggedIn && showAuthBanner && (
              <AuthBanner onLogin={handleLogin} onDismiss={handleDismissBanner} />
            )}
          </AnimatePresence>

          {/* Map Layer - Always visible as background */}
          <div className="absolute inset-0 z-0">
            <Map 
              onMarkerClick={setSelectedAlert} 
              flyToLocation={flyToLocation}
              route={navigationRoute}
              userLocation={navigationRoute ? userLocation : null}
            />
          </div>

          {/* Emergency Button removed for admin panel */}
          
          {/* Alerts Panel - Right side (limited for non-authenticated) */}
          <AlertsPanel 
            onAlertClick={handleAlertClick} 
            onLogout={handleLogout}
            onLogin={handleLogin}
            isLoggedIn={isLoggedIn}
            currentUser={currentUser}
            onExpandChange={(expanded) => {
              // Track panel expansion state for responsive layout
              document.documentElement.style.setProperty('--panel-expanded', expanded ? '1' : '0');
            }}
            onHistoryChange={setIsHistoryOpen}
            onViewMoreStats={() => {
              window.location.hash = '#/more';
              if (!window.location.hash.includes('more')) {
                window.location.hash = '#more';
              }
              setShowMorePage(true);
            }}
          />
          
          {/* Navigation Panel - Only for authenticated users */}
          {isLoggedIn && navigationRoute && (
            <NavigationPanel
              route={navigationRoute}
              destination={navigationDestination}
              onClose={handleCloseNavigation}
            />
          )}
          
          {/* Alert Modal - Top layer */}
          <AnimatePresence>
            {selectedAlert && (
              <AlertModal 
                alert={selectedAlert} 
                onClose={() => setSelectedAlert(null)}
                onGetDirections={isLoggedIn ? handleGetDirections : undefined}
                isLoggedIn={isLoggedIn}
                currentUser={currentUser}
              />
            )}
          </AnimatePresence>

          {/* Loading indicator for route calculation */}
          {loadingRoute && (
            <div className="absolute inset-0 z-50 bg-black/30 flex items-center justify-center">
              <div className="bg-white rounded-xl shadow-2xl p-6 flex items-center gap-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-500"></div>
                <p className="text-sm font-medium text-gray-700">Calculating route...</p>
              </div>
            </div>
          )}

          {/* Welcome Modal - For first-time users */}
          {showWelcomeModal && (
            <WelcomeModal onComplete={handleWelcomeComplete} />
          )}

          {/* Full-screen Overall Statistics */}
          {showMorePage && (
            <MorePage 
              userLocation={userLocation}
              onClose={() => {
              window.location.hash = '';
              setShowMorePage(false);
            }} 
            />
          )}

          {/* Admin Login Modal - blocks interaction until admin signs in */}
          <AnimatePresence>
            {!isLoggedIn && (
              <LoginScreen onLogin={handleLogin} onLoginGoogle={handleLoginGoogle} />
            )}
          </AnimatePresence>
        </div>
      )}
    </>
  );
}

export default App;
