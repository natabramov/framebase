import React from "react";
import styled from "styled-components";
import Image from "next/image";
import sorakaHDShadowNew from 'assets/Soraka_StarGuardianSkin_HD_OtherShadow.png';
import Link from 'next/link';

// #172A3A Prussian Blue
// #004346 Midnight Green
// #65B891 Mint
// #B8E1FF Uranian Blue
// #BCB6FF Periwinkle
// #009096 Lighter Prussian Blue

const Hero = () => {
  return (
    <GradientDiv>
      <Wrapper>
          <BigHeader>Level up your skills</BigHeader>
          <Description>Feel accomplished with a TFT tracking app designed to track your match history, analyze key statistics, and help you climb ranks with confidence.</Description>
          <LogInLinkDiv>
            <LogInLink href="/auth/login">Sign up for free</LogInLink>
          </LogInLinkDiv>
          <StyledImage src={sorakaHDShadowNew} alt="soraka"></StyledImage>
      </Wrapper>
    </GradientDiv>
  );
};

const BigHeader = styled.h1`
  font-size: 48px;
  font-weight: bold;
  letter-spacing: -0.04em;
  font-family: var(--font-inter);
  background: linear-gradient(to bottom, black, #004346);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  `;

const Description = styled.p`
// em is size relative to the parent element's font size
  font-size: 1.25em;
  color: #010d3e;
  letter-spacing: -0.025em;
  margin-top: 1.5em;
  font-family: var(--font-inter);
  `

const LogInLinkDiv = styled.div`
  display: flex;
  gap: 4px;
  align-items: center;
  margin-top: 30px;
  font-family: var(--font-inter);
  `;

const LogInLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 20px;
  font-size: 1em;
  font-weight: 500;
  border-radius: 8px;
  letter-spacing: 0.02em;
  transition: all 0.3s ease-in-out; // transitions all properties in 0.3s. ease-in-out means transition is slow, fast, then slow
  background-color: #172A3A;
  color: white;
  text-decoration: none;

  &:hover {
    background-color:rgb(35, 65, 88);
  }
`;

const Wrapper = styled.div`
  max-width: 1200px;
  margin: auto;
  padding: 0 20px;
  `;

const GradientDiv = styled.div`
  width: 100vw;
  height: 95vh;
  padding-top: 2em;
  padding-bottom: 5em;
  background: radial-gradient(ellipse 200% 100% at bottom left,rgb(149, 223, 188),rgb(255, 255, 255));
  overflow: hidden;
  `;

const StyledImage = styled(Image)`
  width: 100%;
  height: auto;
  object-fit: cover;
  position: relative;

  mask-image: linear-gradient(to top, rgba(0, 0, 0, 1) 90%, rgba(0, 0, 0, 0.95) 95%, rgba(0, 0, 0, 0) 100%);
  -webkit-mask-image: linear-gradient(to top, rgba(0, 0, 0, 1) 90%, rgba(0, 0, 0, 0.95) 95%, rgba(0, 0, 0, 0) 100%);
`;



export default Hero;
