// SidebarButton.js
import React from 'react';
import styled from 'styled-components';

const SidebarButton = ({ icon: Icon, label }) => {
  return (
    <Button>
      <Icon className="icon" />
      <span className="label">{label}</span>
    </Button>
  );
};

export default SidebarButton;

const Button = styled.button`
  display: flex;
  align-items: center;
  gap: 12px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 10px 12px;
  font-size: 16px;
  color: #333;

  .icon {
    font-size: 24px;
  }

  .label {
    display: inline;
  }

  @media (max-width: 1200px) {
    justify-content: center;

    .label {
      display: none;
    }
  }
`;
