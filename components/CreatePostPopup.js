import React from 'react';
import styled from 'styled-components';

const CreatePostPopup = ({ onClose }) => {
  return (
    <Overlay>
      <ModalContainer>
        <LeftPane>
          <ImagePlaceholder>
            <UploadButton>Upload Photo</UploadButton>
          </ImagePlaceholder>
        </LeftPane>
        <RightPane>
          <Header>
            <ProfilePic />
            <Username>username</Username>
          </Header>
          <CaptionArea placeholder="Write a caption..." maxLength={2200} />
        </RightPane>
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
  /* needs to be above all components */
  z-index: 2000;

`;

const ModalContainer = styled.div`
  display: flex;
  position: relative;
  width: 80%;
  max-width: 900px;
  height: 600px;
  border-radius: 10px;
  overflow: hidden;
  font-family: "Inter", serif;

  /* scales with smaller pages */
  @media (max-width: 768px) {
    flex-direction: column;
    height: auto;
  }
`;

// popup is split into 2 parts, left one is for the image
const LeftPane = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ImagePlaceholder = styled.div`
  width: 100%;
  height: 100%;
  background: rgb(48, 48, 48);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const UploadButton = styled.button`
  padding: 10px 20px;
  background-color: black;
  color: white;
  border: none;
  border-radius: 6px;
`;

// right side with caption
const RightPane = styled.div`
  width: 300px;
  padding: 20px;
  background-color: black;
  color: white;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const ProfilePic = styled.div`
  width: 36px;
  height: 36px;
  background-color: gray;
  border-radius: 50%;
  margin-right: 10px;
`;

const Username = styled.div`
  font-weight: bold;
`;

const CaptionArea = styled.textarea`
  flex: 1;
  background:rgb(0, 0, 0);
  border: none;
  color: white;
  resize: none;
  padding: 12px;
  border-radius: 6px;
  font-size: 14px;

  &:focus {
    outline: none;
  }
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

export default CreatePostPopup;