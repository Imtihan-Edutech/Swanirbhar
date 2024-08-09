import React, { useEffect, useState } from 'react';
import { Button, Input, Drawer, Form, Input as AntInput, TreeSelect, Upload, message, Spin, Empty } from 'antd';
import "../styles/CaseStudy.css";
import axios from 'axios';
import { axiosInstance, baseUrl } from '../App';
import { categoryTreeData } from '../utils/ExtraUtils';
import { BookOutlined, CommentOutlined, ShareAltOutlined } from '@ant-design/icons';
import { formatDistanceToNow } from 'date-fns';

const { TextArea } = AntInput;

const CaseStudy = () => {
    const [form] = Form.useForm();
    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const token = localStorage.getItem('token');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [caseStudyData, setcaseStudyData] = useState([]);
    const [commentsVisible, setCommentsVisible] = useState(false);
    const [selectedCaseStudy, setSelectedCaseStudy] = useState(null);
    const [commentForm] = Form.useForm();

    useEffect(() => {
        getCaseStudies();
    }, []);

    useEffect(() => {
        getCaseStudies();
    }, [searchTerm, selectedCategory]);

    const getCaseStudies = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get(`${baseUrl}/caseStudy`, {
                params: {
                    title: searchTerm,
                    category: selectedCategory
                }
            });
            setcaseStudyData(response.data.caseStudies);
        } catch (error) {
            if (error.response && error.response.data) {
                message.error(error.response.data.message);
            }
        }
        setLoading(false);
    };

    const addBLogs = async (values) => {
        setLoading(true);
        try {
            const { title, category, content, coverImage, videoUrl } = values;

            const caseStudyData = new FormData();
            caseStudyData.append('title', title);
            caseStudyData.append('category', category);
            caseStudyData.append('content', content);
            caseStudyData.append('videoUrl', videoUrl);

            if (coverImage) {
                caseStudyData.append('coverImage', coverImage[0].originFileObj);
            }

            const response = await axiosInstance.post(`${baseUrl}/caseStudy`, caseStudyData, {
                headers: {
                    'Authorization': token,
                    'Content-Type': 'multipart/form-data',
                },
            });

            message.success(response.data.message);
            getCaseStudies();
            setVisible(false);
            form.resetFields();
        } catch (error) {
            if (error.response && error.response.data) {
                message.error(error.response.data.message);
            }
        }
        setLoading(false);
    };

    const addComment = async (values) => {
        setLoading(true);
        try {
            const { comment } = values;
            await axiosInstance.post(`${baseUrl}/caseStudy/${selectedCaseStudy._id}/comments`, { comment }, {
                headers: {
                    'Authorization': token,
                },
            });
            message.success('Comment added successfully');
            await getCaseStudies();
            setSelectedCaseStudy(prevCaseStudy => ({
                ...prevCaseStudy,
                comments: [...prevCaseStudy.comments, {
                    comment,
                    user: { firstname: 'You', lastname: '' },
                    createdAt: new Date().toISOString()
                }]
            }));
            commentForm.resetFields();
        } catch (error) {
            if (error.response && error.response.data) {
                message.error(error.response.data.message);
            }
        }
        setLoading(false);
    };

    const validateDescription = (_, value) => {
        if (!value || value.split(' ').length < 70) {
            return Promise.reject(new Error('Content must be at least 70 words long'));
        }
        if (value.split(' ').length > 80) {
            return Promise.reject(new Error('Content cannot be more than 80 words'));
        }
        return Promise.resolve();
    };

    const showDrawer = () => { setVisible(true); };
    const closeDrawer = () => { setVisible(false); };
    const showCommentsDrawer = (caseStudy) => { setSelectedCaseStudy(caseStudy); setCommentsVisible(true); };
    const closeCommentsDrawer = () => { setCommentsVisible(false); };

    return (
        <div className='caseStudy-container'>
            <div className="caseStudy-header">
                <Input
                    placeholder="Case Study Title And Author"
                    className="search-field"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="filter-add-container">
                    <TreeSelect
                        showSearch
                        treeData={categoryTreeData}
                        placeholder="Select Category"
                        treeDefaultExpandAll
                        className="category-select"
                        value={selectedCategory}
                        onChange={(value) => setSelectedCategory(value)}
                    />
                    <Button type="primary" className="add-caseStudy-button" onClick={showDrawer}>
                       Add Case Study
                    </Button>
                </div>
            </div>

            <div className="caseStudy-body">
                {loading ? (
                    <Spin className="loading-spinner" />
                ) : caseStudyData.length === 0 ? (
                    <div className="empty-results">
                    <Empty description="No Case Study Available" />
                    </div>
                ) : (
                    <div className="caseStudy-list">
                        {caseStudyData.map(caseStudy => (
                            <div key={caseStudy._id} className="caseStudy-item">
                                <div className="caseStudy-content">
                                    <div className="autherDetails">
                                        <img src={caseStudy.createdBy.profilePic ? `${baseUrl}/uploads/profileImages/profilePic/${caseStudy.createdBy.profilePic}` : 'https://via.placeholder.com/130'} className='blog-author-profilePic' alt="Profile Pic" />
                                        <p className="caseStudy-author">{caseStudy.createdBy.firstname} {caseStudy.createdBy.lastname}</p>
                                        <p className="caseStudy-date">{formatDistanceToNow(new Date(caseStudy.createdAt), { addSuffix: true })}</p>
                                        <Button size='small' type='primary'>Follow</Button>
                                    </div>
                                    <h2 className="caseStudy-title">{caseStudy.title}</h2>
                                    <p className="caseStudy-description">{caseStudy.content}</p>
                                    <div className="blogs-actions">
                                        <Button danger onClick={() => showCommentsDrawer(caseStudy)} className="caseStudy-comments-link">{caseStudy.comments.length} Comments</Button>
                                        <Button
                                            type="default"
                                            icon={<BookOutlined />}
                                            className="bookmark-button"
                                        />
                                        <Button
                                            type="default"
                                            icon={<ShareAltOutlined />}
                                            className="share-button"
                                        />
                                    </div>

                                </div>
                                <img src={`${baseUrl}/uploads/caseStudyImages/${caseStudy.coverImage}`} alt={caseStudy.title} className="caseStudy-image" />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <Drawer
                title="Add New Case Study"
                placement="right"
                onClose={closeDrawer}
                open={visible}
                width={500}
                className="add-caseStudy-drawer"
            >
                <Form form={form} onFinish={addBLogs} layout="vertical">
                    <Form.Item name="coverImage" valuePropName="fileList" getValueFromEvent={(e) => e.fileList} rules={[{ required: true, message: 'Please upload a cover image!' }]}>
                        <Upload beforeUpload={() => false} maxCount={1} listType="picture">
                            <Button>Upload Cover Image</Button>
                        </Upload>
                    </Form.Item>
                    <Form.Item name="title" rules={[{ required: true, message: 'Please input the title of the caseStudy!' }]}>
                        <AntInput placeholder="Enter the title of the caseStudy" />
                    </Form.Item>
                    <Form.Item name="videoUrl" rules={[{ required: true, message: 'Please input the VideoURl of the caseStudy!' }]}>
                        <AntInput placeholder="Enter the VideoUrl of the caseStudy" />
                    </Form.Item>
                    <Form.Item name="category" rules={[{ required: true, message: 'Please select a category!' }]}>
                        <TreeSelect
                            showSearch
                            treeData={categoryTreeData}
                            placeholder="Select Category"
                            treeDefaultExpandAll
                        />
                    </Form.Item>
                    <Form.Item name="content" rules={[{ required: true, validator: validateDescription }]}>
                        <TextArea placeholder="Enter the content of the caseStudy" rows={10} />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" loading={loading} htmlType="submit" className="create-caseStudy-submit-button">Submit</Button>
                    </Form.Item>
                </Form>
            </Drawer>

            <Drawer
                title="Comments"
                placement="right"
                onClose={closeCommentsDrawer}
                open={commentsVisible}
                width={500}
                className="comments-drawer"
            >
                {selectedCaseStudy && (
                    <div className="comments-container">
                        <div className="comments-list">
                            {selectedCaseStudy.comments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map(comment => (
                                <div key={comment._id} className="comment-item">
                                    <p className="comment-user">{comment.user.firstname} {comment.user.lastname}</p>
                                    <p className="comment-date">{formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}</p>
                                    <p className="comment-text">{comment.comment}</p>

                                </div>
                            ))}
                        </div>
                        <Form form={commentForm} onFinish={addComment} layout="vertical" className="comment-form">
                            <Form.Item name="comment" rules={[{ required: true, message: 'Please input your comment!' }]}>
                                <AntInput placeholder="Add a comment" className="comment-input" />
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit" className="add-comment-button">
                                    <CommentOutlined />
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                )}
            </Drawer>
        </div>
    );
}

export default CaseStudy