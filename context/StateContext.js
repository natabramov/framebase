import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { ethers } from "ethers";
import { useRouter } from 'next/router';
import { db } from "../firebase/Firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { initializeContractListeners } from "../firebase/ContractListeners";

const Context = createContext();

export const StateContext = ({ children }) => {
    const [user, setUser] = useState(null);
    const [showAccountPopup, setShowAccountPopup] = useState(false);
    const [username, setUsername] = useState(null);
    const [email, setEmail] = useState(null);
    const router = useRouter();
    const [provider, setProvider] = useState(null);
    const contractListenersRef = useRef(null);

    // cleanupContractListeners stops the app from listening to blockchain events when needed
    const cleanupContractListeners = async () => {
        if (contractListenersRef.current) {
            try {
                contractListenersRef.current.removeListeners();
                contractListenersRef.current = null;
            } 
            
            catch (error) {
                console.error("Error cleaning up contract listeners:", error);
            }
        }
    };

    // sets up listeners that watch for blockchain events related to the app
    useEffect(() => {
        // need both a connection to the blockchain AND a logged-in user
        if (provider && user) {
            const setupListeners = async () => {
                try {
                    await cleanupContractListeners();
                    const listeners = await initializeContractListeners(provider);
                    // save the listeners in a reference so we can turn them off later
                    contractListenersRef.current = listeners;
                } 
                
                catch (error) {
                    console.error("Failed to initialize contract listeners:", error);
                }
            };
            
            setupListeners();
        }
        
        // runs when the component is about to disappear from the screen
        return () => {
            cleanupContractListeners();
        };
    }, [provider, user]);

    const connectWallet = async () => {
        console.log("connectWallet called");
        if (!window.ethereum) {
            alert("Please install MetaMask!");
            return;
        }
        try {
            // from documentation: 
            // A Web3Provider wraps a standard Web3 provider, which is
            // what MetaMask injects as window.ethereum into each page
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            setProvider(provider);

            // MetaMask requires requesting permission to connect users accounts
            await provider.send("eth_requestAccounts", []);

            // The MetaMask plugin also allows signing transactions to
            // send ether and pay to change state within the blockchain.
            // For this, you need the account signer..
            const signer = provider.getSigner();
            const address = await signer.getAddress();
            setUser(address);
            
            // check if user already exists in Firebase
            const userDoc = await getDoc(doc(db, "users", address));
            if (userDoc.exists()) {
                // user exists, load their data
                const userData = userDoc.data();
                setEmail(userData.email);
                setUsername(userData.username);
                router.push(`/profile/${userData.username}`);
            } else {
                // new user, show account creation popup where they can create a username and enter email
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
        cleanupContractListeners();
        setProvider(null);
        router.push('/');
    };

    // stores account data in Firebase cloud firestore
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
            email,
            provider
        }}>
        {children}
        </Context.Provider>
    );
};

export const useStateContext = () => useContext(Context);
