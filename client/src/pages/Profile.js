import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import config from "../config";
import authService from "../services/auth.service";
import "./Profile.css";

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editMode, setEditMode] = useState(false);

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB");
      return;
    }

    setError("");
    setSuccess("");
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("profilePhoto", file);

      const response = await authService.uploadProfilePhoto(formData);

      // Update user context with new photo
      updateUser({ ...user, profilePhoto: response.profilePhoto });

      setSuccess("Profile photo updated successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to upload photo. Please try again."
      );
    } finally {
      setUploading(false);
    }
  };

  const profilePhotoUrl = user?.profilePhoto
    ? `${config.API_URL.replace("/api", "")}${user.profilePhoto}`
    : "https://via.placeholder.com/200x200?text=No+Photo";

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <>
      <Navbar />
      <div className="profile-page">
        <div className="profile-container">
          {/* Profile Header Card */}
          <div className="profile-header-card">
            <div className="profile-banner">
              <div className="banner-gradient"></div>
            </div>

            <div className="profile-header-content">
              <div className="profile-avatar-section">
                <div className="avatar-wrapper">
                  <img
                    src={profilePhotoUrl}
                    alt="Profile"
                    className="profile-avatar"
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/200x200?text=No+Photo";
                    }}
                  />
                  <label htmlFor="photo-input" className="avatar-upload-btn">
                    <input
                      id="photo-input"
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      disabled={uploading}
                      style={{ display: "none" }}
                    />
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      {uploading ? (
                        <>
                          <circle cx="12" cy="12" r="10"></circle>
                          <polyline points="12 6 12 12 16 14"></polyline>
                        </>
                      ) : (
                        <>
                          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                          <circle cx="12" cy="13" r="4"></circle>
                        </>
                      )}
                    </svg>
                  </label>
                </div>

                <div className="profile-title">
                  <h1>{user?.name}</h1>
                  <p className="profile-email">{user?.email}</p>
                  <span className={`role-badge ${user?.role}`}>
                    {user?.role === "admin" ? "Administrator" : "User"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Notifications */}
          {error && (
            <div className="notification error">
              <span className="notification-icon">!</span>
              <p>{error}</p>
              <button
                onClick={() => setError("")}
                className="notification-close"
              >
                ×
              </button>
            </div>
          )}
          {success && (
            <div className="notification success">
              <span className="notification-icon">✓</span>
              <p>{success}</p>
              <button
                onClick={() => setSuccess("")}
                className="notification-close"
              >
                ×
              </button>
            </div>
          )}

          {/* Profile Details Grid */}
          <div className="profile-details-grid">
            {/* Account Information */}
            <div className="detail-card">
              <div className="card-header">
                <h2>Account Information</h2>
                <button
                  className="edit-btn"
                  onClick={() => setEditMode(!editMode)}
                >
                  {editMode ? "Cancel" : "Edit"}
                </button>
              </div>

              <div className="detail-items">
                <div className="detail-item">
                  <div className="detail-icon">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                  </div>
                  <div className="detail-content">
                    <label>Full Name</label>
                    <p>{user?.name}</p>
                  </div>
                </div>

                <div className="detail-item">
                  <div className="detail-icon">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                      <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                  </div>
                  <div className="detail-content">
                    <label>Email Address</label>
                    <p>{user?.email}</p>
                  </div>
                </div>

                <div className="detail-item">
                  <div className="detail-icon">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <rect
                        x="3"
                        y="11"
                        width="18"
                        height="11"
                        rx="2"
                        ry="2"
                      ></rect>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg>
                  </div>
                  <div className="detail-content">
                    <label>Account Type</label>
                    <p className="capitalize">{user?.role}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Activity Card */}
            <div className="detail-card">
              <div className="card-header">
                <h2>Activity</h2>
              </div>

              <div className="detail-items">
                <div className="detail-item">
                  <div className="detail-icon">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <rect
                        x="3"
                        y="4"
                        width="18"
                        height="18"
                        rx="2"
                        ry="2"
                      ></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                  </div>
                  <div className="detail-content">
                    <label>Member Since</label>
                    <p>{formatDate(user?.createdAt)}</p>
                  </div>
                </div>

                <div className="detail-item">
                  <div className="detail-icon">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                  </div>
                  <div className="detail-content">
                    <label>Last Updated</label>
                    <p>{formatDate(user?.updatedAt)}</p>
                  </div>
                </div>

                <div className="detail-item">
                  <div className="detail-icon">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <circle cx="12" cy="12" r="10"></circle>
                      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                      <line x1="12" y1="17" x2="12.01" y2="17"></line>
                    </svg>
                  </div>
                  <div className="detail-content">
                    <label>Account Status</label>
                    <p className="status-active">Active</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Upload Hint */}
          <div className="upload-hint-card">
            <div className="hint-icon">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
            </div>
            <p>
              Click the camera icon on your profile picture to upload a new
              photo. Maximum size: 5MB. Supported formats: JPG, PNG, GIF
            </p>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Profile;
