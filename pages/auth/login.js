import React, { useState } from 'react';
import styled from 'styled-components';
// import { useRouter } from 'next/router'
// import { useStateContext } from '@/context/StateContext'
// import {login, isEmailInUse} from '@/backend/Auth'
import Link from 'next/link';
import Logo from 'assets/teamfight-tactics-seeklogo.png';
import Image from "next/image";

const Login = () => {

  // const { user, setUser } = useStateContext()
  // const [ email, setEmail ] = useState('')
  // const [ password, setPassword ] = useState('')

  // const router = useRouter()


  // async function handleLogin(){

  // }


  return (
    <>
    <TopSignInHeader>
    <SignInLogoIconDiv>
      <Image src={Logo} alt="logo" width={75} height={75}></Image>
    </SignInLogoIconDiv>
    </TopSignInHeader>
    <SignInContainer>
      <SignInBox> 
          <Title>Log In</Title>
          <Input type="email" placeholder="Enter your email address..."></Input>
          <ContinueButton>Continue</ContinueButton> 
          <FooterText>
            <UserAgreementText>By signing in, you automatically agree to our <UserAgreementSpan href='/legal/terms-of-use' rel="noopener noreferrer" target="_blank"> Terms of Use</UserAgreementSpan> and <UserAgreementSpan href='/legal/privacy-policy' rel="noopener noreferrer" target="_blank">Privacy Policy.</UserAgreementSpan></UserAgreementText>
          </FooterText>
      </SignInBox>
    </SignInContainer>
    </>
  )
}

const TopSignInHeader = styled.div`
  display: flex;
  align-items: left;
  background: linear-gradient(to right, rgb(255, 255, 255) 0%, rgb(235, 247, 240) 50%,rgb(149, 223, 188) 100%);
  width: 100%;
  padding-top: 8px;
  padding-bottom: 8px;
  `;

const SignInLogoIconDiv = styled.div`
  font-size: 24px;
  margin-right: 20px;
  padding: 0px 12px;
  color: black;
  `;

const SignInContainer = styled.div`
  display: flex;
  align-items:center;
  justify-content:center;
  background-color: rgb(253, 255, 251);
  width: 100%;
  height: 100vh;
  color: white;
  font-family: var(--font-inter);
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

const FooterText = styled.p`
  font-size: 12px;
  color: #6c757d;
  margin-top: 15px;
`;

const UserAgreementText = styled.p`
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