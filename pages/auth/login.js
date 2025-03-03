import React, { useState } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/router'
import { useStateContext } from '/context/StateContext'
import {login, isEmailInUse} from '/backend/Auth'
import Link from 'next/link';
import SignedInHeader from "/components/Dashboard/SignedInHeader";

const Login = () => {

  const { user, setUser } = useStateContext()
  const [ email, setEmail ] = useState('')
  const [ password, setPassword ] = useState('')

  const router = useRouter()


  async function handleLogin(){
    if (!email || !password) {
      alert("Either email or password is unentered");
      return;
    }

    try {
      const userCred = await login({ email, password, setUser });
      router.push('/Dashboard');
    }
    catch (error) {
      console.error("Login failed:", error.message);
      alert("Login failed. Please check your credentials and try again.");
    }
  }


  return (
    <>
    <SignedInHeader/>
    <SignInContainer>
      <SignInBox> 
          <Title>Log In</Title>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email address..."></Input>
          <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password..."></Input>
          <ContinueButton onClick={handleLogin}>Continue</ContinueButton> 
          <FooterText>
            <UserAgreementText>By signing in, you automatically agree to our <UserAgreementSpan href='/legal/terms-of-use' rel="noopener noreferrer" target="_blank"> Terms of Use</UserAgreementSpan> and <UserAgreementSpan href='/legal/privacy-policy' rel="noopener noreferrer" target="_blank">Privacy Policy.</UserAgreementSpan></UserAgreementText>
          </FooterText>
      </SignInBox>
    </SignInContainer>
    </>
  )
}


const SignInContainer = styled.div`
  display: flex;
  align-items:center;
  justify-content:center;
  background-color: rgb(253, 255, 251);
  width: 100%;
  height: 100vh;
  color: white;
  font-family: "Inter", serif;
  `;

const SignInBox = styled.div`
  background: white;
  padding: 40px;
  border-radius: 30px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  width: 400px;
  text-align: center;
  `;

const Title = styled.h2`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #333;
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

const ContinueButton = styled.button`
  width: 100%;
  padding: 12px;
  font-size: 16px;
  background-color: #65B891;
  color: white;
  font-weight: bold;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;

  &:hover {
    background-color: rgb(82, 148, 117);
  }
`;

const FooterText = styled.div`
  font-size: 12px;
  color: #6c757d;
  margin-top: 15px;
`;

const UserAgreementText = styled.div`
  font-size: 12px;
  color: #666;
  margin-top: 20px;
  text-align: center;
`;

const UserAgreementSpan = styled(Link)`
  color: #172A3A;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
  &:not(:last-of-type)::after {
    content: ',';
  }
`;


export default Login