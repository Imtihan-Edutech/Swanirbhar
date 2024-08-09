import React, { useState } from 'react';
import { Form, Input, Button, message, Typography, Checkbox } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import "../styles/login-register.css";
import { baseUrl } from '../App';
import registerImage from "../images/register.svg";

const { Text } = Typography;

const RegisterForm = () => {
    const [registerForm] = Form.useForm();
    const [otpForm] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [formData, setFormData] = useState({});
    const navigate = useNavigate();

    const sendVerificationOTP = async (values) => {
        setLoading(true);
        try {
            const response = await axios.post(`${baseUrl}/user/sendVerificationOTP`, values);
            message.success(response.data.message);
            setFormData(values);
            setOtpSent(true);
        } catch (error) {
            if (error.response && error.response.data) {
                message.error(error.response.data.message);
            }
        }
        setLoading(false);
    };

    const handleRegister = async (otpValues) => {
        setLoading(true);
        try {
            const combinedData = { ...formData, ...otpValues };
            const response = await axios.put(`${baseUrl}/user/register/${formData.email}`, combinedData);
            message.success(response.data.message);
            navigate('/login');
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
                <div className="image-container">
                    <img src={registerImage} alt="" />
                </div>

                <div className="form-data">
                    <h2 className="form-heading">Sign Up</h2>
                    <p className="form-description">Let’s get you all set up so you can access your personal account.</p>
                    {!otpSent ? (
                        <Form form={registerForm} onFinish={sendVerificationOTP} layout="vertical">
                            <div className="form-row">
                                <Form.Item name="firstname" rules={[{ required: true, message: 'First name is required' }]} style={{ flex: "1" }}>
                                    <Input className='form-input-field' placeholder="First name" />
                                </Form.Item>
                                <Form.Item name="lastname" rules={[{ required: true, message: 'Last name is required' }]} style={{ flex: "1" }}>
                                    <Input className='form-input' placeholder="Last name" />
                                </Form.Item>
                            </div>
                            <div className="form-row">
                                <Form.Item name="email" rules={[
                                    { required: true, message: 'Email is required' },
                                    { type: 'email', message: 'Invalid email format' }
                                ]} style={{ flex: "1" }}>
                                    <Input placeholder="Email" />
                                </Form.Item>
                                <Form.Item name="phoneNumber" style={{ flex: "1" }} rules={[
                                    { required: true, message: 'Phone number is required' },
                                    { len: 10, message: 'Phone number must consist of 10 digits' }
                                ]}>
                                    <Input placeholder="Phone number" />
                                </Form.Item>
                            </div>
                            <Form.Item name="password" rules={[
                                { required: true, message: 'Password is required' },
                                { min: 8, message: 'Password must be at least 8 characters' }
                            ]}>
                                <Input.Password placeholder="Password" />
                            </Form.Item>
                            <Form.Item name="confirmPassword" dependencies={['password']} hasFeedback
                                rules={[
                                    { required: true, message: 'Please confirm your password' },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (!value || getFieldValue('password') === value) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject();
                                        },
                                    }),
                                ]}>
                                <Input.Password placeholder="Confirm password" />
                            </Form.Item>
                            <Form.Item
                                name="agreement"
                                valuePropName="checked"
                                rules={[
                                    { validator: (_, value) => value ? Promise.resolve() : Promise.reject(new Error('You must accept the agreement')) },
                                ]}>
                                <Checkbox className="agreement">
                                    I agree to the <a href="#">Terms</a> and <a href="#">Privacy Policies</a>
                                </Checkbox>
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" className="form-button" loading={loading} htmlType="submit">
                                    Create Account
                                </Button>
                            </Form.Item>
                        </Form>
                    ) : (
                        <Form form={otpForm} onFinish={handleRegister} layout="vertical">
                            <Form.Item name="verificationOTP" rules={[{ required: true, message: 'Please input the OTP sent to your email!' }]}>
                                <Input.OTP placeholder="Enter OTP" />
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" className="form-button" loading={loading} htmlType="submit">
                                    Verify Code
                                </Button>
                            </Form.Item>
                        </Form>
                    )}

                    <div className="account-link-container">
                        <Text className="account-link-text">Already have an account?</Text>
                        <Link to="/login" className="form-link-btn">Login</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterForm;
