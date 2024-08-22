import React, { useEffect, useState } from 'react';
import { Button, Input, Drawer, Form, Input as AntInput, TreeSelect, Upload, message, Spin, Empty, Modal } from 'antd';
import '../styles/Articles.css';
import {  baseUrl } from '../App';
import { categoryTreeData } from '../utils/ExtraUtils';
import { formatDistanceToNow } from 'date-fns';
import { BookOutlined, ShareAltOutlined } from '@ant-design/icons';
import axios from 'axios';

const { TextArea } = AntInput;

const Articles = () => {
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [articleData, setArticleData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    getArticles();
  }, []);

  useEffect(() => {
    getArticles();
  }, [searchTerm, selectedCategory]);

  const getArticles = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${baseUrl}/article`, {
        headers:{
          Authorization: localStorage.getItem('token')
        },
        params: {
          title: searchTerm,
          category: selectedCategory
        }
      });
      setArticleData(response.data.articles);
    } catch (error) {
      message.error(error.response?.data?.message);
    }
    setLoading(false);
  };

  const addArticles = async (values) => {
    setLoading(true);
    try {
      const { title, description, category, content, coverImage } = values;

      const articleData = new FormData();
      articleData.append('title', title);
      articleData.append('description', description);
      articleData.append('category', category);
      articleData.append('content', content);

      if (coverImage) {
        articleData.append('coverImage', coverImage[0].originFileObj);
      }

      const response = await axios.post(`${baseUrl}/article`, articleData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: localStorage.getItem('token')
        },
      });

      message.success(response.data.message);
      getArticles();
      setVisible(false);
      form.resetFields();
    } catch (error) {
      message.error(error.response?.data?.message);
    }
    setLoading(false);
  };

  const validateDescription = (_, value) => {
    if (!value || value.split(' ').length < 20) {
      return Promise.reject(new Error('Description must be at least 20 words long'));
    }
    if (value.split(' ').length > 25) {
      return Promise.reject(new Error('Description cannot be more than 25 words'));
    }
    return Promise.resolve();
  };

  const showDrawer = () => { setVisible(true); };
  const closeDrawer = () => { setVisible(false); };

  const showModal = (article) => {
    setSelectedArticle(article);
    setModalVisible(true);
  };

  const handleModalCancel = () => {
    setModalVisible(false);
  };

  const handleShare = (article) => {
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.description,
        url: window.location.href,
      })
      .catch((error) => message.error('Error sharing'));
    } else {
      message.warning('Share feature is not supported in this browser');
    }
  };

  return (
    <div className={`articles-container ${modalVisible ? 'modal-blur modal-blur-active' : ''}`}>
      <div className="articles-header">
        <Input
          placeholder="Articles Title And Author"
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
          <Button type="primary" className="add-article-button" onClick={showDrawer}>
            Add Article
          </Button>
        </div>
      </div>

      <div className="article-body">
        {loading ? (
          <Spin className="loading-spinner" />
        ) : articleData.length === 0 ? (
          <div className="empty-results">
            <Empty description="No Articles Available" />
          </div>
        ) : (
          <div className="article-grid">
            {articleData.map((article) => (
              <div key={article._id} className="article-card">
                <div className="coverImage-container">
                  <img src={`${baseUrl}/uploads/articleImages/${article.coverImage}`} alt="cover" className="coverImage" />
                </div>
                <div className="article-content">
                  <h3 className="article-title">{article.title}</h3>
                  <p className="article-description">{article.description}</p>
                  <div className="article-details">
                    <img src={article.createdBy.profilePic ? `${baseUrl}/uploads/profileImages/profilePic/${article.createdBy.profilePic}` : 'https://via.placeholder.com/130'} className='article-author-profilePic' alt="Profile Pic" />
                    <div>
                      <p className="article-author">{article.createdBy.firstname} {article.createdBy.lastname}</p>
                      <p className="article-date">{formatDistanceToNow(new Date(article.createdAt), { addSuffix: true })}</p>
                    </div>

                  </div>
                  <div className="article-actions">
                    <Button
                      type="default"
                      danger
                      onClick={() => showModal(article)}
                      className="read-more-button"
                    >
                      Read More
                    </Button>
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
            ))}
          </div>
        )}
      </div>

      <Drawer
        title="Add New Article"
        placement="right"
        onClose={closeDrawer}
        open={visible}
        width={500}
      >
        <Form form={form} onFinish={addArticles} layout="vertical">
          <Form.Item name="coverImage" valuePropName="fileList" getValueFromEvent={(e) => e.fileList} rules={[{ required: true, message: 'Please upload a cover image!' }]}>
            <Upload beforeUpload={() => false} maxCount={1} listType="picture">
              <Button>Upload Cover Image</Button>
            </Upload>
          </Form.Item>
          <Form.Item name="title" rules={[{ required: true, message: 'Please input the title of the article!' }]}>
            <AntInput placeholder="Enter the title of the article" />
          </Form.Item>
          <Form.Item name="category" rules={[{ required: true, message: 'Please select a category!' }]}>
            <TreeSelect
              showSearch
              treeData={categoryTreeData}
              placeholder="Select Category"
              treeDefaultExpandAll
            />
          </Form.Item>
          <Form.Item name="description" rules={[{ required: true, validator: validateDescription }]}>
            <TextArea placeholder="Enter a brief description" rows={4} />
          </Form.Item>
          <Form.Item name="content" rules={[{ required: true, message: 'Please input the content of the article!' }]}>
            <TextArea placeholder="Enter the content of the article" rows={8} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" loading={loading} htmlType="submit" className="create-article-submit-button">Submit</Button>
          </Form.Item>
        </Form>
      </Drawer>

      <Modal
        open={modalVisible}
        onCancel={handleModalCancel}
        footer={null}
        width={700}
        className="article-modal"
        style={{ top: "60px" }}
      >
        {selectedArticle ? (
          <div className="article-modal-content">
            <div className="modal-header">
              <img src={`${baseUrl}/uploads/articleImages/${selectedArticle.coverImage}`} alt="cover" />
              <div className="details">
                <h2>{selectedArticle.title}</h2>
                <p><strong>Category:</strong> {selectedArticle.category}</p>
                <p><strong>Description:</strong> {selectedArticle.description}</p>
                <p><strong>Author:</strong> {selectedArticle.createdBy.firstname} {selectedArticle.createdBy.lastname}</p>
                <p><strong>Date:</strong> {new Date(selectedArticle.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
              </div>
            </div>
            <div className="modal-content">
              <p>{selectedArticle.content}</p>
            </div>
          </div>
        ) : (
          <p>No article selected.</p>
        )}
      </Modal>
    </div>
  );
};

export default Articles;
