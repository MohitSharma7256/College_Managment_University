import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Toaster, toast } from "react-hot-toast";
import { FiLogIn, FiEye, FiEyeOff } from "react-icons/fi";
import CustomButton from "../components/CustomButton";
import axiosWrapper from "../utils/AxiosWrapper";

// User types for login
const USER_TYPES = {
  STUDENT: "Student",
  FACULTY: "Faculty", 
  ADMIN: "Admin",
};

// Login form component
const LoginForm = ({ selected, onSubmit, formData, setFormData, showPassword, setShowPassword }) => (
  <form className="card" onSubmit={onSubmit}>
    <div className="mb-6">
      <label htmlFor="email" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
        {selected} Email
      </label>
      <input
        type="email"
        id="email"
        required
        className="form-control"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
      />
    </div>
    <div className="mb-6">
      <label htmlFor="password" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
        Password
      </label>
      <div style={{ position: 'relative' }}>
        <input
          type={showPassword ? "text" : "password"}
          id="password"
          required
          className="form-control"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          style={{ paddingRight: '2.5rem' }}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          style={{
            position: 'absolute',
            right: '0.75rem',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#6b7280',
            padding: '0.25rem'
          }}
        >
          {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
        </button>
      </div>
    </div>
    <div className="mb-6">
      <Link
        to="/forget-password"
        style={{ color: '#3b82f6', textDecoration: 'none', fontSize: '0.875rem' }}
      >
        Forgot Password?
      </Link>
    </div>
    <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
      <FiLogIn />
      Login
    </button>
  </form>
);

// User type selector
const UserTypeSelector = ({ selected, onSelect }) => (
  <div className="flex justify-center gap-4 mb-6">
    {Object.values(USER_TYPES).map((type) => (
      <button
        key={type}
        onClick={() => onSelect(type)}
        className={selected === type ? "btn btn-primary" : "btn btn-secondary"}
        style={{ minWidth: '80px' }}
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
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#f8f9fa', padding: '1rem' }}>
      <div className="container" style={{ maxWidth: '400px' }}>
        <div className="text-center mb-6">
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#1f2937' }}>
            College Management System
          </h1>
          <p style={{ color: '#6b7280', fontSize: '1rem' }}>
            {selected} Login
          </p>
        </div>
        <UserTypeSelector selected={selected} onSelect={handleUserTypeSelect} />
        <LoginForm
          selected={selected}
          onSubmit={handleSubmit}
          formData={formData}
          setFormData={setFormData}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
        />
      </div>
      <Toaster position="bottom-center" />
    </div>
  );
};

export default Login;
