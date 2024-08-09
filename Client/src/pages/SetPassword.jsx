import React, { useState } from 'react';
import resetPassword from "../images/resetPassword.svg";
import { Button, Form, Input, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { baseUrl } from '../App';


const SetPassword = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const email = new URLSearchParams(location.search).get('email');

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const response = await axios.put(`${baseUrl}/user/resetPassword`, { email, newPassword: values.newPassword });
            message.success(response.data.message);
            navigate('/login');
        } catch (error) {
            message.error(error.response.data.message);
        }
        setLoading(false);
    };

    return (
        <div className="body-container">
            <div className='form-container'>
                <div className="image-container">
                    <img src={resetPassword} alt="Logo" />
                </div>
                <div className="form-data">
                        <div className='back-to-login-container'>
                            <Link className='back-to-login' to="/login">
                                <span className='arrow'>&lt;</span>
                                Back to login
                            </Link>
                        </div>
                        <h2 className="form-heading">Set a password</h2>
                        <p className="form-description">Your previous password has been reset. Please set a new password for your account.</p>
                        <Form form={form} layout="vertical" onFinish={onFinish}>
                            <Form.Item
                                name="newPassword"
                                rules={[
                                    { required: true, message: 'Required Field' },
                                    { min: 8, message: 'Must have at least 8 characters' }
                                ]}
                            >
                                <Input.Password className="form-input" placeholder="New Password" />
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
                                <Input.Password className="form-input" placeholder="Confirm Password" />
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" className="form-button" loading={loading} htmlType="submit">Set Password</Button>
                            </Form.Item>
                        </Form>
                    </div>
            </div>
        </div>
    );
};

export default SetPassword;
