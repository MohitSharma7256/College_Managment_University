import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Toaster, toast } from "react-hot-toast";
import { FiLogIn, FiEye, FiEyeOff, FiUser, FiLock } from "react-icons/fi";
import axiosWrapper from "../utils/AxiosWrapper";
import { setUserToken, setUserData } from "../redux/actions";

// User types for login
const USER_TYPES = {
  STUDENT: "Student",
  FACULTY: "Faculty", 
  ADMIN: "Admin",
};

// Login form component
const LoginForm = ({ selected, onSubmit, formData, setFormData, showPassword, setShowPassword }) => (
  <div className="card shadow-lg" style={{ maxWidth: '400px', margin: '0 auto' }}>
    <div className="card-body p-4">
      <form onSubmit={onSubmit}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label fw-medium">
            {selected} Email
          </label>
          <div className="input-group">
            <span className="input-group-text bg-light">
              <FiUser className="text-muted" />
            </span>
            <input
              type="email"
              id="email"
              required
              className="form-control"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
        </div>
        
        <div className="mb-3">
          <label htmlFor="password" className="form-label fw-medium">
            Password
          </label>
          <div className="input-group">
            <span className="input-group-text bg-light">
              <FiLock className="text-muted" />
            </span>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              required
              className="form-control"
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="btn btn-outline-secondary"
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>
        </div>
        
        <div className="mb-3">
          <Link
            to="/forget-password"
            className="text-decoration-none small"
          >
            Forgot Password?
          </Link>
        </div>
        
        <button 
          type="submit" 
          className="btn btn-primary w-100 py-2 fw-medium"
        >
          <FiLogIn className="me-2" />
          Sign In
        </button>
      </form>
    </div>
  </div>
);

// User type selector
const UserTypeSelector = ({ selected, onSelect }) => (
  <div className="d-flex justify-content-center gap-2 mb-4">
    {Object.values(USER_TYPES).map((type) => (
      <button
        key={type}
        onClick={() => onSelect(type)}
        className={`btn ${selected === type ? 'btn-primary' : 'btn-outline-primary'} btn-sm`}
      >
        {type}
      </button>
    ))}
  </div>
);

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const type = searchParams.get("type");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [selected, setSelected] = useState(USER_TYPES.STUDENT);
  const [showPassword, setShowPassword] = useState(false);

  // Set user type from URL params if available
  useEffect(() => {
    if (type && Object.values(USER_TYPES).includes(type)) {
      setSelected(type);
    }
  }, [type]);

  const handleUserTypeSelect = (type) => {
    setSelected(type);
    setSearchParams({ type });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      toast.loading("Logging in...");
      
      // Different API endpoints for different user types
      let endpoint = "";
      switch (selected) {
        case USER_TYPES.ADMIN:
          endpoint = "/admin/login";
          break;
        case USER_TYPES.FACULTY:
          endpoint = "/faculty/login";
          break;
        case USER_TYPES.STUDENT:
          endpoint = "/student/login";
          break;
        default:
          throw new Error("Invalid user type");
      }

      const response = await axiosWrapper.post(endpoint, formData);
      
      if (response.data.success) {
        dispatch(setUserToken(response.data.data.token));
        localStorage.setItem("userToken", response.data.data.token);
        localStorage.setItem("userType", selected);
        
        toast.success("Login successful!");
        
        // Navigate based on user type
        if (selected === USER_TYPES.ADMIN) {
          navigate("/admin");
        } else if (selected === USER_TYPES.FACULTY) {
          navigate("/faculty");
        } else {
          navigate("/student");
        }
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      toast.dismiss();
    }
  };

  useEffect(() => {
    const userToken = localStorage.getItem("userToken");
    if (userToken) {
      navigate(`/${localStorage.getItem("userType").toLowerCase()}`);
    }
  }, [navigate]);

  return (
    <div className="min-vh-100 bg-light d-flex align-items-center justify-content-center p-4">
      <div className="container-fluid" style={{ maxWidth: '500px' }}>
        {/* Header */}
        <div className="text-center mb-4">
          <div className="d-inline-flex align-items-center justify-content-center bg-primary rounded-circle mb-3" style={{ width: '64px', height: '64px' }}>
            <FiUser className="text-white" size={32} />
          </div>
          <h1 className="h2 fw-bold text-dark mb-2">
            College Management System
          </h1>
          <p className="text-muted">
            Sign in to your {selected.toLowerCase()} account
          </p>
        </div>

        {/* User Type Selector */}
        <UserTypeSelector selected={selected} onSelect={handleUserTypeSelect} />

        {/* Login Form */}
        <LoginForm
          selected={selected}
          onSubmit={handleSubmit}
          formData={formData}
          setFormData={setFormData}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
        />

        {/* Footer */}
        <div className="text-center mt-4">
          <p className="small text-muted">
            Secure login powered by College Management System
          </p>
        </div>
      </div>
      <Toaster position="top-center" />
    </div>
  );
};

export default Login;
