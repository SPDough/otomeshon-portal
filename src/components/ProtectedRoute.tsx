import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { CircularProgress, Box } from "@mui/material";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  // Demo mode: allow access without authentication for showcase
  return <>{children}</>;
};

export default ProtectedRoute;
