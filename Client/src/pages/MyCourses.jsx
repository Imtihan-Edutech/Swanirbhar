import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Spin, Pagination, Card, Row, Empty, Button, message } from 'antd';
import { baseUrl } from '../App';
import { Link } from 'react-router-dom';

const { Meta } = Card;

const MyCourses = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 12,
        total: 0
    });
    const [activeButton, setActiveButton] = useState('added');
    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchCourses(pagination.current, pagination.pageSize, activeButton);
    }, [pagination.current, pagination.pageSize, activeButton]);

    const fetchCourses = async (page, limit, type) => {
        setLoading(true);
        try {
            const endpoint = type === 'added' ? '/courses/myAddedCourses' : '/courses/myEnrolledCourses';
            const response = await axios.get(`${baseUrl}${endpoint}`, {
                headers: {
                    Authorization: token
                },
                params: {
                    page,
                    limit
                }
            });
            setCourses(response.data.courses);
            setPagination({
                ...pagination,
                total: response.data.totalData
            });
        } catch (error) {
            message.error(error.response?.data?.message || 'Error fetching courses');
        }
        setLoading(false);
    };

    const handlePageChange = (page) => {
        setPagination({ ...pagination, current: page });
    };

    return (
        <div className="all-courses-container">
            <div className="flex-container">
                <div style={{ display: "flex", gap: "5px" }}>
                    <Button
                        type={activeButton === 'added' ? 'primary' : 'default'}
                        onClick={() => setActiveButton('added')}
                        className="courses-button"
                    >
                        Added Courses
                    </Button>
                    <Button
                        type={activeButton === 'enrolled' ? 'primary' : 'default'}
                        onClick={() => setActiveButton('enrolled')}
                        className="courses-button"
                    >
                        Enrolled Courses
                    </Button>
                </div>
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
                    {courses.length === 0 ? (
                        <div className="empty-results-container">
                            <Empty description="No courses found" />
                        </div>
                    ) : (
                        <Row className="courses-row">
                            {courses.map(course => (
                                <Card
                                    key={course._id}
                                    className="course-card"
                                    actions={[
                                        <Link to={`/dashboard/singleCourse/${course._id}`} className="view-course-link">View Course</Link>
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

export default MyCourses;
