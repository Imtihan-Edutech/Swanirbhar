import React, { useState, useEffect } from 'react';
import { Table, Button, Drawer, Form, Input, Space, message, Tag, Select, Card } from 'antd';
import axios from 'axios';
import { baseUrl } from '../../../App';
import moment from 'moment';

const { Option } = Select;

const Staff = () => {
    const [staffUsers, setStaffUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDrawerVisible, setIsDrawerVisible] = useState(false);
    const [currentEditingUser, setCurrentEditingUser] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [form] = Form.useForm();

    useEffect(() => {
        loadStaffUsers();
    }, []);

    useEffect(() => {
        loadStaffUsers();
    }, [searchQuery]);

    const loadStaffUsers = async () => {
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
            const filteredStaffUsers = response.data.filter(user => user.role === 'staff');
            setStaffUsers(filteredStaffUsers);
        } catch (error) {
            message.error(error.response?.data?.message);
        }
        setIsLoading(false);
    };

    const openDrawer = (user) => {
        if (user) {
            setCurrentEditingUser(user);
            form.setFieldsValue({
                ...user,
                createdAt: moment(user.createdAt).format('DD MMMM YYYY, HH:mm'),
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

    const handleFormSubmit = async (formData) => {
      setIsSubmitting(true);
        const staffData = { ...formData, role: "staff" };
        try {
            if (currentEditingUser) {
                const response = await axios.put(`${baseUrl}/user/editUser/${currentEditingUser._id}`, formData, {
                    headers: {
                        'Authorization': localStorage.getItem("token"),
                    },
                });
                message.success(response.data.message);
                loadStaffUsers();
            } else {
                const response = await axios.post(`${baseUrl}/user/createUsers`, staffData, {
                    headers: {
                        'Authorization': localStorage.getItem("token"),
                    },
                });
                message.success(response.data.message);
                loadStaffUsers();
            }
            closeDrawer();
        } catch (error) {
            message.error(error.response?.data?.message);
        }
        setIsSubmitting(false);
    };

    const activeUsersCount = staffUsers.filter(user => user.status === 'active').length;
    const suspendedUsersCount = staffUsers.filter(user => user.status === 'suspended').length;

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
                <Tag color="orange">
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
        <div>
            <Space style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, alignItems: "start" }}>
                <Input
                    placeholder="Search For Staff"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <>
                    <Space style={{ marginBottom: 16 }}>
                        <Card title="Active Users" bordered={false} style={{ width: 150, marginRight: 16 }}>
                            <h1 style={{ textAlign: 'center', color: 'green' }}>{activeUsersCount}</h1>
                        </Card>
                        <Card title="Suspended Users" bordered={false} style={{ width: 150 }}>
                            <h1 style={{ textAlign: 'center', color: 'red' }}>{suspendedUsersCount}</h1>
                        </Card>
                    </Space>
                </>
                <Button type="primary" onClick={() => openDrawer(null)}>
                    Add User
                </Button>
            </Space>

            <Table
                columns={columns}
                dataSource={staffUsers}
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
                        <Button type="primary" htmlType="submit"  loading={isSubmitting}>
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </Drawer>
        </div>
    );
};

export default Staff;