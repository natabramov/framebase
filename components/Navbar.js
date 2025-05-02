import React from 'react';
import styled from 'styled-components';
import { IoIosSearch } from "react-icons/io";
import { useStateContext } from "../context/StateContext";
import CreateAccountPopup from "./CreateAccountPopup";
import Link from 'next/link';

// #606c38
// #283618
// #fefae0
// #dda15e
// #bc6c25

const Navbar = () => {
    const { showAccountPopup, setShowAccountPopup, completeAccount, connectWallet, logout, user } = useStateContext();
    
    return (
        <>
        <Nav>
            <LogoLink href="/">
                <Logo />
            </LogoLink>
            <SearchWrapper>
                <IoIosSearch className="search-icon" />
                <SearchInput placeholder="Search" />
            </SearchWrapper>
            
            {user ? (
                <>
                    <LogoutButton onClick={logout}>Log Out</LogoutButton>
                </>
            ) : (<LoginButton onClick={connectWallet}>Log in with MetaMask</LoginButton>)}
        </Nav>
                {showAccountPopup && (<CreateAccountPopup
                        isOpen={showAccountPopup}
                        onClose={() => setShowAccountPopup(false)}
                        onSubmit={completeAccount}/>)}
        </>
    );
};

const Nav = styled.nav`
/* navbar needs to stay on the page when the user is scrolling */
  display: flex;
  position: fixed;
  z-index: 1000;
  align-items: center;
  justify-content: space-between;
  padding: 10px 20px;
  border-bottom: 1px solid lightgray;
  background-color: white;
  width: 100%;
`;

const LogoLink = styled.a`
  text-decoration: none;
  cursor: pointer;
`;

const Logo = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: radial-gradient(circle at top left, #606c38, #283618);
`;

const SearchWrapper = styled.div`
  position: relative;
  flex: 1;
  max-width: 400px;
  margin: 0 20px;

  .search-icon {
    position: absolute;
    top: 50%;
    left: 12px;
    transform: translateY(-50%);
    color: gray;
    font-size: 18px;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 10px 36px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  background-color: rgb(245, 245, 245);

  &::placeholder {
    color: rgb(200, 200, 200);
  }
`;

const LoginButton = styled.button`
  background-color: #283618;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  margin-left: 10px;
`;

const LogoutButton = styled.button`
  background-color: #bc6c25;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  margin-left: 10px;
`;

export default Navbar;