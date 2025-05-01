import React, { createContext, useContext, useState } from "react";
import { ethers } from "ethers";
import { useRouter } from 'next/router';

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
            setShowAccountPopup(true);
        }

        catch (err) {
            console.error(err);
        }
    };

    const completeAccount = ({ email, username }) => {
        setEmail(email);
        setUsername(username);
        router.push(`/profile/${username}`);
      };
      

    return (
        <Context.Provider value={{
        user,
        connectWallet,
        showAccountPopup,
        setShowAccountPopup,
        completeAccount
        }}>
        {children}
        </Context.Provider>
    );
};

export const useStateContext = () => useContext(Context);
