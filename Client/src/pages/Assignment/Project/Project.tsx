import { useEffect, useState } from 'react'
import { Breadcrumb, Button, Select, Input, message, Tag, Drawer, Form, DatePicker, Spin, Empty } from 'antd'
import { HomeOutlined, ClockCircleOutlined } from '@ant-design/icons'
import axios from 'axios'
import moment from 'moment'
import { baseURL } from '../../../App'
import { useNavigate } from 'react-router-dom'

const { Option } = Select
const { TextArea } = Input

interface Project {
    _id: string
    title: string
    difficulty: string
    deadline: string
    learningSkills: string[]
    submissionLink: string[]
    banner: string
}

const Project = () => {
    const [projects, setProjects] = useState<Project[]>([])
    const [drawerVisible, setDrawerVisible] = useState(false)
    const [loading, setLoading] = useState(true)
    const [form] = Form.useForm()
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [selectedClub, setSelectedClub] = useState<string>('');
    const [selectedDifficulty, setSelectedDifficulty] = useState<string>('');
    const role = localStorage.getItem("role");
    const navigate = useNavigate();

    const fetchProjects = async () => {
        setLoading(true)
        try {
            const response = await axios.get(`${baseURL}/project`, {
                headers: {
                    Authorization: localStorage.getItem('token') || '',
                },
                params: {
                    club: selectedClub,
                    difficulty: selectedDifficulty,
                    title: searchTerm
                }
            })
            setProjects(response.data.projects)
        } catch (error: any) {
            message.error(error.response?.data?.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchProjects();
    }, [searchTerm, selectedClub, selectedDifficulty]);

    useEffect(() => {
        fetchProjects()
    }, [])

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'Easy':
                return 'green'
            case 'Medium':
                return 'orange'
            case 'Hard':
                return 'red'
            default:
                return 'default'
        }
    }

    const handleAddProject = async (values: any) => {
        try {
            const response = await axios.post(`${baseURL}/project`, values, {
                headers: {
                    Authorization: localStorage.getItem('token') || '',
                },
            })
            message.success(response.data.message)
            setDrawerVisible(false)
            fetchProjects()
            form.resetFields()
        } catch (error: any) {
            message.error(error.response?.data?.message)
        }
    }

    return (
        <div>
            <div className="shadow-lg bg-white py-4 px-6 flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
                <h1 className="text-2xl font-semibold text-gray-800">Projects</h1>
                <Breadcrumb className="text-gray-600">
                    <Breadcrumb.Item href="/dashboard">
                        <HomeOutlined />
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>Assessment</Breadcrumb.Item>
                    <Breadcrumb.Item className="font-bold text-gray-800">
                        Projects
                    </Breadcrumb.Item>
                </Breadcrumb>
            </div>

            <div className="py-4 flex flex-wrap items-center justify-between space-y-4 md:space-y-0">
                <Input
                    placeholder="Enter project title"
                    className="w-full md:w-1/3 mr-0 md:mr-4"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="flex flex-col md:flex-row items-center justify-between w-full md:w-auto space-y-4 md:space-y-0 md:space-x-4">
                    <Select placeholder="Select category" className="w-full md:w-52" value={selectedClub} onChange={(value) => setSelectedClub(value)}>
                        <Option value="">All Clubs</Option>
                        <Option value="Startup Club">Startup Club</Option>
                        <Option value="Design Club">Design Club</Option>
                        <Option value="Product Club">Product Club</Option>
                        <Option value="Marketing Club">Marketing Club</Option>
                        <Option value="Tech Club">Tech Club</Option>
                    </Select>
                    <Select placeholder="Select status" className="w-full md:w-52" value={selectedDifficulty} onChange={(value) => setSelectedDifficulty(value)}>
                        <Option value="">All Difficulty</Option>
                        <Option value="Easy">Easy</Option>
                        <Option value="Medium">Medium</Option>
                        <Option value="Hard">Hard</Option>
                    </Select>

                    {role === "entrepreneur" && (
                        <Button type="primary" onClick={() => setDrawerVisible(true)} className="w-full md:w-auto">
                            Add Project
                        </Button>
                    )}
                </div>
            </div>

            <div>
                {loading ? (
                    <div className="flex justify-center items-center h-[80vh]">
                        <Spin className="loading-spinner" />
                    </div>
                ) : projects.length === 0 ? (
                    <div className="flex justify-center w-full items-center h-[80vh]">
                        <Empty description="No Projects Available" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {projects.map((project) => {
                            const color = getDifficultyColor(project.difficulty)
                            return (
                                <div
                                    key={project._id}
                                    className="bg-white p-5 border rounded-lg shadow-md flex flex-col cursor-pointer"
                                    onClick={() => navigate(`/assessment/projects/${project._id}`)}
                                >
                                    <div className="flex justify-between mb-3">
                                        <Tag color={color}>{project.difficulty}</Tag>
                                        <Tag color={color} className="flex items-center space-x-1">
                                            <ClockCircleOutlined />
                                            <span>{moment(project.deadline).format('D MMM, YYYY h:mm A')}</span>
                                        </Tag>
                                    </div>
                                    <h3 className="text-lg font-semibold truncate mb-3">
                                        {project.title}
                                    </h3>
                                    <div className="mb-3 text-gray-500 text-xs">
                                        <span>Skills you'll be learning:</span>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        {project.learningSkills.map((skill) => (
                                            <Tag key={skill} color="purple">
                                                {skill}
                                            </Tag>
                                        ))}
                                    </div>
                                    <hr className="mb-3" />
                                    <div className="text-gray-700 text-sm">
                                        <span>{project.submissionLink.length} completions</span>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
            <Drawer
                title="Add New Project"
                placement="right"
                onClose={() => setDrawerVisible(false)}
                visible={drawerVisible}
                width={600}
                className="drawer-styled"
            >
                <Form form={form} layout="vertical" onFinish={handleAddProject}>
                    <Form.Item name="banner" label="Banner Image">
                        <div className="mb-4">
                            <img src="https://via.placeholder.com/600x200" alt="Banner" className="w-full h-32 object-cover rounded-lg" />
                        </div>
                    </Form.Item>
                    <Form.Item
                        name="title"
                        label="Title"
                        rules={[{ required: true, message: 'Please input the project title!' }]}
                    >
                        <Input placeholder="Enter project title" />
                    </Form.Item>
                    <Form.Item
                        name="description"
                        label="Description"
                        rules={[{ required: true, message: 'Please input the project description!' }]}
                    >
                        <TextArea rows={4} placeholder="Enter project description" />
                    </Form.Item>
                    <Form.Item
                        name="task"
                        label="Task"
                        rules={[{ required: true, message: 'Please input the task' }]}
                    >
                        <TextArea rows={4} placeholder="Enter task" />
                    </Form.Item>
                    <Form.Item
                        name="prerequisites"
                        label="Prerequisites"
                        rules={[{ required: true, message: 'Please input the prerequisites!' }]}
                    >
                        <Input placeholder="Enter prerequisites" />
                    </Form.Item>
                    <Form.Item
                        name="submissionMethod"
                        label="Submission Method"
                        rules={[{ required: true, message: 'Please select the submission method!' }]}
                    >
                        <Select placeholder="Select submission method">
                            <Option value="github">GitHub URL</Option>
                            <Option value="deployed">Deployed Link</Option>
                            <Option value="canva">Canva Link</Option>
                        </Select>
                    </Form.Item>
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
                    <Form.Item
                        name="difficulty"
                        label="Difficulty"
                        rules={[{ required: true, message: 'Please select the difficulty!' }]}
                    >
                        <Select placeholder="Select difficulty">
                            <Option value="Easy">Easy</Option>
                            <Option value="Medium">Medium</Option>
                            <Option value="Hard">Hard</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="learningSkills"
                        label="Learning Skills"
                        rules={[{ required: true, message: 'Please select the learning skills!' }]}
                    >
                        <Select mode="tags" style={{ width: '100%' }} tokenSeparators={[',']} placeholder="Select learning skills" />
                    </Form.Item>
                    <Form.Item
                        name="club"
                        label="Club"
                        rules={[{ required: true, message: 'Please select a club!' }]}
                    >
                        <Select placeholder="Select club">
                            <Option value="Startup Club">Startup Club</Option>
                            <Option value="Design Club">Design Club</Option>
                            <Option value="Product Club">Product Club</Option>
                            <Option value="Marketing Club">Marketing Club</Option>
                            <Option value="Tech Club">Tech Club</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </Drawer>
        </div>
    )
}

export default Project
