import { auth } from "./Firebase";
import { createUserWithEmailAndPassword, 
        signInWithEmailAndPassword, 
        fetchSignInMethodsForEmail, 
        onAuthStateChanged, 
        signOut } from "firebase/auth";

import { db } from "./Firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

export const isEmailInUse = async (email) => {
    try {
        const signInMethods = await fetchSignInMethodsForEmail(auth, email);
        console.log(`Sign-in methods for ${email}`, signInMethods);
        return signInMethods.length > 0;
    }
    catch (error) {
        console.error("Error verifying email use:", error); 
        return false;
    }
}

export const register = async ({ email, password, riotUsername, riotUsertag, riotPUUID, setUser }) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

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
        console.error(`Error ${error.code}: ${error.message}`);
        throw error;
    }
}

export const login = async ({ email, password, setUser }) => {
    try {
        console.log("Logging in with email:", email);
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        console.log("Login successful:", user.uid);

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
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error(`Error ${errorCode}: ${errorMessage}`);
        throw error;
    }
}

export const getSignedInUser = (setUser) => {
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            const userDoc = await getDoc(doc(db, "users", user.uid));
            setUser(userDoc.exists() ? userDoc.data() : null);
        } else {
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