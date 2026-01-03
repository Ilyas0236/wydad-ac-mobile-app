// src/context/AuthContext.js
import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  sendPasswordResetEmail,
  updateEmail,
  updatePassword,
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, COLLECTIONS } from '../services/firebase';

// ============================================
// CREATE CONTEXT
// ============================================
const AuthContext = createContext();

// ============================================
// AUTH PROVIDER
// ============================================
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ============================================
  // INITIALIZE AUTH STATE
  // ============================================
  useEffect(() => {
    console.log('🔄 Initializing Auth listener...');
    
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          console.log('✅ User authenticated:', firebaseUser.email);
          
          // Get additional user data from Firestore
          const userDoc = await getUserData(firebaseUser.uid);
          
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
            ...userDoc, // Merge Firestore data
          });
        } else {
          console.log('⚠️ No user authenticated');
          setUser(null);
        }
      } catch (err) {
        console.error('❌ Error in auth state change:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    });

    return () => {
      console.log('🔌 Unsubscribing Auth listener');
      unsubscribe();
    };
  }, []);

  // ============================================
  // GET USER DATA FROM FIRESTORE
  // ============================================
  const getUserData = async (userId) => {
    try {
      const userRef = doc(db, COLLECTIONS.USERS, userId);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        return userSnap.data();
      }
      return null;
    } catch (err) {
      console.error('❌ Error fetching user data:', err);
      return null;
    }
  };

  // ============================================
  // REGISTER
  // ============================================
  const register = useCallback(async (email, password, displayName) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 Creating user account...');
      
      // Create Firebase Auth user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Update profile with display name
      await updateProfile(user, { displayName });
      
      // Create user document in Firestore
      const userRef = doc(db, COLLECTIONS.USERS, user.uid);
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        displayName: displayName,
        photoURL: null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      
      console.log('✅ User registered successfully:', email);
      
      return { success: true, user };
    } catch (err) {
      console.error('❌ Registration error:', err);
      
      let errorMessage = 'Erreur lors de l\'inscription';
      
      switch (err.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'Cet email est déjà utilisé';
          break;
        case 'auth/weak-password':
          errorMessage = 'Le mot de passe doit contenir au moins 6 caractères';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Email invalide';
          break;
        default:
          errorMessage = err.message;
      }
      
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  // ============================================
  // LOGIN
  // ============================================
  const login = useCallback(async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 Logging in user...');
      
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Update last login timestamp
      const userRef = doc(db, COLLECTIONS.USERS, userCredential.user.uid);
      await updateDoc(userRef, {
        lastLogin: serverTimestamp(),
      });
      
      console.log('✅ User logged in successfully:', email);
      
      return { success: true, user: userCredential.user };
    } catch (err) {
      console.error('❌ Login error:', err);
      
      let errorMessage = 'Erreur lors de la connexion';
      
      switch (err.code) {
        case 'auth/user-not-found':
          errorMessage = 'Aucun compte trouvé avec cet email';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Mot de passe incorrect';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Email invalide';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Trop de tentatives. Réessayez plus tard';
          break;
        default:
          errorMessage = err.message;
      }
      
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  // ============================================
  // LOGOUT
  // ============================================
  const logout = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 Logging out user...');
      
      await signOut(auth);
      
      console.log('✅ User logged out successfully');
      
      return { success: true };
    } catch (err) {
      console.error('❌ Logout error:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  // ============================================
  // UPDATE USER PROFILE
  // ============================================
  const updateUserProfile = useCallback(async (updates) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 Updating user profile...');
      
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error('No user logged in');
      }
      
      // Update Firebase Auth profile
      if (updates.displayName || updates.photoURL) {
        await updateProfile(currentUser, {
          displayName: updates.displayName || currentUser.displayName,
          photoURL: updates.photoURL || currentUser.photoURL,
        });
      }
      
      // Update Firestore document
      const userRef = doc(db, COLLECTIONS.USERS, currentUser.uid);
      await updateDoc(userRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      });
      
      // Update local user state
      setUser(prev => ({ ...prev, ...updates }));
      
      console.log('✅ Profile updated successfully');
      
      return { success: true };
    } catch (err) {
      console.error('❌ Update profile error:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  // ============================================
  // RESET PASSWORD
  // ============================================
  const resetPassword = useCallback(async (email) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 Sending password reset email...');
      
      await sendPasswordResetEmail(auth, email);
      
      console.log('✅ Password reset email sent');
      
      return { success: true };
    } catch (err) {
      console.error('❌ Reset password error:', err);
      
      let errorMessage = 'Erreur lors de l\'envoi de l\'email';
      
      switch (err.code) {
        case 'auth/user-not-found':
          errorMessage = 'Aucun compte trouvé avec cet email';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Email invalide';
          break;
        default:
          errorMessage = err.message;
      }
      
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  // ============================================
  // UPDATE EMAIL
  // ============================================
  const updateUserEmail = useCallback(async (newEmail) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 Updating user email...');
      
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error('No user logged in');
      }
      
      await updateEmail(currentUser, newEmail);
      
      // Update Firestore
      const userRef = doc(db, COLLECTIONS.USERS, currentUser.uid);
      await updateDoc(userRef, {
        email: newEmail,
        updatedAt: serverTimestamp(),
      });
      
      console.log('✅ Email updated successfully');
      
      return { success: true };
    } catch (err) {
      console.error('❌ Update email error:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  // ============================================
  // UPDATE PASSWORD
  // ============================================
  const updateUserPassword = useCallback(async (newPassword) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 Updating user password...');
      
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error('No user logged in');
      }
      
      await updatePassword(currentUser, newPassword);
      
      console.log('✅ Password updated successfully');
      
      return { success: true };
    } catch (err) {
      console.error('❌ Update password error:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  // ============================================
  // CONTEXT VALUE
  // ============================================
  const value = {
    user,
    loading,
    error,
    register,
    login,
    logout,
    updateUserProfile,
    resetPassword,
    updateUserEmail,
    updateUserPassword,
    clearError: () => setError(null),
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// ============================================
// CUSTOM HOOK
// ============================================
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export default AuthContext;
