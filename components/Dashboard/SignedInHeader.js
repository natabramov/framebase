import React, { useState } from 'react';
import styled from 'styled-components';
// import { useRouter } from 'next/router'
// import { useStateContext } from '@/context/StateContext'
// import { isEmailInUse, register} from '@/backend/Auth'
import Logo from 'assets/teamfight-tactics-seeklogo.png';
import Image from "next/image";

const SignedInHeader = ({ children }) => {

return (
  <>
  <TopSignInHeader>
  <SignInLogoIconDiv>
    <Image src={Logo} alt="logo" width={75} height={75}></Image>
  </SignInLogoIconDiv>
    {children}
  </TopSignInHeader>
  </>
  )
}

const TopSignInHeader = styled.div`
display: flex;
align-items: center;
justify-content: space-between;
background: linear-gradient(to right, rgb(255, 255, 255) 0%, rgb(235, 247, 240) 50%,rgb(149, 223, 188) 100%);
width: 100%;
height: 75px;
padding: 10px;
`;

const SignInLogoIconDiv = styled.div`
font-size: 24px;
color: black;
`;

export default SignedInHeader;