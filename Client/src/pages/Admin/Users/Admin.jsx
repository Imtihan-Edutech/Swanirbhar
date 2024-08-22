import React, { useState, useEffect } from 'react';
import { Table, Button, Drawer, Form, Input, Space, message, Tag, Select, Card, Breadcrumb } from 'antd';
import axios from 'axios';
import { baseUrl } from '../../../App';
import moment from 'moment';
import { Link, useNavigate } from 'react-router-dom';

const { Option } = Select;

const Admin = () => {
    const [adminUsers, setAdminUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDrawerVisible, setIsDrawerVisible] = useState(false);
    const [currentEditingUser, setCurrentEditingUser] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [form] = Form.useForm();
    const navigate = useNavigate();

    useEffect(() => {
        loadAdminUsers();
    }, []);

    useEffect(() => {
        loadAdminUsers();
    }, [searchQuery]);

    const loadAdminUsers = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${baseUrl}/user`, {
                headers: {
                    'Authorization': localStorage.getItem("token"),
                },
                params: {
                    fullName: searchQuery,
                    email: searchQuery
                }
            });
            const admins = response.data.filter(user => user.role === 'admin');
            setAdminUsers(admins);
        } catch (error) {
            message.error(error.response?.data?.message);
        }
        setIsLoading(false);
    };

    const openDrawer = (user) => {
        if (user) {
            setCurrentEditingUser(user);
            form.setFieldsValue({
                ...user
            });
        } else {
            setCurrentEditingUser(null);
            form.resetFields();
        }
        setIsDrawerVisible(true);
    };

    const closeDrawer = () => {
        setIsDrawerVisible(false);
        form.resetFields();
    };

    const handleFormSubmit = async (values) => {
        setIsSubmitting(true);
        const newUser = { ...values, role: "admin" };
        try {
            if (currentEditingUser) {
                const response = await axios.put(`${baseUrl}/user/editUser/${currentEditingUser._id}`, values, {
                    headers: {
                        'Authorization': localStorage.getItem("token"),
                    },
                });
                message.success(response.data.message);
                loadAdminUsers();
            } else {
                const response = await axios.post(`${baseUrl}/user/createUsers`, newUser, {
                    headers: {
                        'Authorization': localStorage.getItem("token"),
                    },
                });
                message.success(response.data.message);
                loadAdminUsers();
            }
            closeDrawer();
        } catch (error) {
            message.error(error.response?.data?.message);
        }
        setIsSubmitting(false);
    };

    const activeUserCount = adminUsers.filter(user => user.status === 'active').length;
    const suspendedUserCount = adminUsers.filter(user => user.status === 'suspended').length;
    const totalUserCount = adminUsers.length;

    const columns = [
        {
            title: 'Full Name',
            dataIndex: 'fullName',
            key: 'fullName',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Phone Number',
            dataIndex: 'phoneNumber',
            key: 'phoneNumber',
        },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
            render: (role) => (
                <Tag color="blue">
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                </Tag>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <Tag color={status === 'active' ? 'green' : 'red'}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                </Tag>
            ),
        },
        {
            title: 'Registration Date',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (text) => moment(text).format('DD MMMM YYYY, HH:mm'),
        },
        {
            title: 'Action',
            key: 'action',
            render: (record) => (
                <Button type="link" onClick={() => openDrawer(record)}>Edit</Button>
            ),
        },
    ];

    return (
        <>
            <Space
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: 16,
                    backgroundColor: 'white',
                    padding: '16px',
                    boxShadow: '0 2px 2px rgba(0, 0, 0, 0.15)',
                }}
            >
                <h2>Admin List</h2>
                <Breadcrumb>
                    <Breadcrumb.Item>
                        <Link to="/dashboard">Dashboard</Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>Users</Breadcrumb.Item>
                    <Breadcrumb.Item>Admin</Breadcrumb.Item>
                </Breadcrumb>
            </Space>
            <Input
                    placeholder="Search For Admin's"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button type="primary" onClick={() => openDrawer(null)}>
                    Add User
                </Button>
            <Space >
                
                <Space style={{ marginBottom: 16 }}>
                    <Card title="Total Admin's" bordered={false} style={{ width: 200, marginRight: 16 }}>
                        <h1 style={{ textAlign: 'center', color: '#1890ff' }}>{totalUserCount}</h1>
                    </Card>
                    <Card title="Active Admin's" bordered={false} style={{ width: 200, marginRight: 16 }}>
                        <h1 style={{ textAlign: 'center', color: 'green' }}>{activeUserCount}</h1>
                    </Card>
                    <Card title="Suspended Admin's" bordered={false} style={{ width: 200, marginRight: 16 }}>
                        <h1 style={{ textAlign: 'center', color: 'red' }}>{suspendedUserCount}</h1>
                    </Card>
                    {/* Add more cards as needed */}
                </Space>
                
            </Space>

            <Table
                columns={columns}
                dataSource={adminUsers}
                loading={isLoading}
                rowKey="_id"
                pagination={false}
            />
            <Drawer
                title={currentEditingUser ? 'Edit User' : 'Add a new user'}
                width={500}
                onClose={closeDrawer}
                visible={isDrawerVisible}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleFormSubmit}
                >
                    <Form.Item
                        name="fullName"
                        label="Full Name"
                        rules={[{ required: true, message: 'Please enter the full name' }]}
                    >
                        <Input placeholder="Please enter the full name" />
                    </Form.Item>
                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[{ required: true, message: 'Please enter the email' }]}
                    >
                        <Input placeholder="Please enter the email" disabled={!!currentEditingUser} />
                    </Form.Item>
                    <Form.Item
                        name="phoneNumber"
                        label="Phone Number"
                        rules={[{ required: true, message: 'Please enter the phone number' }]}
                    >
                        <Input placeholder="Please enter the phone number" />
                    </Form.Item>
                    {currentEditingUser && (
                        <Form.Item
                            name="status"
                            label="Status"
                            rules={[{ required: true, message: 'Please select the status' }]}
                        >
                            <Select placeholder="Select status">
                                <Option value="active">Active</Option>
                                <Option value="suspended">Suspended</Option>
                            </Select>
                        </Form.Item>
                    )}
                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={isSubmitting}>
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </Drawer>
        </>
    );
};

export default Admin;
