import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';

const SidebarButton = ({ icon: Icon, label, href, onClick }) => {
  return (
    <ButtonWrapper href={href || '#'} passHref onClick={onClick}>
      <Button>
        <Icon className="icon" />
        <span className="label">{label}</span>
        <Tooltip className="tooltip">{label}</Tooltip>
      </Button>
    </ButtonWrapper>
  );
};


const ButtonWrapper = styled(Link)`
  text-decoration: none;
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  gap: 12px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 10px 12px;
  font-size: 16px;
  color:rgb(51, 51, 51);

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

const Tooltip = styled.div`
  position: absolute;
  left: 60px;
  background-color: rgb(51, 51, 51);
  color: white;
  padding: 6px 10px;
  border-radius: 6px;
  font-size: 14px;
  opacity: 0;
  transition: opacity 0.2s;

  ${Button}:hover & {
    opacity: 1;
  }

  @media (min-width: 1200px) {
    display: none;
  }
`;


export default SidebarButton;