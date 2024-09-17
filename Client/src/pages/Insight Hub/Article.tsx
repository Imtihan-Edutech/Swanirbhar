import { useEffect, useState } from 'react';
import { Button, Input, Drawer, Form, Input as AntInput, TreeSelect, Upload, message, Spin, Empty, Breadcrumb } from 'antd';
import { formatDistanceToNow } from 'date-fns';
import { BookOutlined, HomeOutlined, ShareAltOutlined } from '@ant-design/icons';
import axios from 'axios';
import { baseURL } from '../../App';
import { categoryTreeData } from '../../utils/ExtraUtils';

const { TextArea } = AntInput;

interface Article {
    _id: string;
    title: string;
    category: string;
    content: string;
    coverImage: string;
    createdBy: {
        profilePic?: string;
        fullName: string;
    };
    createdAt: string;
}

const Article = () => {
    const [form] = Form.useForm();
    const [visible, setVisible] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [drawerVisible, setDrawerVisible] = useState<boolean>(false);
    const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
    const [articleData, setArticleData] = useState<Article[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [selectedCategory, setSelectedCategory] = useState<string>('');

    useEffect(() => {
        getArticles();
    }, [searchTerm, selectedCategory]);

    const getArticles = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${baseURL}/article`, {
                headers: {
                    Authorization: localStorage.getItem('token'),
                },
                params: {
                    title: searchTerm,
                    category: selectedCategory,
                },
            });
            setArticleData(response.data.articles);
        } catch (error: any) {
            message.error(error.response?.data?.message);
        }
        setLoading(false);
    };

    const addArticles = async (values: any) => {
        setLoading(true);
        try {
            const { title, category, content, coverImage } = values;

            const articleData = new FormData();
            articleData.append('title', title);
            articleData.append('category', category);
            articleData.append('content', content);

            if (coverImage) {
                articleData.append('coverImage', coverImage[0].originFileObj);
            }

            const response = await axios.post(`${baseURL}/article`, articleData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: localStorage.getItem('token'),
                },
            });

            message.success(response.data.message);
            getArticles();
            setVisible(false);
            form.resetFields();
        } catch (error: any) {
            message.error(error.response?.data?.message);
        }
        setLoading(false);
    };

    const showDrawer = () => setVisible(true);
    const closeDrawer = () => setVisible(false);

    const openArticleDrawer = (article: Article) => {
        setSelectedArticle(article);
        setDrawerVisible(true);
    };

    const closeArticleDrawer = () => setDrawerVisible(false);

    const handleShare = (article: Article) => {
        if (navigator.share) {
            navigator
                .share({
                    title: article.title,
                    text: article.content,
                    url: window.location.href,
                })
                .catch(() => message.error('Error sharing'));
        } else {
            message.warning('Share feature is not supported in this browser');
        }
    };

    return (
        <div>
            <div className="shadow-lg bg-white py-4 px-6 flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
                <h1 className="text-2xl font-semibold text-gray-800">Insight's Hub</h1>
                <Breadcrumb className="text-gray-600">
                    <Breadcrumb.Item href="/dashboard">
                        <HomeOutlined />
                    </Breadcrumb.Item>
                    <Breadcrumb.Item className="font-bold text-gray-800">
                        Insight's Hub
                    </Breadcrumb.Item>
                </Breadcrumb>
            </div>

            <div className="py-4 flex flex-wrap items-center justify-between space-y-4 md:space-y-0">
                <Input
                    placeholder="Search Articles"
                   className="w-full md:w-1/3 mr-0 md:mr-4"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="flex flex-col md:flex-row items-center justify-between w-full md:w-auto space-y-4 md:space-y-0 md:space-x-4">
                    <TreeSelect
                        showSearch
                        treeData={categoryTreeData}
                        placeholder="Select Category"
                        treeDefaultExpandAll
                        className="w-full md:w-52"
                        value={selectedCategory}
                        onChange={(value) => setSelectedCategory(value)}
                    />
                    <Button type="primary" className="w-full md:w-auto" onClick={showDrawer}>
                        Add Article
                    </Button>
                </div>
            </div>

            <div className="article-body p-4">
                {loading ? (
                    <div className="flex justify-center items-center h-[80vh]">
                        <Spin className="loading-spinner" />
                    </div>
                ) : articleData.length === 0 ? (
                    <div className="flex justify-center items-center h-[90vh]">
                        <Empty description="No Articles Available" />
                    </div>
                ) : (
                    <div className="article-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {articleData.map((article) => (
                            <div key={article._id} className="article-card border rounded-lg shadow-md">
                                <div className="coverImage-container mb-4">
                                    <img
                                        src={`${baseURL}/uploads/articleImages/${article.coverImage}`}
                                        alt="cover"
                                        className="coverImage w-full h-48 object-cover rounded-lg"
                                    />
                                </div>
                                <div className="p-3">
                                    <h3 className="article-title text-xl font-semibold mb-2 truncate">{article.title}</h3>
                                    <div className="article-details text-ellipsis overflow-hidden line-clamp-3 mb-4">
                                        {article.content}
                                    </div>
                                    <div className="article-details flex items-center mb-4">
                                        <img
                                            src={
                                                article.createdBy.profilePic
                                                    ? `${baseURL}/uploads/profileImages/profilePic/${article.createdBy.profilePic}`
                                                    : 'https://via.placeholder.com/130'
                                            }
                                            className="article-author-profilePic w-12 h-12 rounded-full mr-4"
                                            alt="Profile Pic"
                                        />
                                        <div>
                                            <p className="text-xm font-medium">
                                                {article.createdBy.fullName}
                                            </p>
                                            <p className="text-[12px] text-gray-500">
                                                {formatDistanceToNow(new Date(article.createdAt), { addSuffix: true })}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="article-actions flex justify-between">
                                        <Button
                                            type="default"
                                            danger
                                            onClick={() => openArticleDrawer(article)}
                                            className="read-more-button"
                                        >
                                            Read More
                                        </Button>
                                        <div className='flex gap-2'>
                                            <Button
                                                type="default"
                                                icon={<BookOutlined />}
                                                className="bookmark-button"
                                            />
                                            <Button
                                                type="default"
                                                icon={<ShareAltOutlined />}
                                                className="share-button"
                                                onClick={() => handleShare(article)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <Drawer title="Add New Article" placement="right" onClose={closeDrawer} open={visible} width={500}>
                <Form form={form} onFinish={addArticles} layout="vertical">
                    <Form.Item
                        label="Cover Image"
                        name="coverImage"
                        valuePropName="fileList"
                        getValueFromEvent={(e) => e.fileList}
                        rules={[{ required: true, message: 'Please upload a cover image!' }]}
                    >
                        <Upload beforeUpload={() => false} maxCount={1} listType="picture">
                            <Button>Upload Cover Image</Button>
                        </Upload>
                    </Form.Item>
                    <Form.Item
                        label="Title"
                        name="title"
                        rules={[{ required: true, message: 'Please input the title of the article!' }]}
                    >
                        <AntInput placeholder="Enter the title of the article" />
                    </Form.Item>
                    <Form.Item
                        label="Category"
                        name="category"
                        rules={[{ required: true, message: 'Please select a category!' }]}
                    >
                        <TreeSelect
                            showSearch
                            treeData={categoryTreeData}
                            placeholder="Select Category"
                            treeDefaultExpandAll
                        />
                    </Form.Item>
                    <Form.Item
                        label="Content"
                        name="content"
                        rules={[{ required: true, message: 'Please input the content of the article!' }]}
                    >
                        <TextArea placeholder="Enter the content of the article" rows={8} />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" block loading={loading}>
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </Drawer>

            <Drawer title={selectedArticle?.title} placement="right" onClose={closeArticleDrawer} open={drawerVisible} width={600}>
                <div>
                    <img
                        src={`${baseURL}/uploads/articleImages/${selectedArticle?.coverImage}`}
                        alt="cover"
                        className="w-full h-52 object-cover rounded-lg mb-4"
                    />
                    <p className=" text-base mb-4">{selectedArticle?.content}</p>
                    <div className="flex items-center">
                        <img
                            src={
                                selectedArticle?.createdBy.profilePic
                                    ? `${baseURL}/uploads/profileImages/profilePic/${selectedArticle?.createdBy.profilePic}`
                                    : 'https://via.placeholder.com/130'
                            }
                            className="w-12 h-12 rounded-full mr-4"
                            alt="Profile Pic"
                        />
                        <div>
                            <p className="articleDrawer-author text-sm font-medium">
                                {selectedArticle?.createdBy.fullName}
                            </p>
                            <p className="articleDrawer-date text-xs text-gray-500">
                                {selectedArticle?.createdAt &&
                                    formatDistanceToNow(new Date(selectedArticle.createdAt), { addSuffix: true })}
                            </p>
                        </div>
                    </div>
                </div>
            </Drawer>
        </div>
    );
};

export default Article;
