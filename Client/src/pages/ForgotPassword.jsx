import React, { useState } from 'react';
import { Button, Form, Input, Typography, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from '../images/logo.webp';
import forgotPassword from '../images/forgot-Password.png';
import facebook from '../images/facebook.png';
import google from '../images/google.png';
import apple from '../images/apple.png';
import { baseUrl } from '../App';

const { Text } = Typography;

const ForgotPassword = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const sendResetPasswordOTP = async (values) => {
        setLoading(true);
        try {
            const response = await axios.put(`${baseUrl}/user/sendResetPasswordOTP`, { email: values.email });
            message.success(response.data.message);
            navigate(`/verify-otp?email=${encodeURIComponent(values.email)}`);
        } catch (error) {
            if (error.response && error.response.data) {
                message.error(error.response.data.message);
            }
        }
        setLoading(false);
    };

    return (
        <div className="body-container">
            <div className="form-container">
                <div className="product-logo">
                    <img src={logo} alt="Logo" />
                </div>
                <div className="form-content">
                    <div className="form-image" style={{ backgroundImage: `url(${forgotPassword})` }}></div>
                    <div className="form-data">
                        <h2 className="form-heading">Forgot Your Password?</h2>
                        <p className="form-description">
                            Don’t worry, happens to all of us. Enter your email below to recover your password
                        </p>
                        <Form form={form} layout="vertical" onFinish={sendResetPasswordOTP}>
                            <Form.Item
                                name="email"
                                rules={[{ required: true, message: 'Please enter your email!' }]}
                            >
                                <Input className="form-input" placeholder="Enter Your Email" />
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" className="form-button" loading={loading} htmlType="submit">
                                    Submit
                                </Button>
                            </Form.Item>
                            <div className="account-link-container">
                                <Text className="account-link-text">Remember your password?</Text>
                                <Link to="/login" className="form-link-btn">
                                    Log In
                                </Link>
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

export default ForgotPassword;
