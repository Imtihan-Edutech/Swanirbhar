import { useState } from 'react';
import { Button, Form, Input, message, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import loginImage from "../images/login.svg";
import logoImage from "../images/logo.png";
import { baseURL } from '../App';

const { Text, Title } = Typography;

const ResetPassword = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const email = new URLSearchParams(location.search).get('email');

    const onFinish = async (values: any) => {
        setLoading(true);
        try {
            const response = await axios.put(`${baseURL}/user/resetPassword`, { email, newPassword: values.newPassword });
            message.success(response.data.message);
            navigate('/signin');
        } catch (error: any) {
            message.error(error.response.data.message);
        }
        setLoading(false);
    };

    return (
        <div className="flex flex-col-reverse md:flex-row w-full h-auto md:h-[100vh]">
            <div className="md:w-1/3 bg-[#f0f0f0] p-8 flex flex-col justify-center items-center">
                <img src={logoImage} alt="Logo" className="w-32 mb-4" />
                <h2 className="text-xl font-semibold">Get Started with Swanirbhar</h2>
                <p className="mb-6 text-gray-600 text-center text-sm">Join our community of 1L+ Learners</p>
                <Form form={form} layout="vertical" onFinish={onFinish} className="w-full max-w-sm">
                    <Form.Item
                        name="newPassword"
                        rules={[
                            { required: true, message: 'Required Field' },
                            { min: 8, message: 'Must have at least 8 characters' }
                        ]}
                    >
                        <Input.Password className="w-full" placeholder="New Password" />
                    </Form.Item>
                    <Form.Item
                        name="confirmPassword"
                        dependencies={['newPassword']}
                        hasFeedback
                        rules={[
                            { required: true, message: 'Required Field' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('newPassword') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject('The two passwords do not match.');
                                },
                            }),
                        ]}
                    >
                        <Input.Password className="w-full" placeholder="Confirm Password" />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md" loading={loading} htmlType="submit">Set Password</Button>
                    </Form.Item>
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

export default ResetPassword;
