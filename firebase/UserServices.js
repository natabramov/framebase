import { db } from './Firebase';
import { doc, getDoc, setDoc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';

// checks if  a username is already taken, queries the username from the database
export const checkUsernameAvailability = async (username) => {
  try {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("username", "==", username));
    const querySnapshot = await getDocs(q);
    // if the username is available, the querySnapshot will be empty
    return querySnapshot.empty;
  } catch (error) {
    console.error("Error checking username availability:", error);
    throw error;
  }
};

// gets the user from the wallet address
export const getUserByWalletAddress = async (walletAddress) => {
  try {
    const userDoc = await getDoc(doc(db, "users", walletAddress));
    if (userDoc.exists()) {
      return userDoc.data();
    }
    return null;
  } catch (error) {
    console.error("Error getting user:", error);
    throw error;
  }
};

// gets the user from the username, queries the username from the database
export const getUserByUsername = async (username) => {
  try {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("username", "==", username));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      return querySnapshot.docs[0].data();
    }
    return null;
  } catch (error) {
    console.error("Error getting user by username:", error);
    throw error;
  }
};

// updates the user profile in the database
export const updateUserProfile = async (walletAddress, profileData) => {
  try {
    const userRef = doc(db, "users", walletAddress);
    // including all properties from the profileData object, update the user profile
    await updateDoc(userRef, {
      ...profileData,
      updatedAt: new Date().toISOString()
    });
    return true;
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
}; 