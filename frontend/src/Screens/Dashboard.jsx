import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
const baseApiURL = () => import.meta.env.VITE_APILINK || "http://localhost:4000/api";

const Dashboard = () => {
  const userData = useSelector((state) => state.userData);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userType = localStorage.getItem("userType");
        let endpoint = "";
        
        if (userType === "admin") {
          endpoint = `${baseApiURL()}/admin/details/getDetails/${userData.employeeId}`;
        } else if (userType === "faculty") {
          endpoint = `${baseApiURL()}/faculty/details/getDetails/${userData.employeeId}`;
        } else if (userType === "student") {
          endpoint = `${baseApiURL()}/student/details/getDetails/${userData.enrollmentNo}`;
        }

        if (endpoint) {
          const response = await axios.get(endpoint, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
          setProfile(response.data);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userData) {
      fetchProfile();
    }
  }, [userData]);

  if (loading) {
    return (
      <div className="main-content">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="main-content">
        <div className="alert alert-warning" role="alert">
          Profile data not found.
        </div>
      </div>
    );
  }

  const userType = localStorage.getItem("userType");

  return (
    <div className="main-content">
      <div className="profile-section">
        <div className="profile-header">
          <div className="profile-image">
            {profile.profileImage ? (
              <img 
                src={profile.profileImage} 
                alt="Profile" 
                style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
              />
            ) : (
              <span>{profile.firstName?.charAt(0) || 'U'}</span>
            )}
          </div>
          <div className="profile-info">
            <h1>{profile.firstName} {profile.lastName}</h1>
            <p>
              {userType === "admin" && `Employee ID: ${profile.employeeId}`}
              {userType === "faculty" && `Employee ID: ${profile.employeeId}`}
              {userType === "student" && `Enrollment No: ${profile.enrollmentNo}`}
            </p>
            <p>{profile.role || userType.charAt(0).toUpperCase() + userType.slice(1)}</p>
          </div>
        </div>

        <div className="info-grid">
          <div className="info-section">
            <h3>Personal Information</h3>
            <div className="info-item">
              <span className="info-label">Email</span>
              <span className="info-value">{profile.email}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Phone</span>
              <span className="info-value">{profile.phone}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Gender</span>
              <span className="info-value">{profile.gender}</span>
            </div>
            {profile.bloodGroup && (
              <div className="info-item">
                <span className="info-label">Blood Group</span>
                <span className="info-value">{profile.bloodGroup}</span>
              </div>
            )}
            {profile.dateOfBirth && (
              <div className="info-item">
                <span className="info-label">Date of Birth</span>
                <span className="info-value">
                  {new Date(profile.dateOfBirth).toLocaleDateString()}
                </span>
              </div>
            )}
            {profile.joiningDate && (
              <div className="info-item">
                <span className="info-label">Joining Date</span>
                <span className="info-value">
                  {new Date(profile.joiningDate).toLocaleDateString()}
                </span>
              </div>
            )}
            {profile.salary && (
              <div className="info-item">
                <span className="info-label">Salary</span>
                <span className="info-value">₹{profile.salary}</span>
              </div>
            )}
            {profile.status && (
              <div className="info-item">
                <span className="info-label">Status</span>
                <span className="info-value">{profile.status}</span>
              </div>
            )}
          </div>

          <div className="info-section">
            <h3>Address Information</h3>
            <div className="info-item">
              <span className="info-label">Address</span>
              <span className="info-value">{profile.address}</span>
            </div>
            <div className="info-item">
              <span className="info-label">City</span>
              <span className="info-value">{profile.city}</span>
            </div>
            {profile.state && (
              <div className="info-item">
                <span className="info-label">State</span>
                <span className="info-value">{profile.state}</span>
              </div>
            )}
            {profile.pincode && (
              <div className="info-item">
                <span className="info-label">Pincode</span>
                <span className="info-value">{profile.pincode}</span>
              </div>
            )}
          </div>

          {profile.emergencyContact && (
            <div className="info-section">
              <h3>Emergency Contact</h3>
              <div className="info-item">
                <span className="info-label">Name</span>
                <span className="info-value">{profile.emergencyContact.name}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Relationship</span>
                <span className="info-value">{profile.emergencyContact.relationship}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Phone</span>
                <span className="info-value">{profile.emergencyContact.phone}</span>
              </div>
            </div>
          )}

          {userType === "student" && (
            <div className="info-section">
              <h3>Academic Information</h3>
              {profile.branch && (
                <div className="info-item">
                  <span className="info-label">Branch</span>
                  <span className="info-value">{profile.branch}</span>
                </div>
              )}
              {profile.semester && (
                <div className="info-item">
                  <span className="info-label">Semester</span>
                  <span className="info-value">{profile.semester}</span>
                </div>
              )}
              {profile.year && (
                <div className="info-item">
                  <span className="info-label">Year</span>
                  <span className="info-value">{profile.year}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
