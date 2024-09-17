import { Navigate } from 'react-router-dom';

let isAuth = null;
const PrivateRoute = ({ children }:any) => {
    isAuth = (localStorage.getItem("token") && localStorage.getItem("userId"))
    return isAuth ? children : <Navigate to="/signin" replace />;
}

export { isAuth }; 
export default PrivateRoute;
