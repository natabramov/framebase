import React from "react";
import styled from "styled-components";
import { GoArrowRight } from "react-icons/go";
import Link from 'next/link';
import Logo from 'assets/teamfight-tactics-seeklogo.png';
import Image from "next/image";

// #172A3A Prussian Blue
// #004346 Midnight Green
// #65B891 Mint
// #B8E1FF Uranian Blue
// #BCB6FF Periwinkle
// #009096 Lighter Prussian Blue

const NavBar = () => {
  return (
    <OuterHeaderDiv>
      <TopHeaderDiv>
          <HeaderText>Track your TFT Statistics with ease. </HeaderText>
          <StyledLink href="/auth/signup">Get started for free</StyledLink>
          <ArrowIcon><GoArrowRight /></ArrowIcon>
      </TopHeaderDiv>
      <HeaderNavBarOuterDiv>
        <NavBarIconDiv>
          <Image src={Logo} alt="logo" width={100} height={100}></Image>
        </NavBarIconDiv>
        <Nav>
        <NavLinks>
          <LogInLink href="/auth/login">Log in</LogInLink>
          <NavLink href="/auth/signup">Sign up for Free</NavLink>
        </NavLinks>
        </Nav>
      </HeaderNavBarOuterDiv>
    </OuterHeaderDiv>
  );
};

// header sticks to the top of the page
const OuterHeaderDiv = styled.div`
  position: sticky;
  top: 0;
  backdrop-filter: blur(4px);
  `;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: white;
`

const TopHeaderDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 15px;
  padding-bottom: 15px;
  background-color: #172A3A;
  color: white;
  font-size: 12pt;
  font-family: var(--font-inter);
  width: 100%;
`;

const ArrowIcon = styled.div`
  display: flex;
  justify-content: center;
  height: 30px;
  width: 30px;
  align-items: center; 
  `
const HeaderNavBarOuterDiv = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px; // top and bottom padding is 15px, left and right padding is 20px
  background-color: transparent;
  color: white;
  font-size: 12pt;
  font-family: var(--font-inter);
  width: 100%;
`;

const NavBarIconDiv = styled.div`
  font-size: 24px;
  margin-right: 20px;
  `;

const Nav = styled.nav` // holds the sign up and log in buttons
  display: flex;
  align-items: center;
  justify-content: space-between; // the icon and buttons are on opposite sides
  padding: 15px 0;
  background-color: transparent;
  `;

const NavLinks = styled.div`
  display: flex;
  gap: 20px;
  `;

const NavLink = styled(Link)`
  color: #333;
  font-size: 16px;
  font-weight: 500;
  transition: color 0.5s ease;
  display: inline-block; // keeps buttons side by side
  background: rgb(101,184,145);
  background: radial-gradient(circle, rgba(101,184,145,1) 0%, rgba(0,144,150,1) 100%);
  padding: 0.8em 2em;
  color: white;
  border-radius: 100em;
  border-width: 2px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  text-decoration: none; // no underline for link

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 14px rgba(0, 0, 0, 0.3);
  }
  `;

const LogInLink = styled(Link)`
  color: #333;
  font-size: 16px;
  font-weight: 500;
  transition: color 0.5s ease;
  display: inline-block;
  background: rgb(232, 253, 243);
  padding: 0.8em 2em;
  color: black;
  border-radius: 100em;
  border-width: 2px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  text-decoration: none;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 14px rgba(0, 0, 0, 0.3);
  }`;

const HeaderText = styled.p`
  color:#caffe6;
  padding: 20px;
  `;


export default NavBar;
