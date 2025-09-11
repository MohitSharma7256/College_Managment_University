import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { FiUser, FiMail, FiPhone, FiMapPin, FiCalendar, FiDollarSign, FiUsers, FiBook } from "react-icons/fi";

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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-md">
          <div className="flex items-center">
            <FiUser className="h-6 w-6 text-yellow-600 mr-3" />
            <p className="text-yellow-800">Profile data not found.</p>
          </div>
        </div>
      </div>
    );
  }

  const userType = localStorage.getItem("userType");

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="relative">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white text-2xl md:text-3xl font-bold shadow-lg">
                {profile.profileImage ? (
                  <img 
                    src={profile.profileImage} 
                    alt="Profile" 
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span>{profile.firstName?.charAt(0) || 'U'}</span>
                )}
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                <div className="w-3 h-3 bg-white rounded-full"></div>
              </div>
            </div>
            
            <div className="text-center md:text-left flex-1">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                {profile.firstName} {profile.lastName}
              </h1>
              <div className="flex flex-col md:flex-row gap-2 md:gap-4 text-gray-600 mb-4">
                <span className="flex items-center justify-center md:justify-start gap-2">
                  <FiUser className="h-4 w-4" />
                  {userType === "admin" && `Employee ID: ${profile.employeeId}`}
                  {userType === "faculty" && `Employee ID: ${profile.employeeId}`}
                  {userType === "student" && `Enrollment No: ${profile.enrollmentNo}`}
                </span>
              </div>
              <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                {profile.role || userType.charAt(0).toUpperCase() + userType.slice(1)}
              </div>
            </div>
          </div>
        </div>

        {/* Information Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {/* Personal Information */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <FiUser className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Personal Information</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <FiMail className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium text-gray-900">{profile.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <FiPhone className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium text-gray-900">{profile.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <FiUser className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Gender</p>
                  <p className="font-medium text-gray-900 capitalize">{profile.gender}</p>
                </div>
              </div>
              {profile.bloodGroup && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="h-4 w-4 bg-red-500 rounded-full"></div>
                  <div>
                    <p className="text-sm text-gray-500">Blood Group</p>
                    <p className="font-medium text-gray-900">{profile.bloodGroup}</p>
                  </div>
                </div>
              )}
              {profile.dateOfBirth && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <FiCalendar className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Date of Birth</p>
                    <p className="font-medium text-gray-900">
                      {new Date(profile.dateOfBirth).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )}
              {profile.joiningDate && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <FiCalendar className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Joining Date</p>
                    <p className="font-medium text-gray-900">
                      {new Date(profile.joiningDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )}
              {profile.salary && (
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <FiDollarSign className="h-4 w-4 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-500">Salary</p>
                    <p className="font-medium text-green-700">₹{profile.salary.toLocaleString()}</p>
                  </div>
                </div>
              )}
              {profile.status && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className={`h-3 w-3 rounded-full ${profile.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <p className={`font-medium capitalize ${profile.status === 'active' ? 'text-green-700' : 'text-red-700'}`}>
                      {profile.status}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Address Information */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <FiMapPin className="h-5 w-5 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Address Information</h3>
            </div>
            <div className="space-y-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Address</p>
                <p className="font-medium text-gray-900">{profile.address}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">City</p>
                  <p className="font-medium text-gray-900">{profile.city}</p>
                </div>
                {profile.state && (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500 mb-1">State</p>
                    <p className="font-medium text-gray-900">{profile.state}</p>
                  </div>
                )}
              </div>
              {profile.pincode && (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Pincode</p>
                  <p className="font-medium text-gray-900">{profile.pincode}</p>
                </div>
              )}
            </div>
          </div>

          {/* Emergency Contact */}
          {profile.emergencyContact && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <FiUsers className="h-5 w-5 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Emergency Contact</h3>
              </div>
              <div className="space-y-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Name</p>
                  <p className="font-medium text-gray-900">{profile.emergencyContact.name}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Relationship</p>
                  <p className="font-medium text-gray-900 capitalize">{profile.emergencyContact.relationship}</p>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <FiPhone className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium text-gray-900">{profile.emergencyContact.phone}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Academic Information for Students */}
          {userType === "student" && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <FiBook className="h-5 w-5 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Academic Information</h3>
              </div>
              <div className="space-y-4">
                {profile.branch && (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500 mb-1">Branch</p>
                    <p className="font-medium text-gray-900">{profile.branch}</p>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  {profile.semester && (
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-500 mb-1">Semester</p>
                      <p className="font-medium text-gray-900">{profile.semester}</p>
                    </div>
                  )}
                  {profile.year && (
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-500 mb-1">Year</p>
                      <p className="font-medium text-gray-900">{profile.year}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;