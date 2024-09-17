import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Spin, Tag, message, Tabs, Breadcrumb, Input, Button, Form, Row, Col, Modal, DatePicker } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import axios from 'axios';
import moment from 'moment';
import { baseURL } from '../../../App';

const { TabPane } = Tabs;

interface Creator {
    _id: string;
    fullName: string;
    profilePic: string;
}

interface Submission {
    _id: string;
    link: string;
    description: string;
    submittedBy: Creator;
    submittedAt: string;
}

interface Project {
    _id: string;
    title: string;
    description: string;
    difficulty: string;
    deadline: string;
    learningSkills: string[];
    submissionLink: Submission[];
    banner: string;
    task: string;
    prerequisites: string;
    submissionMethod: string;
    creator: Creator;
    createdAt: string;
}

const ProjectDetail = () => {
    const { id } = useParams<{ id: string }>();
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('description');
    const [isPastDeadline, setIsPastDeadline] = useState(false);
    const [form] = Form.useForm();
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [editForm] = Form.useForm();
    const userId = localStorage.getItem('userId');
    const navigate = useNavigate();

    const fetchProjectDetail = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${baseURL}/project/${id}`, {
                headers: {
                    Authorization: localStorage.getItem('token') || '',
                },
            });
            const projectData = response.data.project;
            setProject(projectData);
            setIsPastDeadline(moment().isAfter(moment(projectData.deadline)));
        } catch (error: any) {
            message.error(error.response?.data?.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjectDetail();
    }, [id]);

    const handleSubmit = async (values: { link: string; description: string }) => {
        if (isPastDeadline) {
            message.error('Time is already up. Submission is not allowed.');
        } else if (project) {
            try {
                const response = await axios.post(`${baseURL}/project/${project._id}/submit-link`, {
                    link: values.link,
                    description: values.description,
                }, {
                    headers: {
                        Authorization: localStorage.getItem('token') || '',
                    },
                });
                message.success(response.data.message);
                form.resetFields();
            } catch (error: any) {
                message.error(error.response?.data?.message);
            }
        }
    };

    const handleDelete = () => {
        Modal.confirm({
            title: 'Are you sure you want to delete this project?',
            content: 'This action cannot be undone.',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk: async () => {
                try {
                    await axios.delete(`${baseURL}/project/${project?._id}`, {
                        headers: {
                            Authorization: localStorage.getItem('token') || '',
                        },
                    });
                    message.success('Project deleted successfully');
                    navigate('/assessment/projects');
                } catch (error: any) {
                    message.error(error.response?.data?.message);
                }
            },
            onCancel() {
                message.info('Project deletion cancelled');
            },
        });
    };

    const handleEdit = async (values: any) => {
        try {
            await axios.put(`${baseURL}/project/${project?._id}`, values, {
                headers: {
                    Authorization: localStorage.getItem('token') || '',
                },
            });
            message.success('Project updated successfully');
            setEditModalVisible(false);
            fetchProjectDetail();
        } catch (error: any) {
            message.error(error.response?.data?.message);
        }
    };

    if (loading) {
        return <Spin className="flex justify-center items-center h-screen" />;
    }

    if (!project) {
        return <div>No project found</div>;
    }

    const convertTasksToPoints = (task: string) => {
        if (!task) return [];
        return task.split('\n').filter(item => item.trim() !== '');
    };

    return (
        <div>
            <div className="shadow-lg bg-white py-4 px-6 flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
                <h1 className="text-2xl font-semibold text-gray-800">Projects</h1>
                <Breadcrumb className="text-gray-600">
                    <Breadcrumb.Item href="/dashboard">
                        <HomeOutlined />
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>Assessment</Breadcrumb.Item>
                    <Breadcrumb.Item href="/assessment/projects" className="font-semibold">
                        Projects
                    </Breadcrumb.Item>
                    <Breadcrumb.Item className="font-bold text-gray-800">
                        {project._id}
                    </Breadcrumb.Item>
                </Breadcrumb>
            </div>
            <div className='p-6 mt-4 border border-gray-400 rounded-2xl'>
                <div className="flex flex-col md:flex-row justify-between items-start">
                    <div>
                        <h1 className="text-2xl w-full md:w-2/3 font-bold mb-4 md:mb-0">{project.title}</h1>
                        <div className='flex gap-2 mt-2'>
                            {userId === project.creator._id && (
                                <Button type="primary" size='small' onClick={() => setEditModalVisible(true)}>
                                    Edit
                                </Button>
                            )}
                            {userId === project.creator._id && (
                                <Button type="primary"   size='small' onClick={handleDelete}>
                                    Delete
                                </Button>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div>
                            <div className="font-semibold text-gray-800">{project.creator.fullName}</div>
                            <div className="text-gray-600 text-xs">{moment(project.createdAt).format('D MMM, YYYY h:mm A')}</div>
                        </div>
                        <img
                            src={
                                project.creator.profilePic
                                    ? `${baseURL}/uploads/profileImages/profilePic/${project.creator.profilePic}`
                                    : 'https://via.placeholder.com/130'
                            }
                            className="w-11 h-11 rounded-full"
                            alt="Profile Pic"
                        />
                    </div>
                </div>
                <Tabs
                    defaultActiveKey="description"
                    onChange={(key) => setActiveTab(key)}
                    className="mb-4"
                >
                    <TabPane tab="Descriptions" key="description">
                        <div className="text-gray-900 mb-4 mt-4 text-sm">{project.description}</div>
                        <div className="flex space-x-2 mb-4">
                            <div className="bg-green-200 border border-green-600 text-black p-2 rounded-lg text-center text-xs w-52">
                                <h2 className="font-bold">Difficulty</h2>
                                <p className='font-bold'>{project.difficulty}</p>
                            </div>
                            <div className="bg-red-200 border border-red-600 text-black p-2 rounded-lg text-center text-xs w-52">
                                <h2 className="font-bold">Deadline</h2>
                                <span className='font-bold'>{moment(project.deadline).format('D MMM, YYYY h:mm A')}</span>
                            </div>
                        </div>
                        <div className="text-gray-900 text-sm mb-4 "><span className='text-black text-sm font-bold'>Prerequisites:</span> {" "} {project.prerequisites}</div>
                        <div className="text-gray-900 text-sm mb-4 "><span className='text-black text-sm font-bold'>Submission Method:</span> {" "} A {project.submissionMethod} Link</div>
                        <div className="text-gray-900 text-sm mb-2 font-bold">Tasks:</div>
                        <ul className="list-disc pl-5 mb-4 text-gray-700">
                            {convertTasksToPoints(project.task).map((item, index) => (
                                <li key={index} className="mb-1">{item}</li>
                            ))}
                        </ul>
                        <div className="text-black text-sm mb-2 font-bold">Skills you'll be learning:</div>
                        <div className="flex flex-wrap gap-2 mb-4">
                            {project.learningSkills.map((skill) => (
                                <Tag key={skill} color="purple">{skill}</Tag>
                            ))}
                        </div>
                        <div className="text-gray-900 text-sm mb-2"><span className='text-black text-sm font-bold'>Submit Your Link:</span></div>
                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={handleSubmit}
                            className="space-y-4"
                        >
                            <Form.Item
                                name="description"
                                rules={[{ required: true, message: 'Please enter a description' }]}
                            >
                                <Input.TextArea placeholder="Enter a description" rows={4} />
                            </Form.Item>
                            <Row gutter={16}>
                                <Col span={22}>
                                    <Form.Item
                                        name="link"
                                        rules={[{ required: true, message: 'Please enter the project link' }]}
                                    >
                                        <Input placeholder="Enter your project link" />
                                    </Form.Item>
                                </Col>
                                <Col span={2}>
                                    <Form.Item>
                                        <Button type="primary" htmlType="submit" className="w-full">
                                            Submit
                                        </Button>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Form>
                    </TabPane>
                    <TabPane tab="Community Submission" key="submission" className="font-semibold">
                        <div className="text-gray-700 mb-4">{project.submissionLink.length} completions</div>
                        {project.submissionLink.length > 0 ? (
                            <div className="space-y-4">
                                {project.submissionLink.map((submission) => (
                                    <div key={submission._id} className="border border-gray-300 rounded-lg p-4 shadow-sm">
                                        <div className="flex justify-between items-start">
                                            <div className="flex items-center space-x-3" >
                                                <img
                                                    src={
                                                        submission.submittedBy.profilePic
                                                            ? `${baseURL}/uploads/profileImages/profilePic/${submission.submittedBy.profilePic}`
                                                            : 'https://via.placeholder.com/130'
                                                    }
                                                    alt="Submitter Profile Pic"
                                                    className="w-10 h-10 rounded-full"
                                                />
                                                <div>
                                                    <div className="font-semibold text-gray-900">{submission.submittedBy.fullName}</div>
                                                    <div className="text-gray-600 text-xs">
                                                        {moment(submission.submittedAt).format('D MMM, YYYY h:mm A')}
                                                    </div>
                                                </div>
                                            </div>
                                            <h1>
                                                {userId === project.creator._id && (
                                                    <div className='flex flex-col gap-1'>
                                                        <Button type="primary" size='small'>
                                                            Give Grades
                                                        </Button>
                                                        <Button type="primary" size='small'>
                                                            View Grades
                                                        </Button>
                                                    </div>
                                                )}

                                                {userId === submission.submittedBy._id && (
                                                    <Button type="primary" size='small'>
                                                        View Grades
                                                    </Button>
                                                )}
                                            </h1>
                                        </div>
                                        <div className="text-gray-700 mt-4">
                                            <p>{submission.description}</p>
                                            <p className="text-sm font-semibold mb-1">Link:  <a href={submission.link} target="_blank" className="text-blue-500 hover:underline">{submission.link}</a></p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center">
                                <p>No submissions yet</p>
                            </div>
                        )}
                    </TabPane>
                </Tabs>
            </div>

            <Modal
                title="Edit Project"
                visible={editModalVisible}
                onCancel={() => setEditModalVisible(false)}
                onOk={() => editForm.submit()}
            >
                <Form
                    form={editForm}
                    layout="vertical"
                    onFinish={handleEdit}

                >
                    <Form.Item
                        name="deadline"
                        label="Deadline"
                        rules={[{ required: true, message: 'Please select the deadline!' }]}
                    >
                        <DatePicker
                            showTime
                            placeholder="Select deadline"
                            format="YYYY-MM-DD HH:mm:ss"
                            className="w-full"
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default ProjectDetail;
