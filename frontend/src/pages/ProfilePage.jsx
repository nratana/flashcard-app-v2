import { useState, useEffect } from "react";
import { getProfile, updateProfile, deleteAccount } from "../api";

function ProfilePage({ user, onLogout, onUpdateUser }) {
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showDelete, setShowDelete] = useState(false);

  const handleSave = async () => {
    if (!name.trim() || !email.trim()) {
      setError("Name and email are required");
      return;
    }
    try {
      const updated = await updateProfile(name, email);
      onUpdateUser(updated);
      setEditing(false);
      setMessage("Profile updated");
      setError("");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteAccount();
      localStorage.removeItem("token");
      onLogout();
    } catch (err) {
      setError("Failed to delete account");
    }
  };

  return (
    <div>
      <div className="page-header">
        <h2>Your Profile</h2>
      </div>

      {message && <div className="success-banner">{message}</div>}
      {error && (
        <div className="error-banner">
          {error}
          <button onClick={() => setError("")} className="error-close">×</button>
        </div>
      )}

      <div className="section-box">
        <div className="profile-info">
          <div className="profile-field">
            <label>Name</label>
            {editing ? (
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input"
              />
            ) : (
              <p>{user?.name}</p>
            )}
          </div>
          <div className="profile-field">
            <label>Email</label>
            {editing ? (
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
              />
            ) : (
              <p>{user?.email}</p>
            )}
          </div>
          <div className="profile-field">
            <label>Role</label>
            <p>{user?.role}</p>
          </div>

          <div className="profile-actions">
            {editing ? (
              <>
                <button onClick={handleSave} className="btn btn-primary">Save Changes</button>
                <button onClick={() => setEditing(false)} className="btn btn-cancel">Cancel</button>
              </>
            ) : (
              <button onClick={() => setEditing(true)} className="btn btn-edit-profile">Edit Profile</button>
            )}
          </div>
        </div>
      </div>

      {/* danger zone */}
      <div className="section-box danger-zone">
        <h3>Danger Zone</h3>
        {!showDelete ? (
          <button onClick={() => setShowDelete(true)} className="btn btn-delete">
            Delete My Account
          </button>
        ) : (
          <div className="delete-confirm">
            <p>Are you sure? This cannot be undone.</p>
            <div className="profile-actions">
              <button onClick={handleDelete} className="btn btn-delete">Yes, Delete</button>
              <button onClick={() => setShowDelete(false)} className="btn btn-cancel">Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfilePage;
