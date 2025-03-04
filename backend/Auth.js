import { auth } from "./Firebase";
import { createUserWithEmailAndPassword, 
        signInWithEmailAndPassword, 
        fetchSignInMethodsForEmail, 
        onAuthStateChanged, 
        signOut } from "firebase/auth";

import { db } from "./Firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

// fetches current sign in methods for the email, if empty array [] then the email is not in use. if the array is populated then it is in use
export const isEmailInUse = async (email) => {
    try {
        const signInMethods = await fetchSignInMethodsForEmail(auth, email);
        return signInMethods.length > 0;
    }
    catch (error) {
        console.error("Error verifying email:", error.message); 
        return false;
    }
}

// registers a user with their inputted riot ID + PUUID received from API fetch in Dashboard.js
export const register = async ({email, password, riotUsername, riotUsertag, riotPUUID, setUser}) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // creates a user document with the necessary information to be stored
        const userDocRef = doc(db, "users", user.uid);
        await setDoc(userDocRef, {
            email: user.email,
            createdOn: new Date(),
            riotUsername: riotUsername,
            riotUsertag: riotUsertag,
            riotPUUID: riotPUUID
        });

        const userDoc = await getDoc(userDocRef);
        setUser(userDoc.data());
        
        console.log(`User ${user.email} signed up successfully`);

        const userData = userDoc.data();
        setUser(userData);
        return user;
    } 
    catch (error) {
        console.error("Error with registering user", error.message);
    }
}

// login a user and fetch their data from the document. if the document does not exist then create one
export const login = async ({email, password, setUser}) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (!userDoc.exists()) {
            console.warn("No user document found. Creating one...");
            await setDoc(doc(db, "users", user.uid), {
                email: user.email,
                createdOn: new Date()
            });
        }
        const userData = userDoc.data();
        setUser(userData);
        return user;
    } 
    catch (error) {
        console.error("Error with logging in user", error.message);
    }
}

// get the currently signed in user https://firebase.google.com/docs/auth/web/manage-users
// retrieves their existing data from the dov if it exists, if not then the user is set to null
export const getSignedInUser = (setUser) => {
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            const userDoc = await getDoc(doc(db, "users", user.uid));
            setUser(userDoc.exists() ? userDoc.data() : null);
        } 
        
        else {
            setUser(null);
        }
    });
};

export const signOutUser = async (setUser) => {
    try {
        await signOut(auth);
        setUser(null);
    } 
    
    catch (error) {
        console.error("Sign-out error:", error.message);
    }
};