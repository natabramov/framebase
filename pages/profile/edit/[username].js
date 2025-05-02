import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { getUserByUsername, updateUserProfile } from '../../../firebase/UserServices';
import { useStateContext } from '../../../context/StateContext';

const EditProfilePage = () => {
  const router = useRouter();
  const { username } = router.query;
  const { user } = useStateContext();
  
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({email: '', username: '', bio: ''});
  
  useEffect(() => {
    const fetchProfileData = async () => {
      if (!username) return;
      
      try {
        setLoading(true);
        const userData = await getUserByUsername(username);
        
        if (userData) {
          setProfileData(userData);
          setFormData({
            email: userData.email || '',
            username: userData.username || '',
            bio: userData.bio || ''
          });
        } else {
          setError('User not found');
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfileData();
  }, [username]);
  
  useEffect(() => {
    // only owner can edit profile
    if (profileData && user && profileData.walletAddress !== user) {
      router.push(`/profile/${username}`);
    }
  }, [profileData, user, router, username]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // only allow username changes if username has not changed -- first time it's set
      if (formData.username !== username) {
        setError("Username cannot be changed");
        return;
      }
      
      await updateUserProfile(profileData.walletAddress, {
        email: formData.email,
        bio: formData.bio
      });
      
      router.push(`/profile/${username}`);
    } catch (err) {
      console.error("Error updating profile:", err);
      setError('Failed to update profile');
    }
  };
  
  if (loading) return <Container><h2>Loading profile...</h2></Container>;
  if (!profileData || !user) return <Container><h2>Unauthorized or user not found</h2></Container>;
  
  return (
    <Container>
      <FormHeader>Edit Profile</FormHeader>
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
      
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>Username</Label>
          <Input 
            type="text" 
            name="username" 
            value={formData.username}
            onChange={handleChange}
            disabled={true}
          />
          <HelperText>Username cannot be changed</HelperText>
        </FormGroup>
        
        <FormGroup>
          <Label>Email</Label>
          <Input 
            type="email" 
            name="email" 
            value={formData.email}
            onChange={handleChange}
          />
        </FormGroup>
        
        <FormGroup>
          <Label>Bio</Label>
          <TextArea 
            name="bio" 
            value={formData.bio}
            onChange={handleChange}
            rows={4}
          />
        </FormGroup>
        
        <ButtonGroup>
          <CancelButton type="button" onClick={() => router.push(`/profile/${username}`)}>Cancel</CancelButton>
          <SaveButton type="submit">Save Changes</SaveButton>
        </ButtonGroup>
      </Form>
    </Container>
  );
};

const Container = styled.div`
  max-width: 600px;
  margin: 100px auto 0;
  padding: 0 20px;
  font-family: 'Inter', sans-serif;
`;

const FormHeader = styled.h1`
  font-size: 24px;
  margin-bottom: 24px;
`;

const ErrorMessage = styled.div`
  background-color: rgb(255, 235, 238);
  color: #c62828;
  padding: 12px;
  border-radius: 4px;
  margin-bottom: 16px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-weight: 500;
  margin-bottom: 8px;
`;

const Input = styled.input`
  padding: 12px;
  border: 1px solid rgb(221, 221, 221);
  border-radius: 4px;
  font-size: 16px;
  
  &:disabled {
    background-color: rgb(245, 245, 245);
    cursor: not-allowed;
  }
`;

const TextArea = styled.textarea`
  padding: 12px;
  border: 1px solid rgb(221, 221, 221);
  border-radius: 4px;
  font-size: 16px;
  resize: vertical;
`;

const HelperText = styled.p`
  color: rgb(102, 102, 102);
  font-size: 14px;
  margin-top: 4px;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 16px;
`;

const Button = styled.button`
  padding: 10px 20px;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  border: none;
`;

const CancelButton = styled(Button)`
  background-color: rgb(245, 245, 245);
  color: rgb(51, 51, 51);
`;

const SaveButton = styled(Button)`
  background-color: #283618;
  color: white;
`;

export default EditProfilePage; 