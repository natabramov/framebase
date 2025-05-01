import React, { createContext, useContext, useState } from "react";
import { ethers } from "ethers";
import { useRouter } from 'next/router';
import { db } from "../firebase/Firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

const Context = createContext();

export const StateContext = ({ children }) => {
    const [user, setUser] = useState(null);
    const [showAccountPopup, setShowAccountPopup] = useState(false);
    const [username, setUsername] = useState(null);
    const [email, setEmail] = useState(null);
    const router = useRouter();

    const connectWallet = async () => {
        console.log("connectWallet called");
        if (!window.ethereum) {
            alert("Please install MetaMask!");
            return;
        }
        try {
            // From documentation: 
            // A Web3Provider wraps a standard Web3 provider, which is
            // what MetaMask injects as window.ethereum into each page
            const provider = new ethers.providers.Web3Provider(window.ethereum);

            // MetaMask requires requesting permission to connect users accounts
            await provider.send("eth_requestAccounts", []);

            // The MetaMask plugin also allows signing transactions to
            // send ether and pay to change state within the blockchain.
            // For this, you need the account signer..
            const signer = provider.getSigner();
            const address = await signer.getAddress();
            setUser(address);
            
            // Check if user already exists in Firebase
            const userDoc = await getDoc(doc(db, "users", address));
            if (userDoc.exists()) {
                // User exists, load their data
                const userData = userDoc.data();
                setEmail(userData.email);
                setUsername(userData.username);
                router.push(`/profile/${userData.username}`);
            } else {
                // New user, show account creation popup
                setShowAccountPopup(true);
            }
        }
        catch (err) {
            console.error(err);
        }
    };

    const logout = () => {
        setUser(null);
        setUsername(null);
        setEmail(null);
        router.push('/');
    };

    // Stores account data in Firebase cloud firestore
    const completeAccount = async ({ email, username }) => {
        try {
            if (!user) return;
            
            await setDoc(doc(db, "users", user), {
                walletAddress: user,
                email: email,
                username: username,
                createdAt: new Date().toISOString(),
            });
            
            setEmail(email);
            setUsername(username);
            router.push(`/profile/${username}`);
        } catch (error) {
            console.error("Error creating user account:", error);
            alert("Failed to create account. Please try again.");
        }
    };
      
    return (
        <Context.Provider value={{
            user,
            connectWallet,
            logout,
            showAccountPopup,
            setShowAccountPopup,
            completeAccount,
            username,
            email
        }}>
        {children}
        </Context.Provider>
    );
};

export const useStateContext = () => useContext(Context);
