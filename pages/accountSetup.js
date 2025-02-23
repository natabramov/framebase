import React, { useState } from 'react';
import styled from 'styled-components';
// import { useRouter } from 'next/router'
// import { useStateContext } from '@/context/StateContext'
// import {login, isEmailInUse} from '@/backend/Auth'
import Link from 'next/link';
import SignedInHeader from "/components/Dashboard/SignedInHeader";

const AccountSetup = () => {
    return (
        <>
        <SignedInHeader/>
        <InputContainer>
            <InputBox>
            <Title>Input your Riot ID here</Title>
            <Subtitle>This will give us the necessary info to compute your statistics</Subtitle>
            <Input type="text" placeholder="ex. Riot#333"></Input>
            <ContinueButton href="/Dashboard">Continue</ContinueButton>
            </InputBox>
        </InputContainer>
        </>
    )
};

const InputContainer = styled.div`
  display: flex;
  align-items:center;
  justify-content:center;
  background-color: rgb(253, 255, 251);
  width: 100%;
  height: 100vh;
  color: white;
  font-family: var(--font-inter);
  `;

const InputBox = styled.div`
    background: white;
    padding: 40px;
    border-radius: 30px; // makes edges rounded
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
    width: 400px;
    text-align: center;
`;

const Title = styled.h2`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #172A3A;
  `;

const Subtitle = styled.h3`
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 20px;
    color:rgb(44, 68, 70);
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  font-size: 16px;
  border: 1px solid #ced4da;
  border-radius: 5px;
  margin-bottom: 10px;
  outline: none;

  &:focus {
    border-color: #007bff;
  }
`
const ContinueButton = styled(Link)`
  width: 100%;
  padding: 12px;
  font-size: 16px;
  background-color: #65B891;
  color: white;
  font-weight: bold;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 12px;
  text-decoration: none;
  display: inline-block;
  
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 14px rgba(0, 0, 0, 0.3);
  }`;

export default AccountSetup;