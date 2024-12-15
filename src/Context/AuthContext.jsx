import { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../Firebase/firebaseConfig.jsx';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { collection, addDoc, getDocs } from 'firebase/firestore';

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  const createUser = async (email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      return user;
    } catch (error) {
      console.error('Error creating user:', error.message);
      throw error;
    }
  };

  const loginUser = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      return user;
    } catch (error) {
      console.error('Error signing in:', error.message);
      throw error;
    }
  };

  const logoutUser = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error.message);
      throw error;
    }
  };

  const addUserDocument = async (collectionName, docData) => {
    try {
      const docRef = await addDoc(collection(db, collectionName), docData);
      console.log("Document written with ID:", docRef.id);
    } catch (error) {
      console.error("Error adding document:", error);
      throw error;
    }
  };

  const getUserDocuments = async (collectionName) => {
    try {
      const querySnapshot = await getDocs(collection(db, collectionName));
      const users = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      return users;
    } catch (error) {
      console.error("Error getting documents:", error);
      throw error;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, createUser, loginUser, logoutUser, addUserDocument, getUserDocuments }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
