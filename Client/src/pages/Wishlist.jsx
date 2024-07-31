import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, Empty, Pagination, Row, Spin, message } from 'antd';
import { HeartOutlined, HeartFilled } from '@ant-design/icons';
import axios from 'axios';
import Meta from 'antd/es/card/Meta';
import { baseUrl } from '../App';

const Wishlist = () => {
  const [wishListData, setWishListData] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 12,
    total: 0
  });

  useEffect(() => {
    fetchWishlist();
  }, [pagination.current, pagination.pageSize]);

  const fetchWishlist = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${baseUrl}/user/${userId}`, {
        headers: {
          Authorization: token
        }
      });
      setWishListData(response.data.wishlist);
      setWishlist(response.data.wishlist.map(item => item._id));
      setPagination({ ...pagination, total: response.data.wishlist.length }); 
    } catch (error) {
      message.error(error.response?.data?.message);
    } finally {
      setLoading(false); 
    }
  };

  const removeFromWishlist = async (courseId) => {
    try {
      const response = await axios.delete(`${baseUrl}/user/wishlist`, {
        headers: {
          Authorization: token
        },
        data: {
          courseId
        }
      });
      message.success(response.data.message);
      fetchWishlist();
    } catch (error) {
      message.error(error.response?.data?.message);
    }
  };

  const handlePageChange = (page) => {
    setPagination({ ...pagination, current: page });
  };

  return (
    <div className="wishlist-container">
      <div className="flex-container">
        <div className="pagination-container">
          <Pagination
            total={pagination.total}
            current={pagination.current}
            pageSize={pagination.pageSize}
            onChange={handlePageChange}
            showTotal={(total) => `Total ${total} Courses`}
          />
        </div>
      </div>

      {loading ? (
        <Spin className="loading-spinner" />
      ) : (
        <>
          {wishListData.length === 0 ? (
            <div className="empty-results-container">
              <Empty description="No courses found" />
            </div>
          ) : (
            <Row className="courses-row">
              {wishListData.map(course => (
                <Card
                  key={course._id}
                  className="course-card"
                  actions={[
                    <Link to={`/dashboard/singleCourse/${course._id}`} className="view-course-link">View Course</Link>,
                    wishlist.includes(course._id) ? (
                      <HeartFilled onClick={() => removeFromWishlist(course._id)} className="wishlist-icon" style={{ color: "red" }} />
                    ) : (
                      <HeartOutlined className="wishlist-icon" />
                    )
                  ]}
                >
                  <div className="course-image-container">
                    <img className="course-image" src={`${baseUrl}/uploads/thumbnails/${course.thumbnail}`} alt="Course Thumbnail" />
                  </div>
                  <Meta
                    title={course.courseName}
                    description={
                      <div>
                        <p className="course-instructor">Instructor: {course.createdBy.firstname} {course.createdBy.lastname}</p>
                        <p className="course-price">Price: $ {course.price} </p>
                        <p className="course-category">Category: {course.category}</p>
                        <p className="course-level">Level: {course.level}</p>
                      </div>
                    }
                  />
                </Card>
              ))}
            </Row>
          )}
        </>
      )}
    </div>
  );
};

export default Wishlist;
