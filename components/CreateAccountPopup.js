import React, { useState } from 'react';
import styled from 'styled-components';
import { checkUsernameAvailability } from '../firebase/UserServices';

const CreateAccountPopup = ({ isOpen, onClose, onSubmit }) => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // if the popup is not open, return null
  if (!isOpen) {
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !username) {
      setErrorMessage('Email and username are required');
      return;
    }

    setErrorMessage('');
    
    try {
      // when the user submits the form, check if the username is available
      const isAvailable = await checkUsernameAvailability(username);
      
      if (!isAvailable) {
        setErrorMessage('Username is already taken');
        return;
      }
      
      onSubmit({ email, username });
      onClose();
    } catch (error) {
      console.error("Error during account creation:", error);
      setErrorMessage('Error creating account. Please try again.');
    }
  };

  return (
    <Overlay>
      <ModalContainer>
        <Header>Create Your Account</Header>
        <Form onSubmit={handleSubmit}>
          <Input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            type="text"
            placeholder="Username (cannot be changed)"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
          <SubmitButton type="submit">
            Continue
          </SubmitButton>
        </Form>
        <CloseButton onClick={onClose}>×</CloseButton>
      </ModalContainer>
    </Overlay>
  );
};

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
`;

const ModalContainer = styled.div`
  position: relative;
  width: 400px;
  padding: 32px;
  background: black;
  color: white;
  border-radius: 12px;
  font-family: 'Inter', sans-serif;
`;

const Header = styled.h2`
  margin-bottom: 24px;
  font-size: 20px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const Input = styled.input`
  padding: 12px;
  margin-bottom: 16px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
`;

const ErrorMessage = styled.p`
  color: #ff4747;
  margin-bottom: 16px;
  font-size: 14px;
`;

const SubmitButton = styled.button`
  padding: 12px;
  background-color: #283618;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 12px;
  right: 14px;
  font-size: 24px;
  background: transparent;
  color: white;
  border: none;
`;

export default CreateAccountPopup;
