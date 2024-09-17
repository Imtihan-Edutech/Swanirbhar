import { Routes, Route, Navigate } from "react-router-dom";
import LoginForm from "../pages/LoginForm";
import RegisterForm from "../pages/RegisterForm";
import ForgotPassword from "../pages/ForgotPassword";
import VerifyCode from "../pages/VerifyCode";
import ResetPassword from "../pages/Resetpassword";
import PrivateRoute from "./PrivateRoute";
import Dashboard from "../components/Dashboard";



const AllRoutes = () => {
    const isUser = localStorage.getItem("token") && localStorage.getItem("userId");

    return (
        <Routes>
            <Route path="/" element={isUser ? <Navigate to="/dashboard" /> : <Navigate to='/signin' />} />
            <Route path="/signin" element={<LoginForm />} />
            <Route path="/signup" element={<RegisterForm />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/verify-otp" element={<VerifyCode />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/*" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        </Routes>
    );
}

export default AllRoutes;
