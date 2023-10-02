// src/components/EditProfile.js
import React, { useState } from 'react';

const EditProfile = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSaveClick = () => {
    // Handle saving the edited profile information, e.g., send it to the server
    console.log('Saving profile changes:', { name, email });
    // You can also add API calls to save data to the backend here
  };

  return (
    <div>
      <h2>Edit Profile</h2>
      <label>
        Name:
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </label>
      <br />
      <label>
        Email:
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>
      <br />
      <button onClick={handleSaveClick}>Save</button>
    </div>
  );
};

export default EditProfile;
