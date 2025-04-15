import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getFirestore } from 'firebase/firestore';
import { db } from './firebase';

export const createAdminUser = async (email: string, password: string) => {
  try {
    const auth = getAuth();
    
    // Create the user with email and password
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Create a user document with admin role
    await setDoc(doc(db, 'users', userCredential.user.uid), {
      email: email,
      role: 'admin',
      createdAt: new Date().toISOString()
    });

    return userCredential.user;
  } catch (error: any) {
    console.error('Error creating admin user:', error);
    
    // Provide more specific error messages
    if (error.code === 'auth/email-already-in-use') {
      throw new Error('This email is already registered');
    } else if (error.code === 'auth/invalid-email') {
      throw new Error('Invalid email format');
    } else if (error.code === 'auth/weak-password') {
      throw new Error('Password should be at least 6 characters');
    }
    
    throw error;
  }
};