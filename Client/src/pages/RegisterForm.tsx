import { useState } from 'react';
import { Form, Input, Button, message, Typography, Checkbox } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import loginImage from "../images/login.svg";
import logoImage from "../images/logo.png";
import { baseURL } from '../App';

const { Text, Title } = Typography;

interface RegisterFormValues {
    fullname: string;
    email: string;
    phoneNumber: string;
    password: string;
    confirmPassword: string;
    agreement: boolean;
}

interface OtpFormValues {
    verificationOTP: string;
}

const RegisterForm = () => {
    const [registerForm] = Form.useForm();
    const [otpForm] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [formData, setFormData] = useState<RegisterFormValues | {}>({});
    const navigate = useNavigate();

    const sendVerificationOTP = async (values: RegisterFormValues) => {
        setLoading(true);
        try {
            const response = await axios.post(`${baseURL}/user/sendVerificationOTP`, values);
            message.success(response.data.message);
            setFormData(values);
            setOtpSent(true);
        } catch (error: any) {
            if (error.response && error.response.data) {
                message.error(error.response.data.message);
            } else {
                message.error("An unexpected error occurred. Please try again later.");
            }
        }
        setLoading(false);
    };

    const handleRegister = async (otpValues: OtpFormValues) => {
        setLoading(true);
        try {
            const combinedData = { ...(formData as RegisterFormValues), ...otpValues };
            const response = await axios.put(`${baseURL}/user/register/${(formData as RegisterFormValues).email}`, combinedData);
            message.success(response.data.message);
            navigate('/login');
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
                <h2 className="text-xl font-semibold">Get Started with Swanirbhar</h2>
                <p className="mb-6 text-gray-600 text-center text-sm">Join our community of 1L+ Learners</p>
                {!otpSent ? (
                    <Form form={registerForm} onFinish={sendVerificationOTP} layout="vertical" className="w-full max-w-xs">
                        <Form.Item name="fullName" rules={[{ required: true, message: 'Full name is required' }]}>
                            <Input className='w-full' placeholder="Full name" />
                        </Form.Item>
                        <Form.Item name="email" rules={[
                            { required: true, message: 'Email is required' },
                            { type: 'email', message: 'Invalid email format' }
                        ]}>
                            <Input className='w-full' placeholder="Email" />
                        </Form.Item>
                        <Form.Item name="password" rules={[
                            { required: true, message: 'Password is required' },
                            { min: 8, message: 'Password must be at least 8 characters' }
                        ]}>
                            <Input.Password className='w-full' placeholder="Password" />
                        </Form.Item>
                        <Form.Item name="confirmPassword" dependencies={['password']} hasFeedback
                            rules={[
                                { required: true, message: 'Please confirm your password' },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('password') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('The two passwords do not match'));
                                    },
                                }),
                            ]}>
                            <Input.Password className='w-full' placeholder="Confirm password" />
                        </Form.Item>
                        <Form.Item
                            name="agreement"
                            valuePropName="checked"
                            rules={[
                                { validator: (_, value) => value ? Promise.resolve() : Promise.reject(new Error('You must accept the agreement')) },
                            ]}>
                            <Checkbox className="text-gray-600">
                                I agree to the <a href="#" className="text-purple-800 font-bold">Terms</a> and <a href="#" className="text-purple-800 font-bold">Privacy Policies</a>
                            </Checkbox>
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-md" loading={loading} htmlType="submit">
                                Create Account
                            </Button>
                        </Form.Item>
                    </Form>
                ) : (
                    <Form form={otpForm} onFinish={handleRegister} layout="vertical" className="w-full max-w-sm">
                        <Form.Item name="verificationOTP" rules={[{ required: true, message: 'Please input the OTP sent to your email!' }]}>
                            <Input.OTP className='w-full' />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-md" loading={loading} htmlType="submit">
                                Verify Code
                            </Button>
                        </Form.Item>
                    </Form>
                )}
                <div className="text-center">
                    <Text className="text-gray-600">Already have an account?</Text>
                    <Link to="/signin" className="text-purple-800 font-bold ml-2">Sign In</Link>
                </div>
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

export default RegisterForm;
