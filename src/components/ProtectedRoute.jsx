import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { UserAuthContext } from "../context/UserAuthContext";

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const { isLoggedIn } = useContext(UserAuthContext);
  return isLoggedIn ? children : <Navigate to={location.pathname} />;
};

export default ProtectedRoute;
