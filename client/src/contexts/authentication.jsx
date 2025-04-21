
import React, { useState } from "react";
import axios from "axios";

const AuthContext = React.createContext();

function AuthProvider(props) {
  const [state, setState] = useState({
    loading: null,
    error: null,
    user: null,
  });

  const login = async (username, password) => {
    try {
      setState({ ...state, loading: true, error: null });
      
      const response = await axios.post("http://localhost:4000/auth/login", { 
        username, 
        password 
      });
      
      localStorage.setItem("token", response.data.token);
      setState({ 
        loading: false, 
        error: null, 
        user: {
          username,
          id: response.data.id,
          firstName: response.data.firstName,
          lastName: response.data.lastName
        }
      });
      
      return { success: true, data: response.data };
    } catch (error) {
      setState({ 
        ...state, 
        loading: false, 
        error: error.response?.data?.message || "Failed to login" 
      });
      
      return { 
        success: false, 
        error: error.response?.data?.message || "Failed to login"
      };
    }
  };

  const register = async (username, password, firstName, lastName) => {
    try {
      setState({ ...state, loading: true, error: null });
      
      const response = await axios.post("http://localhost:4000/auth/register", {
        username,
        password,
        firstName,
        lastName
      });
      
      setState({ ...state, loading: false });
      
      return { success: true, data: response.data };
    } catch (error) {
      setState({ 
        ...state, 
        loading: false, 
        error: error.response?.data?.message || "Failed to register" 
      });
      
      return {
        success: false,
        error: error.response?.data?.message || "Failed to register"
      };
    }
  };

  const logout = () => {
    // ลบ JWT Token ออกจาก Local Storage
    localStorage.removeItem("token");
    
    // รีเซ็ตข้อมูลผู้ใช้ใน state
    setState({
      loading: false,
      error: null,
      user: null
    });
  };

  const isAuthenticated = Boolean(localStorage.getItem("token"));

  return (
    <AuthContext.Provider
      value={{ state, login, logout, register, isAuthenticated }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}

// this is a hook that consume AuthContext
const useAuth = () => React.useContext(AuthContext);

export { AuthProvider, useAuth };