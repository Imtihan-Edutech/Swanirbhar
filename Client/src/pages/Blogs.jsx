import React, { useEffect, useState } from 'react';
import { Button, Input, Drawer, Form, Input as AntInput, TreeSelect, Upload, message, Spin, Empty } from 'antd';
import "../styles/Blogs.css";
import { axiosInstance, baseUrl } from '../App';
import { categoryTreeData } from '../utils/ExtraUtils';
import { BookOutlined, CommentOutlined, ShareAltOutlined } from '@ant-design/icons';
import { formatDistanceToNow } from 'date-fns';

const { TextArea } = AntInput;

const Blogs = () => {
    const [form] = Form.useForm();
    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [blogData, setBlogData] = useState([]);
    const [commentsVisible, setCommentsVisible] = useState(false);
    const [selectedBlog, setSelectedBlog] = useState(null);
    const [commentForm] = Form.useForm();

    useEffect(() => {
        getBLogs();
    }, []);

    useEffect(() => {
        getBLogs();
    }, [searchTerm, selectedCategory]);

    const getBLogs = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get(`${baseUrl}/blog`, {
                params: {
                    title: searchTerm,
                    category: selectedCategory
                }
            });
            setBlogData(response.data.blogs);
        } catch (error) {
            message.error(error.response?.data?.message);
        }
        setLoading(false);
    };

    const addBLogs = async (values) => {
        setLoading(true);
        try {
            const { title, category, content, coverImage } = values;

            const blogData = new FormData();
            blogData.append('title', title);
            blogData.append('category', category);
            blogData.append('content', content);

            if (coverImage) {
                blogData.append('coverImage', coverImage[0].originFileObj);
            }

            const response = await axiosInstance.post(`${baseUrl}/blog`, blogData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            message.success(response.data.message);
            getBLogs();
            setVisible(false);
            form.resetFields();
        } catch (error) {
            message.error(error.response?.data?.message);
        }
        setLoading(false);
    };

    const addComment = async (values) => {
        setLoading(true);
        try {
            const { comment } = values;
            await axiosInstance.post(`${baseUrl}/blog/${selectedBlog._id}/comments`, { comment });
            message.success('Comment added successfully');
            await getBLogs();
            setSelectedBlog(prevBlog => ({
                ...prevBlog,
                comments: [...prevBlog.comments, {
                    comment,
                    user: { firstname: 'You', lastname: '' },
                    createdAt: new Date().toISOString()
                }]
            }));
            commentForm.resetFields();
        } catch (error) {
            message.error(error.response?.data?.message);
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
    const showCommentsDrawer = (blog) => { setSelectedBlog(blog); setCommentsVisible(true); };
    const closeCommentsDrawer = () => { setCommentsVisible(false); };

    const handleShare = (blog) => {
        if (navigator.share) {
            navigator.share({
                title: blog.title,
                url: window.location.href
            }).catch((error) => message.error('Error sharing'));
        } else {
            message.warning('Share feature not supported in this browser');
        }
    };

    return (
        <div className='blogs-container'>
            <div className="blogs-header">
                <Input
                    placeholder="Blog Title And Author"
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
                    <Button type="primary" className="add-blog-button" onClick={showDrawer}>
                        Add Blog
                    </Button>
                </div>
            </div>

            <div className="blog-body">
                {loading ? (
                    <Spin className="loading-spinner" />
                ) : blogData.length === 0 ? (
                    <div className="empty-results">
                        <Empty description="No Blogs Available" />
                    </div>
                ) : (
                    <div className="blog-list">
                        {blogData.map(blog => (
                            <div key={blog._id} className="blog-item">
                                <img src={`${baseUrl}/uploads/blogImages/${blog.coverImage}`} alt={blog.title} className="blog-image" />
                                <div className="blog-content">
                                    <div className="autherDetails">
                                        <img src={blog.createdBy.profilePic ? `${baseUrl}/uploads/profileImages/profilePic/${blog.createdBy.profilePic}` : 'https://via.placeholder.com/130'} className='blog-author-profilePic' alt="Profile Pic" />
                                        <p className="blog-author">{blog.createdBy.firstname} {blog.createdBy.lastname}</p>
                                        <p className="blog-date">{formatDistanceToNow(new Date(blog.createdAt), { addSuffix: true })}</p>
                                        <Button size='small' type='primary'>Follow</Button>
                                    </div>
                                    <h2 className="blog-title">{blog.title}</h2>
                                    <p className="blog-description">{blog.content}</p>

                                    <div className="blogs-actions">
                                        <Button danger onClick={() => showCommentsDrawer(blog)} className="blog-comments-link">{blog.comments.length} Comments</Button>
                                        <Button
                                            type="default"
                                            icon={<BookOutlined />}
                                            className="bookmark-button"
                                        />
                                        <Button
                                            type="default"
                                            icon={<ShareAltOutlined />}
                                            className="share-button"
                                            onClick={() => handleShare(blog)}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <Drawer
                title="Add New Blog"
                placement="right"
                onClose={closeDrawer}
                open={visible}
                width={500}
                className="add-blog-drawer"
            >
                <Form form={form} onFinish={addBLogs} layout="vertical">
                    <Form.Item name="coverImage" valuePropName="fileList" getValueFromEvent={(e) => e.fileList} rules={[{ required: true, message: 'Please upload a cover image!' }]}>
                        <Upload beforeUpload={() => false} maxCount={1} listType="picture">
                            <Button>Upload Cover Image</Button>
                        </Upload>
                    </Form.Item>
                    <Form.Item name="title" rules={[{ required: true, message: 'Please input the title of the article!' }]}>
                        <AntInput placeholder="Enter the title of the Blog" />
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
                        <TextArea placeholder="Enter the content of the Blog" rows={10} />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" loading={loading} htmlType="submit" className="create-blog-submit-button">Submit</Button>
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
                {selectedBlog && (
                    <div className="comments-container">
                        <div className="comments-list">
                            {selectedBlog.comments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map(comment => (
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
                                <Button type="primary" loading={loading} htmlType="submit" className="add-comment-button">
                                    <CommentOutlined />
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                )}
            </Drawer>
        </div>
    );
};

export default Blogs;
