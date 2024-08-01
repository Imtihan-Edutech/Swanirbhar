
import { Navigate } from 'react-router-dom';

let isAuth = null;
const PrivateRoute = ({ children }) => {
    isAuth = (localStorage.getItem("token") && localStorage.getItem("userId"))
    return isAuth ? children : <Navigate to="/login" replace />;
}

export { isAuth }; 

export default PrivateRoute;
