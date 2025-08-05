import React, {createContext, useContext, useState, useEffect} from 'react';
import auth from '@react-native-firebase/auth';

/**
 * AuthContext provides the currently signed‑in user and helper methods for
 * signing in and signing out.  The Firebase Auth plugin in Godot offers
 * similar methods to create accounts and log in【661707396329274†L185-L238】, but in this
 * React implementation we rely on the `@react-native-firebase/auth` API.
 */
export interface AuthContextValue {
  user: any | null;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
  const [user, setUser] = useState<any | null>(null);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(u => setUser(u));
    return unsubscribe;
  }, []);

  const signInWithEmail = async (email: string, password: string) => {
    await auth().signInWithEmailAndPassword(email, password);
  };

  const signUpWithEmail = async (email: string, password: string) => {
    await auth().createUserWithEmailAndPassword(email, password);
  };

  const signOutFn = async () => {
    await auth().signOut();
  };

  return (
    <AuthContext.Provider value={{user, signInWithEmail, signUpWithEmail, signOut: signOutFn}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};