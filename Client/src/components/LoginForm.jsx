import React, { useState } from 'react';
import { Button, Checkbox, Form, Input, Typography, message } from 'antd';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import "../styles/login-register.css";
import loginImage from "../images/login.png";
import facebook from "../images/facebook.png";
import google from "../images/google.png";
import apple from "../images/apple.png";
import logo from "../images/logo.webp";
import { baseUrl } from '../App';

const { Text } = Typography;

const LoginForm = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const onFinish = async (formData) => {
        setLoading(true);
        try {
            const response = await axios.post(`${baseUrl}/user/login`, formData);
            message.success(response.data.message);
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('userId', response.data.userId);
            navigate('/dashboard/home');
        } catch (error) {
            if (error.response && error.response.data) {
                message.error(error.response.data.message);
            } else {
                message.error("An unexpected error occurred. Please try again later.");
            }
        }
        setLoading(false);
    };

    return (
        <div className="body-container">
            <div className='form-container'>
                <div className="product-logo">
                    <img src={logo} alt="Logo" />
                </div>
                <div className="form-content">
                <div className="form-image" style={{ backgroundImage: `url(${loginImage})` }}></div>
                    <div className="form-data">
                        <h2 className="form-heading">Login</h2>
                        <p className="form-description">Login to access Your travelwise account</p>
                        <Form name="signInForm" form={form} onFinish={onFinish} layout="vertical">
                            <Form.Item name="email" rules={[{ required: true, message: 'Please enter your email!' }]}>
                                <Input placeholder="Enter Your Email" />
                            </Form.Item>
                            <Form.Item name="password" rules={[{ required: true, message: 'Please enter your password!' }]}>
                                <Input.Password placeholder="Enter password" />
                            </Form.Item>
                            <div className="forgot-remember-container">
                                <Checkbox className="remember-me">Remember Me</Checkbox>
                                <Link to="/forgot-password" className='forgot-password-link'>Forgot Password</Link>
                            </div>
                            <Form.Item>
                                <Button type="primary" className="form-button" loading={loading} htmlType="submit"> Login </Button>
                            </Form.Item>

                            <div className="account-link-container">
                                <Text className="account-link-text">Don't have an account?</Text>
                                <Link to="/register" className='form-link-btn'>Sign Up</Link>
                            </div>

                            <div className="divider">
                                <span className="divider-text">Or login with</span>
                            </div>

                            <div className="social-icons">
                                <div className="social-icon">
                                    <img src={facebook} alt="Facebook" />
                                </div>
                                <div className="social-icon">
                                    <img src={google} alt="Google" />
                                </div>
                                <div className="social-icon">
                                    <img src={apple} alt="Apple" />
                                </div>
                            </div>
                        </Form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;
