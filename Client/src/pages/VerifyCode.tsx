import { useState } from 'react';
import { Button, Form, Input, Typography, message } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { baseURL } from '../App';
import loginImage from "../images/login.svg";
import logoImage from "../images/logo.png";

const { Text, Title } = Typography;

const VerifyCode = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(false);
    const [reSendLoading, setReSendLoading] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const email = new URLSearchParams(location.search).get('email');

    if (!email) {
        message.error("Email parameter is missing.");
        navigate('/signin');
        return null;
    }

    const handleVerify = async (values: any) => {
        setLoading(true);
        const { resetPasswordOTP } = values;
        try {
            const response = await axios.post(`${baseURL}/user/verifyOTP/${email}`, { resetPasswordOTP });
            message.success(response.data.message);
            navigate(`/reset-password?email=${encodeURIComponent(email)}`);
        } catch (error: any) {
            if (error.response && error.response.data) {
                message.error(error.response.data.message);
            } else {
                message.error("An unexpected error occurred. Please try again later.");
            }
        }
        setLoading(false);
    };

    const handleResend = async () => {
        setReSendLoading(true);
        setDisabled(true);
        setCountdown(60);

        try {
            const response = await axios.put(`${baseURL}/user/sendResetPasswordOTP`, { email });
            message.success(response.data.message);
        } catch (error: any) {
            if (error.response && error.response.data) {
                message.error(error.response.data.message);
            } else {
                message.error("An unexpected error occurred. Please try again later.");
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
        <div className="flex flex-col-reverse md:flex-row w-full h-auto md:h-[100vh]">
            <div className="md:w-1/3 bg-[#f0f0f0] p-8 flex flex-col justify-center items-center">
                <img src={logoImage} alt="Logo" className="w-32 mb-4" />
                <h2 className="text-xl font-semibold">Get Started with Swanirbhar</h2>
                <p className="mb-6 text-gray-600 text-center text-sm">Join our community of 1L+ Learners</p>
                <Form form={form} layout="vertical" onFinish={handleVerify} className="w-full max-w-sm">
                    <Form.Item
                        name="resetPasswordOTP"
                        rules={[{ required: true, message: 'Please enter OTP!' }]}
                    >
                        <Input.OTP
                            className="w-full"
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button
                            type="primary"
                            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md"
                            loading={loading}
                            htmlType="submit"
                        >
                            Verify
                        </Button>
                    </Form.Item>
                    <div className="text-center">
                        <Text className="text-gray-600">Didn’t receive a code?</Text>
                        <Button
                            type="link"
                            className="text-purple-800 font-bold "
                            onClick={handleResend}
                            loading={reSendLoading}
                            disabled={disabled}
                        >
                            {countdown > 0 ? `Resend (${countdown}s)` : 'Resend'}
                        </Button>
                    </div>
                </Form>
            </div>
            <div className="md:w-2/3 p-8 bg-[#ffffff] flex flex-col">
                <Title level={2} className="text-center lg:text-start">Welcome to Swanirbhar</Title>
                <Text className="mb-8 text-gray-600 font-semibold text-center lg:text-start">
                    Swanirbhar is one of India's largest learner's communities, offering a dynamic platform designed to foster personal and academic growth. Through our extensive network, members can explore diverse learning opportunities, connect with like-minded individuals, and enhance their skills and career prospects. Join us to be a part of an engaging community that supports and empowers learners across various fields.
                </Text>
                <img src={loginImage} alt="Login" className="object-contain rounded-2xl w-full" />
            </div>
        </div>
    );
};

export default VerifyCode;
