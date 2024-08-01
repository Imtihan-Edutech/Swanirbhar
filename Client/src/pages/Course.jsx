import React, { useEffect, useState } from 'react';
import { Card, Row, Button, Drawer, Form, Input, Spin, Pagination, message, Select, Upload, Empty, DatePicker, Checkbox, TreeSelect, Tabs, List, Steps } from 'antd';
import axios from 'axios';
import { baseUrl } from '../App';
import '../styles/Course.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHSquare } from '@fortawesome/free-solid-svg-icons';
import { categoryTreeData, languages } from '../utils/ExtraUtils';

const { Meta } = Card;
const { Option } = Select;
const { Step } = Steps;

const Course = () => {
    const [courses, setCourses] = useState([]);
    const [visible, setVisible] = useState(false);
    const [form] = Form.useForm();
    const token = localStorage.getItem('token');
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetchCourses();
        fetchUserDetails();
    }, []);

    const fetchCourses = async (page, limit) => {
        setLoading(true);
        try {
            const response = await axios.get(`${baseUrl}/course`, {
                headers: { Authorization: token },
                params: {
                    page,
                    limit,
                    sort: '',
                    courseName: '',
                    courseType: '',
                    createdBy: '',
                    category: '',
                    level: '',
                    language: '',
                    hasCompletionCertificate: null,
                    hasAssignments: null,
                    hasSupport: null,
                    tags: ''
                }
            });
            setCourses(response.data.courses);
        } catch (error) {
            if (error.response && error.response.data) {
                message.error(error.response.data.message);
            }
        }
        setLoading(false);
    };

    const fetchUserDetails = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${baseUrl}/user`);
            console.log(response.data);
            setUsers(response.data);
        } catch (error) {
            if (error.response && error.response.data) {
                message.error(error.response.data.message);
            }
        }
        setLoading(false);
    };

    const handleNext = () => {
        form.validateFields()
            .then(() => {
                setCurrentStep(currentStep + 1);
            })
            .catch(errorInfo => {
                console.log('Validation Failed:', errorInfo);
            });
    };

    const handlePrev = () => {
        setCurrentStep(currentStep - 1);
    };

    const addCourse = async (formData) => {
        console.log(formData);
        setLoading(true);
        try {
            const {
                courseName, courseType, shortdescription, description, category, startDate,
                price, discount, level, language, duration, hasCompletionCertificate, hasAssignments,
                objectives, hasSupport, patnerInstructor, tags, faq, thumbnail, coverImage, demoVideo
            } = formData;

            const courseData = new FormData();
            courseData.append('courseName', courseName);
            courseData.append('courseType', courseType);
            courseData.append('shortdescription', shortdescription);
            courseData.append('description', description);
            courseData.append('category', category);
            courseData.append('startDate', startDate);
            courseData.append('price', parseFloat(price));
            courseData.append('discount', parseFloat(discount));
            courseData.append('level', level);
            courseData.append('language', language);
            courseData.append('duration', parseFloat(duration));
            courseData.append('hasCompletionCertificate', hasCompletionCertificate);
            courseData.append('hasAssignments', hasAssignments);
            courseData.append('hasSupport', hasSupport);
            courseData.append('objectives', JSON.stringify(objectives));
            courseData.append('patnerInstructor', JSON.stringify(patnerInstructor));
            courseData.append('tags', JSON.stringify(tags));
            courseData.append('faq', JSON.stringify(faq));

            if (thumbnail) {
                courseData.append('thumbnail', thumbnail[0].originFileObj);
            }
            if (coverImage) {
                courseData.append('coverImage', coverImage[0].originFileObj);
            }
            if (demoVideo) {
                courseData.append('demoVideo', demoVideo[0].originFileObj);
            }

            const response = await axios.post(`${baseUrl}/course`, courseData, {
                headers: {
                    Authorization: token,
                    'Content-Type': 'multipart/form-data'
                }
            });

            form.resetFields();
            setVisible(false);
            message.success(response.data.message);
            fetchCourses();
        } catch (error) {
            if (error.response && error.response.data) {
                message.error(error.response.data.message);
            }
        }
        setLoading(false);
    };

    const showDrawer = () => { setVisible(true); };
    const closeDrawer = () => { setVisible(false); };

    return (
        <div className="course-container">
            <div className="course-list-container">
                <div className="top-conatiner">
                    <Input.Search placeholder="Search courses" style={{ width: 350 }} />
                    <Button type="primary" onClick={showDrawer} className="create-course-button">
                        <FontAwesomeIcon icon={faHSquare} /> Create Course
                    </Button>
                    <Button type="primary" className="manage-button">
                        <FontAwesomeIcon icon={faHSquare} /> Manage
                    </Button>
                </div>

                <List
                    className="course-list"
                    itemLayout="vertical"
                    dataSource={courses}
                    renderItem={(item) => (
                        <List.Item key={item._id}>
                            <Card hoverable cover={<img alt="Course Image" src={`${baseUrl}/uploads/courseImages/thumbnails/${item.thumbnail}`} />}>
                                <Meta title={item.courseName} description={item.description} />
                            </Card>
                        </List.Item>
                    )}
                />
            </div>

            <Drawer
                title="Create Course"
                placement="right"
                onClose={closeDrawer}
                open={visible}
                width={600}
                className="create-course-drawer"
            >
                <Form layout="vertical" form={form} onFinish={addCourse} className="create-course-form">
                    <Form.Item name="courseName" label="Course Name" rules={[{ required: true, message: 'Please enter the course name' }]}>
                        <Input placeholder='Course Name' />
                    </Form.Item>

                    <Form.Item name="courseType" label="Course Type" rules={[{ required: true, message: 'Please select the course type' }]}>
                        <Select placeholder='Select Course Type'>
                            <Option value="Live Class">Live Class</Option>
                            <Option value="Video Course">Video Course</Option>
                            <Option value="Text Course">Text Course</Option>
                            <Option value="Physical Course">Physical Course</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item name="shortdescription" label="Short Description" rules={[{ required: true, message: 'Please enter the description (80-100 Words)' }]}>
                        <Input.TextArea rows={3} placeholder='Description' />
                    </Form.Item>

                    <Form.Item name="description" label="Description" rules={[{ required: true, message: 'Please enter the description' }]}>
                        <Input.TextArea rows={8} placeholder='Description' />
                    </Form.Item>

                    <Form.Item name="category" label="Category" rules={[{ required: true, message: 'Please select the category' }]}>
                        <TreeSelect
                            showSearch
                            treeData={categoryTreeData}
                            placeholder='Select Category'
                            treeDefaultExpandAll
                        />
                    </Form.Item>

                    <div style={{ display: 'flex', gap: '16px' }}>
                        <Form.Item name="startDate" label="Start Date" rules={[{ required: true, message: 'Please select the start date' }]} style={{ flex: 1 }}>
                            <DatePicker placeholder='Start Date' style={{ width: '100%' }} />
                        </Form.Item>

                        <Form.Item name="duration" label="Duration (in hours)" rules={[{ required: true, message: 'Please enter the duration' }]} style={{ flex: 1 }}>
                            <Input type="number" placeholder='Duration (in hours)' />
                        </Form.Item>
                    </div>

                    <div style={{ display: 'flex', gap: '16px' }}>
                        <Form.Item name="price" label="Pricing" rules={[{ required: true, message: 'Please enter the pricing' }]} style={{ flex: 1 }}>
                            <Input type="number" placeholder='Pricing' />
                        </Form.Item>
                        <Form.Item name="discount" label="Discount (%)" rules={[{ required: true, message: 'Please enter the discount' }]} style={{ flex: 1 }}>
                            <Input type="number" placeholder='Discount (%)' />
                        </Form.Item>
                    </div>

                    <div style={{ display: 'flex', gap: '16px' }}>
                        <Form.Item name="level" label="Level" rules={[{ required: true, message: 'Please select the level' }]} style={{ flex: 1 }}>
                            <Select placeholder='Select Level'>
                                <Option value="Beginner">Beginner</Option>
                                <Option value="Intermediate">Intermediate</Option>
                                <Option value="Advanced">Advanced</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item name="language" label="Language" rules={[{ required: true, message: 'Please select the language' }]} style={{ flex: 1 }}>
                            <Select placeholder='Select Language'>
                                {languages.map(lang => (
                                    <Option key={lang.value} value={lang.value}>{lang.label}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </div>

                    <div style={{ display: 'flex', gap: '16px' }}>
                        <Form.Item name="hasCompletionCertificate" valuePropName="checked" style={{ flex: 1 }}>
                            <Checkbox>Completion Certificate</Checkbox>
                        </Form.Item>
                        <Form.Item name="hasAssignments" valuePropName="checked" style={{ flex: 1 }}>
                            <Checkbox>Assignments</Checkbox>
                        </Form.Item>
                        <Form.Item name="hasSupport" valuePropName="checked" style={{ flex: 1 }}>
                            <Checkbox>Support</Checkbox>
                        </Form.Item>
                    </div>

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
                        <Form.Item name="thumbnail" label="Thumbnail" valuePropName="fileList" rules={[{ required: true, message: 'Please upload the thumbnail' }]} getValueFromEvent={e => e.fileList} style={{ flex: 1 }}>
                            <Upload beforeUpload={() => false} maxCount={1} listType="picture">
                                <Button>Upload Thumbnail</Button>
                            </Upload>
                        </Form.Item>

                        <Form.Item name="coverImage" label="Cover Image" valuePropName="fileList" rules={[{ required: true, message: 'Please upload the cover image' }]} getValueFromEvent={e => e.fileList} style={{ flex: 1 }}>
                            <Upload beforeUpload={() => false} maxCount={1} listType="picture">
                                <Button>Upload Cover Image</Button>
                            </Upload>
                        </Form.Item>
                    </div>

                    <Form.Item name="demoVideo" label="Demo Video" valuePropName="fileList" rules={[{ required: true, message: 'Please upload the demo video' }]} getValueFromEvent={e => e.fileList}>
                        <Upload beforeUpload={() => false} maxCount={1} listType="picture">
                            <Button>Upload Demo Video</Button>
                        </Upload>
                    </Form.Item>

                    <Form.Item name="patnerInstructor" label="Partner Instructors" rules={[{ required: true, message: 'Please select the partner instructors' }]}>
                        <Select mode="multiple" placeholder='Select Partner Instructors'>
                            {users.map(user => (
                                <Option key={user._id} value={user._id}>{user.firstname} {user.lastname}</Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.List name="tags">
                        {(fields, { add, remove }) => (
                            <>
                                {fields.map(({ key, name, fieldKey, ...restField }) => (
                                    <Form.Item
                                        key={key}
                                        {...restField}
                                        name={[name]}
                                        fieldKey={[fieldKey]}
                                        rules={[{ required: true, message: 'Please enter a tag' }]}
                                        style={{ marginBottom: '8px' }}
                                    >
                                        <Input
                                            placeholder='Tag'
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
                                        Add Tag
                                    </Button>
                                </Form.Item>
                            </>
                        )}
                    </Form.List>

                    <Form.List name="faq">
                        {(fields, { add, remove }) => (
                            <>
                                {fields.map(({ key, name, fieldKey, ...restField }) => (
                                    <Form.Item key={key} style={{ marginBottom: '8px' }}>
                                        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                                            <Form.Item
                                                {...restField}
                                                name={[name, 'question']}
                                                fieldKey={[fieldKey, 'question']}
                                                rules={[{ required: true, message: 'Please enter the question' }]}
                                                style={{ flex: 1, margin: 0 }}
                                            >
                                                <Input placeholder='Question' />
                                            </Form.Item>
                                            <Form.Item
                                                {...restField}
                                                name={[name, 'answer']}
                                                fieldKey={[fieldKey, 'answer']}
                                                rules={[{ required: true, message: 'Please enter the answer' }]}
                                                style={{ flex: 2, margin: 0 }}
                                            >
                                                <Input placeholder='Answer' />
                                            </Form.Item>
                                            <Button
                                                type="link"
                                                onClick={() => remove(name)}
                                                style={{ padding: '0', border: 'none', height: 'auto' }}
                                            >
                                                Remove
                                            </Button>
                                        </div>
                                    </Form.Item>
                                ))}
                                <Form.Item>
                                    <Button type="dashed" onClick={() => add()} block>
                                        Add FAQ
                                    </Button>
                                </Form.Item>
                            </>
                        )}
                    </Form.List>

                    <Form.Item>
                        <Button type="primary" loading={loading} htmlType="submit" className="create-course-submit-button">
                            Create Course
                        </Button>
                    </Form.Item>
                </Form>
            </Drawer>
        </div>
    );
};

export default Course;
