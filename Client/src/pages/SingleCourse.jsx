import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Layout, Button, Drawer, Form, Input, message, List, Spin, Upload, Select } from 'antd';
import { EditOutlined, UploadOutlined, MenuOutlined, CloseOutlined } from '@ant-design/icons';
import { baseUrl } from '../App';
import '../styles/SingleCourse.css';

const { Content, Sider } = Layout;
const { Option } = Select;

const SingleCourse = () => {
    const [form] = Form.useForm();
    const [courseData, setCourseData] = useState(null);
    const [drawerState, setDrawerState] = useState({ visible: false, editing: false, topic: null });
    const [loading, setLoading] = useState(false);
    const [sidebarVisible, setSidebarVisible] = useState(true);
    const [isEnrolled, setIsEnrolled] = useState(false);

    const { courseId } = useParams();
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        fetchCourseData();
    }, [courseId]);

    const fetchCourseData = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${baseUrl}/courses/${courseId}`, {
                headers: { Authorization: token }
            });
            setCourseData(response.data.course);
            setIsEnrolled(response.data.course.enrolledUsers.some(user => user._id === userId));
        } catch (error) {
            message.error('Failed to fetch course data. Please try again.');
        }
        setLoading(false);
    };

    const handleEnroll = async () => {
        setLoading(true);
        try {
            const response = await axios.put(`${baseUrl}/courses/enroll/${courseId}`, {}, {
                headers: { Authorization: token }
            });
            message.success(response.data.message);
            setIsEnrolled(true);
        } catch (error) {
            message.error(error.response.data.message);
        }
        setLoading(false);
    };

    const handleAddTopic = async (values) => {
        setLoading(true);
        console.log(values.videoURL.file);
        try {
            const formData = new FormData();
            formData.append('title', values.title);
            formData.append('videoURL', values.videoURL.file.originFileObj);
            
            await axios.post(`${baseUrl}/courses/${courseId}/topics`, formData, {
                headers: { Authorization: token, 'Content-Type': 'multipart/form-data' }
            });
            message.success('Topic added successfully');
            fetchCourseData();
            setDrawerState({ visible: false, editing: false, topic: null });
            form.resetFields();
        } catch (error) {
            message.error('Failed to add topic. Please try again.');
        }
        setLoading(false);
    };

    const handleEditCourse = () => {
        form.setFieldsValue({
            courseName: courseData.courseName,
            description: courseData.description,
            objectives: courseData.objectives,
            price: courseData.price,
            category: courseData.category,
            level: courseData.level,
            language: courseData.language,
            duration: courseData.duration,
        });
        setDrawerState({ visible: true, editing: true, topic: null });
    };

    const handleUpdateCourse = async (values) => {
        console.log(values);
        const formData = new FormData();
        formData.append('courseName', values.courseName);
        formData.append('description', values.description);
        formData.append('objectives', JSON.stringify(values.objectives));
        formData.append('price', values.price);
        formData.append('category', values.category);
        formData.append('level', values.level);
        formData.append('language', values.language);
        formData.append('duration', values.duration);
        if (values.thumbnail?.file) {
            formData.append('thumbnail', values.thumbnail.file.originFileObj);
        }

        setLoading(true);
        try {
            await axios.put(`${baseUrl}/courses/${courseId}`, formData, {
                headers: {
                    Authorization: token,
                    'Content-Type': 'multipart/form-data',
                }
            });
            message.success('Course updated successfully');
            fetchCourseData();
            setDrawerState({ visible: false, editing: false, topic: null });
            form.resetFields();
        } catch (error) {
            message.error(error.response.data.message);
        }
        setLoading(false);
    };

    const handleUpdateTopic = async (values) => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('title', values.title);
            formData.append('videoURL', values.videoURL.file.originFileObj);
            await axios.put(`${baseUrl}/courses/${courseId}/topics/${drawerState.topic._id}`, formData, {
                headers: { Authorization: token, 'Content-Type': 'multipart/form-data' }
            });
            message.success('Topic updated successfully');
            fetchCourseData();
            setDrawerState({ visible: false, editing: false, topic: null });
            form.resetFields();
        } catch (error) {
            message.error(error.response.data.message);
        }
        setLoading(false);
    };

    const handleDeleteCourse = async () => {
        setLoading(true);
        try {
            await axios.delete(`${baseUrl}/courses/${courseId}`, {
                headers: { Authorization: token }
            });
            message.success('Course deleted successfully');
            navigate("/dashboard/allCourses");
        } catch (error) {
            message.error(error.response.data.message);
        }
        setLoading(false);
    };

    const handleEditTopic = (topic) => {
        form.setFieldsValue({ title: topic.title, videoURL: topic.videoURL });
        setDrawerState({ visible: true, editing: true, topic });
    };

    const handleAddTopicClick = () => {
        form.resetFields();
        setDrawerState({ visible: true, editing: false, topic: null });
    };

    const renderActionButtons = () => {
        if (!isEnrolled && userId !== courseData.createdBy._id) {
            return <Button type="primary" onClick={handleEnroll}>Enroll</Button>;
        }
        if (userId === courseData.createdBy._id) {
            return (
                <>
                    <Button type="primary" onClick={handleAddTopicClick}>Add Topics</Button>
                    <Button type="primary" onClick={handleEditCourse} style={{ marginLeft: 8 }}>Edit Course</Button>
                    <Button type="primary" danger onClick={handleDeleteCourse} style={{ marginLeft: 8 }}>Delete Course</Button>
                </>
            );
        }
    };

    const languages = [
        { value: 'English', label: 'English' },
        { value: 'Spanish', label: 'Spanish' },
        { value: 'French', label: 'French' },
        { value: 'German', label: 'German' },
        { value: 'Chinese', label: 'Chinese' }
    ];

    return (
        <Layout className="single-course-layout">
            {loading ? <Spin className="loading-spinner" /> : (
                <>
                    <Sider width={sidebarVisible ? 400 : 65} className="single-course-sider">
                        <Button
                            className={`sidebar-toggle-button ${sidebarVisible ? 'expanded' : 'collapsed'}`}
                            icon={sidebarVisible ? <CloseOutlined /> : <MenuOutlined />}
                            onClick={() => setSidebarVisible(!sidebarVisible)}
                        />
                        {sidebarVisible && courseData && (
                            <div className="single-course-card">
                                <h2 className="single-course-name">{courseData.courseName}</h2>
                                <p className="single-course-description">{courseData.description}</p>
                                <List
                                    dataSource={courseData.topics}
                                    renderItem={(topic) => (
                                        <List.Item actions={userId === courseData.createdBy._id ? [<EditOutlined onClick={() => handleEditTopic(topic)} />] : []}>
                                            <List.Item.Meta title={<a href={topic.videoURL} target="_blank" rel="noopener noreferrer">{topic.title}</a>} />
                                        </List.Item>
                                    )}
                                />
                                <div className="single-course-action-buttons">{renderActionButtons()}</div>
                            </div>
                        )}
                    </Sider>
                    <Layout>
                        <Content className="single-course-content">
                            <h2>Course Content</h2>
                            {/* Your course content goes here */}
                        </Content>
                    </Layout>
                    <Drawer
                        title={drawerState.editing ? (drawerState.topic ? "Edit Topic" : "Edit Course") : "Add Topic"}
                        placement="right"
                        width={500}
                        onClose={() => setDrawerState({ visible: false, editing: false, topic: null })}
                        open={drawerState.visible}
                    >
                        <Form
                            form={form}
                            onFinish={drawerState.editing ? (drawerState.topic ? handleUpdateTopic : handleUpdateCourse) : handleAddTopic}
                            layout="vertical"
                        >
                            {drawerState.editing && !drawerState.topic ? (
                                <>
                                    <Form.Item name="thumbnail" label="Thumbnail" valuePropName="fileList" getValueFromEvent={e => Array.isArray(e) ? e : e && [e.file]}>
                                        <Upload name="thumbnail" listType="picture">
                                            <Button icon={<UploadOutlined />}>Upload Thumbnail</Button>
                                        </Upload>
                                    </Form.Item>
                                    <Form.Item name="courseName" label="Course Name" rules={[{ required: true, message: 'Please enter the course name' }]}>
                                        <Input placeholder='Course Name' className="form-input" />
                                    </Form.Item>
                                    <Form.Item name="description" label="Description" rules={[{ required: true, message: 'Please enter the description' }]}>
                                        <Input.TextArea rows={5} placeholder='Description' className="form-textarea" />
                                    </Form.Item>
                                    <Form.List name="objectives">
                                        {(fields, { add, remove }) => (
                                            <>
                                                {fields.map(({ key, name, fieldKey, ...restField }) => (
                                                    <Form.Item
                                                        key={key}
                                                        {...restField}
                                                        name={[name]}
                                                        fieldKey={[fieldKey]}
                                                        rules={[{ required: true, message: 'Please enter an objective' }]}
                                                        style={{ marginBottom: '8px' }}
                                                    >
                                                        <Input
                                                            placeholder='Objective'
                                                            className="form-input"
                                                            addonAfter={
                                                                <Button
                                                                    type="link"
                                                                    onClick={() => remove(name)}
                                                                    style={{ padding: '0', border: 'none', height: 'auto' }}
                                                                >
                                                                    Remove
                                                                </Button>
                                                            }
                                                        />
                                                    </Form.Item>
                                                ))}
                                                <Form.Item>
                                                    <Button type="dashed" onClick={() => add()} block>
                                                        Add Objective
                                                    </Button>
                                                </Form.Item>
                                            </>
                                        )}
                                    </Form.List>

                                    <div style={{ display: 'flex', gap: '16px' }}>
                                        <Form.Item name="price" rules={[{ required: true, message: 'Please enter the pricing' }]} style={{ flex: 1 }}>
                                            <Input type="number" placeholder='Pricing' className="form-input" />
                                        </Form.Item>
                                        <Form.Item name="duration" rules={[{ required: true, message: 'Please enter the duration' }]} style={{ flex: 1 }}>
                                            <Input type="number" placeholder='Duration' className="form-input" />
                                        </Form.Item>
                                    </div>
                                    <Form.Item name="category" rules={[{ required: true, message: 'Please select the category' }]}>
                                        <Select placeholder='Select Category' className="form-select">
                                            <Option value="Technology">Technology</Option>
                                            <Option value="Business">Business</Option>
                                            <Option value="Arts">Arts</Option>
                                            <Option value="Science">Science</Option>
                                            <Option value="Health">Health</Option>
                                            <Option value="Language">Language</Option>
                                            <Option value="Mathematics">Mathematics</Option>
                                            <Option value="other">Other</Option>
                                        </Select>
                                    </Form.Item>
                                    <div style={{ display: 'flex', gap: '16px' }}>
                                        <Form.Item name="level" rules={[{ required: true, message: 'Please select the level' }]} style={{ flex: 1 }}>
                                            <Select placeholder='Select Level' className="form-select">
                                                <Option value="Beginner">Beginner</Option>
                                                <Option value="Intermediate">Intermediate</Option>
                                                <Option value="Advanced">Advanced</Option>
                                            </Select>
                                        </Form.Item>
                                        <Form.Item name="language" rules={[{ required: true, message: 'Please select the language' }]} style={{ flex: 1 }}>
                                            <Select placeholder='Select Language' className="form-select">
                                                {languages.map(lang => (
                                                    <Option key={lang.value} value={lang.value}>{lang.label}</Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <Form.Item name="title" label="Title" rules={[{ required: true, message: 'Please enter the title' }]}>
                                        <Input placeholder='Title' />
                                    </Form.Item>
                                    <Form.Item name="videoURL" label="Video URL" rules={[{ required: true, message: 'Please upload the video' }]}>
                                        <Upload name="videoURL" listType="text" beforeUpload={() => false}>
                                            <Button icon={<UploadOutlined />}>Upload Video</Button>
                                        </Upload>
                                    </Form.Item>
                                </>
                            )}
                            <Form.Item>
                                <Button type="primary" style={{width:"100%"}} htmlType="submit">{drawerState.editing ? "Update" : "Add"}</Button>
                            </Form.Item>
                        </Form>
                    </Drawer>
                </>
            )}
        </Layout>
    );
};

export default SingleCourse;
