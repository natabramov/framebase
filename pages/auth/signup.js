import React, { useState } from 'react';
import styled from 'styled-components';
// import { useRouter } from 'next/router'
// import { useStateContext } from '@/context/StateContext'
// import { isEmailInUse, register} from '@/backend/Auth'
import Link from 'next/link';
import Logo from 'assets/teamfight-tactics-seeklogo.png';
import Image from "next/image";

const Signup = () => {

//   const { user, setUser } = useStateContext()
//   const [ email, setEmail ] = useState('')
//   const [ password, setPassword ] = useState('')

//   const router = useRouter()

//   async function validateEmail(){
//     const emailRegex = /^[\w.%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
//     if(emailRegex.test(email) == false ){
//         return false;
//     }
//     console.log('so far so good...')
//     const emailResponse = await isEmailInUse(email)
//     console.log('email response', emailResponse)
//     if(emailResponse.length == 0 ){
//         return false;
//     }

//     return true;
// }

//   async function handleSignup(){
//     const isValidEmail = await validateEmail()
//     // console.log('isValidEmail', isValidEmail)
//     // if(!isValidEmail){ return; }
    
//     try{
//         await register(email, password, setUser)
//         router.push('/dashboard')
//     }catch(err){
//         console.log('Error Signing Up', err)
//     }
//   }


return (
  <>
  <TopSignInHeader>
  <SignInLogoIconDiv>
    <Image src={Logo} alt="logo" width={75} height={75}></Image>
  </SignInLogoIconDiv>
  </TopSignInHeader>
  <SignInContainer>
    <SignInBox> 
        <Title>Sign Up</Title>
        <Input type="email" placeholder="Enter your email address..."></Input>
        <ContinueButton>Continue</ContinueButton> 
        <FooterText>
          <UserAgreementText>By signing up, you automatically agree to our <UserAgreementSpan href='/legal/terms-of-use' rel="noopener noreferrer" target="_blank"> Terms of Use</UserAgreementSpan> and <UserAgreementSpan href='/legal/privacy-policy' rel="noopener noreferrer" target="_blank">Privacy Policy.</UserAgreementSpan></UserAgreementText>
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
height: 75px;
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
  background-color:rgb(82, 148, 117);
}
`;

const FooterText = styled.p`
font-size: 12px;
color: #6c757d;
margin-top: 15px;
`;

const UserAgreementText = styled.p`
font-size: 12px;
color: #333;
margin-top: 20px;
text-align: center;
`;

const UserAgreementSpan = styled(Link)`
color:#172A3A;
cursor: pointer;
&:hover {
  text-decoration: underline;
}
&:not(:last-of-type)::after {
  content: ',';
}
`;

export default Signup