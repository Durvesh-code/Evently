import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

function ProfilePage() {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <div>Loading profile...</div>;
  }

  return (
    // MODIFIED: Added margin: '0 auto' to center the container
    <div className="auth-container" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2>My Profile</h2>
      <div className="form-group">
        <label>Username:</label>
        {/* We use 'key' to force React to re-render this field if the user logs out/in */}
        <input type="text" key={user.username} defaultValue={user.username} readOnly />
      </div>
      <div className="form-group">
        <label>Email:</label>
        {/* This field will now work */}
        <input type="email" key={user.email} defaultValue={user.email} readOnly />
      </div>
      <div className="form-group">
        <label>Role:</label>
        <input type="text" key={user.role} defaultValue={user.role} readOnly />
      </div>
    </div>
  );
}

export default ProfilePage;