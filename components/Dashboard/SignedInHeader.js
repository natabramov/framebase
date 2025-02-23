import React, { useState } from 'react';
import styled from 'styled-components';
// import { useRouter } from 'next/router'
// import { useStateContext } from '@/context/StateContext'
// import { isEmailInUse, register} from '@/backend/Auth'
import Logo from 'assets/teamfight-tactics-seeklogo.png';
import Image from "next/image";

const SignedInHeader = () => {

return (
  <>
  <TopSignInHeader>
  <SignInLogoIconDiv>
    <Image src={Logo} alt="logo" width={75} height={75}></Image>
  </SignInLogoIconDiv>
  </TopSignInHeader>
  </>
  )
}

const TopSignInHeader = styled.div`
display: flex;
align-items: left;
background: linear-gradient(to right, rgb(255, 255, 255) 0%, rgb(235, 247, 240) 50%,rgb(149, 223, 188) 100%);
width: 100%;
height: 75px;
`;

const SignInLogoIconDiv = styled.div`
font-size: 24px;
margin-right: 20px;
padding: 0px 12px;
color: black;
`;

export default SignedInHeader;