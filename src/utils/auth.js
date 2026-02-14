import { signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';
import { ref, set, get } from 'firebase/database';
import { auth, database } from '../config/firebase';

const googleProvider = new GoogleAuthProvider();

// Request additional scopes for user info
googleProvider.addScope('profile');
googleProvider.addScope('email');

// Admin email allowlist (comma-separated in env: VITE_ADMIN_EMAILS)
export const isAdminEmail = (email) => {
  const raw = import.meta.env.VITE_ADMIN_EMAILS || '';
  const list = raw.split(',').map(e => e.trim().toLowerCase()).filter(Boolean);
  if (list.length === 0) return false;
  return list.includes((email || '').toLowerCase());
};

// Save user data to database
const saveUserToDatabase = async (user) => {
  try {
    const userRef = ref(database, `users/${user.uid}`);
    
    // Check if user already exists
    const snapshot = await get(userRef);
    
    const userData = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      lastLogin: Date.now()
    };

    if (!snapshot.exists()) {
      // New user - save full profile
      userData.createdAt = Date.now();
      await set(userRef, userData);
      console.log('New user profile created');
    } else {
      // Existing user - update last login and profile info
      await set(userRef, {
        ...snapshot.val(),
        ...userData
      });
      console.log('User profile updated');
    }

    return { success: true, userData };
  } catch (error) {
    console.error('Error saving user to database:', error);
    return { success: false, error: error.message };
  }
};

// Sign in with Google
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    
    // Save user info to database
    await saveUserToDatabase(result.user);
    
    return {
      success: true,
      user: result.user
    };
  } catch (error) {
    console.error('Error signing in with Google:', error);
    
    // Handle specific error cases
    if (error.code === 'auth/popup-closed-by-user' || error.code === 'auth/cancelled-popup-request') {
      return {
        success: false,
        error: 'Sign-in cancelled',
        cancelled: true
      };
    } else if (error.code === 'auth/popup-blocked') {
      return {
        success: false,
        error: 'Pop-up blocked by browser. Please allow pop-ups for this site.'
      };
    } else if (error.code === 'auth/network-request-failed' || error.code === 'auth/internal-error') {
      return {
        success: false,
        error: 'Service unavailable. Please try again later.'
      };
    }
    
    return {
      success: false,
      error: error.message
    };
  }
};

export const signInWithEmailPassword = async (email, password) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    await saveUserToDatabase(result.user);
    return { success: true, user: result.user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Sign out
export const signOutUser = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    console.error('Error signing out:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Listen to auth state changes
export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};

// Get current user
export const getCurrentUser = () => {
  return auth.currentUser;
};

// Get user data from database
export const getUserData = async (uid) => {
  try {
    const userRef = ref(database, `users/${uid}`);
    const snapshot = await get(userRef);
    
    if (snapshot.exists()) {
      return { success: true, data: snapshot.val() };
    } else {
      return { success: false, error: 'User not found' };
    }
  } catch (error) {
    console.error('Error getting user data:', error);
    return { success: false, error: error.message };
  }
};

// Update user profile
export const updateUserProfile = async (uid, updates) => {
  try {
    const userRef = ref(database, `users/${uid}`);
    const snapshot = await get(userRef);
    
    if (snapshot.exists()) {
      await set(userRef, {
        ...snapshot.val(),
        ...updates,
        updatedAt: Date.now()
      });
      return { success: true };
    } else {
      return { success: false, error: 'User not found' };
    }
  } catch (error) {
    console.error('Error updating user profile:', error);
    return { success: false, error: error.message };
  }
};

