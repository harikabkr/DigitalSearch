import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import EditProfile from './EditProfile';
import Typography from '@mui/material/Typography';
import { API_URI } from '../utils/constants';
import AuthContext from '../Context/userAuthContext';
import axios from "axios";


export const Profile = () => {
    const [isEditing, setIsEditing] = useState(false);
    const { userId } = useContext(AuthContext);
    const token = localStorage.getItem('authTokens');
    const accessToken = JSON.parse(token).access;
    
    const fetchProfileData = async () => {
        try {
            console.log('id', userId);
            console.log('token', accessToken);
            const config = {
                headers: { Authorization: `Bearer ${accessToken}` }
            };
            axios.get(`${API_URI}/api/get-profile/${userId}/`, config)
                .then((response) => {
                    const data = response.data;
                    console.log('> Profile details', data);
                })
                .catch((error) => {
                    console.error('Error while retrieving profile data: ', error);
                })
            
           

        } catch (error) {
            console.error('Error fetching profile data:', error);
        }
    };

    useEffect(() => {
        fetchProfileData();
    }, []);

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleSaveProfile = (updatedProfileData) => {
        console.log('Updated Profile Data:', updatedProfileData);
        setIsEditing(false);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', width: 500, justifyContent: 'center', margin: 'auto' }}>
            <Typography variant="h6" noWrap component="div">
                Profile
            </Typography>
            {isEditing ? (
                <EditProfile />
            ) : (
                <div>
                    <p>Name:</p>
                    <p>Email:</p>
                    <button onClick={handleEditClick}>Edit</button>
                </div>
            )}
        </div>
    );
};
