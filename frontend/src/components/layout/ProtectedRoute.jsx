import { Navigate, useLocation } from "react-router-dom"
import { isValidToken } from "../../services/authService"

function ProtectedRoute({children}){
    const location = useLocation();
    
    if (!isValidToken()) {
        return <Navigate to="/login" state={{from: location}} replace/>
    }
    return children;
}

export default ProtectedRoute