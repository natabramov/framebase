import { usePlayerStats } from "../hooks/usePlayerStats";
import SignedInHeader from "@components/Dashboard/SignedInHeader";
import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { useStateContext } from '/context/StateContext'
import { useRouter } from 'next/router'
import { signOutUser } from '/backend/Auth';


const Dashboard = () => {

  const { user, setUser } = useStateContext();
  const router = useRouter()
  const { playerData, fetchPlayerStats, error } = usePlayerStats();
  console.log(user)

  useEffect(() => {
    if (!user){
      router.push('/')
    } 
    
    else if (user.riotUsername && user.riotUsertag) {
      fetchPlayerStats(user.riotUsername, user.riotUsertag);
    }    
  }, [user])

  const handleSignOut = async () => {
    try {
      await signOutUser(setUser);
      router.push('/');
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <>
      <SignedInHeader>
      <SignOutButton onClick={handleSignOut}>Sign Out</SignOutButton>
      </SignedInHeader>
      {user ? (<p>Statistics dashboard page. Welcome, {user.riotUsername}#{user.riotUsertag}</p>) : (<p>You are signed out.</p>)}
      {error && <p>Error: {error}</p>}
      {playerData && (
        <div>
          <h2>{playerData.gameName}#{playerData.tagLine}</h2>
          <pre>{JSON.stringify(playerData, null, 2)}</pre>
        </div>
      )}
    </>
  );
};

const SignOutButton = styled.button`
  padding: 10px 20px;
  background-color:#004346;
  color: white;
  border: none;
  border-radius: 5px;
  margin-top: 20px;
  cursor: pointer;
  &:hover {
    background-color:rgb(0, 107, 112);
  }
`;

export default Dashboard;
