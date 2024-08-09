import React, { useEffect, useState } from 'react';
import verifyCode from "../images/verifyCode.svg";
import { Button, Form, Input, Typography, message } from 'antd';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { baseUrl } from '../App';

const { Text } = Typography;

const VerifyCode = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(false);
    const [reSendLoading, setReSendLoading] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const email = new URLSearchParams(location.search).get('email');

    const handleVerify = async (values) => {
        setLoading(true);
        const { resetPasswordOTP } = values;
        try {
            const response = await axios.post(`${baseUrl}/user/verifyOTP/${email}`, { resetPasswordOTP });
            message.success(response.data.message);
            navigate(`/reset-password?email=${encodeURIComponent(email)}`);
        } catch (error) {
            if (error.response && error.response.data) {
                message.error(error.response.data.message);
            }
        }
        setLoading(false);
    };

    const handleResend = async () => {
        setReSendLoading(true);
        setDisabled(true);
        setCountdown(60);

        try {
            const response = await axios.put(`${baseUrl}/user/sendResetPasswordOTP`, { email });
            message.success(response.data.message);
        } catch (error) {
            if (error.response && error.response.data) {
                message.error(error.response.data.message);
            }
        }
        setReSendLoading(false);

        const intervalId = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(intervalId);
                    setDisabled(false);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    return (
        <div className="body-container">
            <div className='form-container'>
                <div className="image-container">
                    <img src={verifyCode} alt="Logo" />
                </div>

                <div className="form-data">
                        <div className='back-to-login-container'>
                            <Link className='back-to-login' to="/login">
                                <span className='arrow'>&lt;</span>
                                Back to login
                            </Link>
                        </div>
                        <h2 className="form-heading">Verify Code</h2>
                        <p className="form-description">An authentication code has been sent to your email.</p>
                        <Form form={form} layout="vertical" onFinish={handleVerify}>
                            <Form.Item
                                name="resetPasswordOTP"
                                rules={[{ required: true, message: 'Please enter OTP!' }]}
                            >
                                <Input.OTP className="form-input" placeholder="Enter Code" />
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" className="form-button" loading={loading} htmlType="submit">Verify</Button>
                            </Form.Item>
                            <div className="resend-container">
                                <Text className="account-link-text">Didn’t receive a code?</Text>
                                <Button
                                    type='link'
                                    className='form-link-btn'
                                    onClick={handleResend}
                                    loading={reSendLoading}
                                    disabled={disabled}
                                >
                                    {countdown > 0 ? `Resend (${countdown}s)` : 'Resend'}
                                </Button>
                            </div>
                        </Form>
                    </div>
            </div>
        </div>
    );
};

export default VerifyCode;
