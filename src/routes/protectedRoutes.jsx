import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useUser";

const PrivateRoutes = () => {
  const { user } = useAuth();

  if (user === undefined) {
    return null; // Wait until the user data loads
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default PrivateRoutes;
