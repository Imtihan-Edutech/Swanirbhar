import React from 'react';
import { Routes, Route, Navigate } from "react-router-dom";
import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";
import ForgotPassword from '../pages/ForgotPassword';
import Dashboard from '../components/Dashboard';
import PrivateRoute from './PrivateRoutes';
import VerifyCode from '../pages/VerifyCode';
import SetPassword from '../pages/SetPassword';
import Landing from '../components/Landing';


const AllRoutes = () => {
    const isUser = localStorage.getItem("token") && localStorage.getItem("userId");

    return (
        <Routes>
            <Route path="/" element={isUser ? <Navigate to="/dashboard" /> : <Landing />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/verify-otp" element={<VerifyCode />} />
            <Route path="/reset-password" element={<SetPassword />} />
            <Route path="/*" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        </Routes>
    );
}

export default AllRoutes;
