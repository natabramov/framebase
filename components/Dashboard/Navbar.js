import React from "react";
import styled from "styled-components";
import { GoArrowRight } from "react-icons/go";
import Link from 'next/link';
import Logo from 'assets/tftlogo.png';
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
        <InnerHeaderTextDiv>
          <HeaderText>Track your TFT Statistics with ease. </HeaderText>
          <p>Get started for free</p>
          <ArrowIcon><GoArrowRight /></ArrowIcon>
        </InnerHeaderTextDiv> 
      </TopHeaderDiv>
      <HeaderNavBarOuterDiv>
        <NavBarIconDiv>
          <Image src={Logo} alt="logo" width={100} height={100}></Image>
        </NavBarIconDiv>
        <Nav>
        <NavLinks>
          <NavLink href="#">Sign Up</NavLink>
          <NavLink href="#">Log In</NavLink>
        </NavLinks>
        </Nav>
      </HeaderNavBarOuterDiv>
    </OuterHeaderDiv>
  );
};

const OuterHeaderDiv = styled.div`
  position: sticky;
  top: 0;
  backdrop-filter: blur(4px);
  `;

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
  height: 75px;
`;

const InnerHeaderTextDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  `;

const ArrowIcon = styled.p`
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
  padding-top: 15px;
  padding-bottom: 15px;
  padding: 15px 20px;
  background-color: transparent;
  color: white;
  font-size: 12pt;
  font-family: var(--font-inter);
  width: 100%;
  height: auto;
`;

const NavBarIconDiv = styled.div`
  font-size: 24px;
  margin-right: 20px;
  color: black;
  `;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 15px;
  padding-bottom: 15px;
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
  display: inline-block;
  background: rgb(101,184,145);
  background: radial-gradient(circle, rgba(101,184,145,1) 0%, rgba(0,144,150,1) 100%);
  padding: 0.8rem 3rem;
  color: white;
  border-radius: 100rem;
  border-width: 2px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  text-decoration: none;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 14px rgba(0, 0, 0, 0.3);
  }
  `;

const HeaderText = styled.p`
  color:#caffe6;
  padding: 20px;
  `;


export default NavBar;
