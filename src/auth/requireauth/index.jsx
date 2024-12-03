import  { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

const RequireAuth = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const token = Cookies.get("token");
  useEffect(() => {
    if(!token){
      setIsAuthenticated(false);
    }else{
      setIsAuthenticated(true);
    }
      
      
  }, [token]);

  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default RequireAuth;
