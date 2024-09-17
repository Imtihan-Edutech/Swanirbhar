import { useState } from 'react';
import { Button, Checkbox, Form, Input, Typography, message } from 'antd';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import loginImage from "../images/login.svg";
import logoImage from "../images/logo.png";
import { baseURL } from '../App';

const { Text, Title } = Typography;

const LoginForm = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const onFinish = async (formData: any) => {
        setLoading(true);
        try {
            const response = await axios.post(`${baseURL}/user/login`, formData);
            message.success(response.data.message);
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('userId', response.data.userId);
            localStorage.setItem('role', response.data.role);
            navigate('/dashboard');
        } catch (error: any) {
            if (error.response && error.response.data) {
                message.error(error.response.data.message);
            } else {
                message.error("An unexpected error occurred. Please try again later.");
            }
        }
        setLoading(false);
    };

    return (
        <div className="flex flex-col-reverse md:flex-row w-full h-auto md:h-[100vh]">
            <div className="md:w-1/3 bg-[#f0f0f0] p-8 flex flex-col justify-center items-center">
                <img src={logoImage} alt="Logo" className="w-32 mb-4" />
                <h2 className="text-xl font-semibold text-center lg:text-start">Get Started with Swanirbhar</h2>
                <p className="mb-6 text-gray-600 text-center text-sm">Join our community of 1L+ Learners</p>
                <Form
                    name="signInForm"
                    form={form}
                    onFinish={onFinish}
                    layout="vertical"
                    className="w-full max-w-xs"
                >
                    <Form.Item
                        name="email"
                        rules={[{ required: true, message: 'Please enter your email!' }]}
                    >
                        <Input
                            placeholder="Enter Your Email"
                            className="w-full"
                        />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: 'Please enter your password!' }]}
                    >
                        <Input.Password
                            placeholder="Enter password"
                            className="w-full"
                        />
                    </Form.Item>
                    <div className="flex justify-between items-center mb-4">
                        <Checkbox>Remember Me</Checkbox>
                        <Link to="/forgot-password" className="text-purple-800 font-bold">Forgot Password?</Link>
                    </div>
                    <Form.Item>
                        <Button
                            type="primary"
                            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md"
                            loading={loading}
                            htmlType="submit"
                        >
                            Login
                        </Button>
                    </Form.Item>
                    <div className="text-center mt-4">
                        <Text className="text-gray-600">Don't have an account?</Text>
                        <Link to="/signup" className="text-purple-800 font-bold ml-2">Sign Up</Link>
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

export default LoginForm;
