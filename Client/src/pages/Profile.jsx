import React, { useEffect, useState } from 'react';
import { Button, message, Spin, Drawer, Form, Input, Upload, Menu } from 'antd';
import {
    EditOutlined,
} from '@ant-design/icons';
import { Link, Route, Routes, useLocation, Navigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Profile.css';
import { axiosInstance, baseUrl } from '../App';
import PrivateRoute from '../AllRoutes/PrivateRoutes';
import facebook from '../images/facebook-1.png'
import linkedin from '../images/linkedin.png'
import github from '../images/github.png'
import twitter from '../images/twitter.png'
import youtube from '../images/youtube.png'

const Profile = () => {
    const [user, setUser] = useState({});
    const [courseCount , setCourseCount] = useState([]);
    const [loading, setLoading] = useState(false);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [form] = Form.useForm();
    const userId = localStorage.getItem("userId");
    const location = useLocation();

    useEffect(() => {
        fetchUserDetails();
        fetchCourseDetails();
    }, []);

    const fetchCourseDetails = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get(`${baseUrl}/course/myEnrolledCourses`);
            setCourseCount(response.data.totalData);
            console.log(response.data.totalData);
            
        }
        catch (error) {
            if (error.response && error.response.data) {
                message.error(error.response.data.message);
            }
        }
        setLoading(false);
    }

    const fetchUserDetails = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${baseUrl}/user/${userId}`);
            setUser(response.data);
        } 
        catch (error) {
            if (error.response && error.response.data) {
                message.error(error.response.data.message);
            }
        }
        setLoading(false);
    };

    const showDrawer = () => {
        form.setFieldsValue({
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            designation: user.designation,
            educations: user.educations,
            skills: user.skills,
            experience: user.experience,
            facebook: user.socials?.facebook,
            linkedin: user.socials?.linkedin,
            github: user.socials?.github,
            twitter: user.socials?.twitter,
            youtube: user.socials?.youtube,
        });
        setDrawerVisible(true);
    };

    const onFinish = async (formData) => {
        console.log(formData);
        try {
            const { firstname, lastname, phoneNumber, designation, educations, skills, experience, facebook, linkedin, github, twitter, youtube, profilePic, coverImage } = formData;

            const updatedData = new FormData();
            updatedData.append('firstname', firstname);
            updatedData.append('lastname', lastname);
            updatedData.append('phoneNumber', phoneNumber);
            updatedData.append('designation', designation);
            updatedData.append('educations', JSON.stringify(educations));
            updatedData.append('skills', JSON.stringify(skills));
            updatedData.append('experience', JSON.stringify(experience));
            updatedData.append('facebook', facebook);
            updatedData.append('linkedin', linkedin);
            updatedData.append('github', github);
            updatedData.append('twitter', twitter);
            updatedData.append('youtube', youtube);

            if (profilePic) {
                updatedData.append('profilePic', profilePic[0].originFileObj);
            }
            if (coverImage) {
                updatedData.append('coverImage', coverImage[0].originFileObj);
            }

            const response = await axios.put(`${baseUrl}/user/updateDetails/${user._id}`, updatedData);
            message.success(response.data.message);
            fetchUserDetails();
            setDrawerVisible(false);
        } catch (error) {
            if (error.response && error.response.data) {
                message.error(error.response.data.message);
            }
        }
    };
 
    const onClose = () => { setDrawerVisible(false); };

    return (
        <div className="profile-page-container">
            {loading ? <Spin className="loading-spinner" /> : (
                <>
                    <div className="banner" style={{ backgroundImage: `url(${user.coverImage ? `${baseUrl}/uploads/profileImages/coverImage/${user.coverImage}` : 'https://via.placeholder.com/800x200'})` }}>
                        <div className="about-container">
                            <div className="profile-content">
                                <div className="profile-picture">
                                    <img src={user.profilePic ? `${baseUrl}/uploads/profileImages/profilePic/${user.profilePic}` : 'https://via.placeholder.com/130'} alt="Profile Pic" />
                                </div>
                                <div className="info-items">
                                    <h2>{user.firstname} {user.lastname}</h2>
                                    <div className="stats-container">
                                        <div className="stats-item">
                                            <span className="stats-count">{courseCount}</span>
                                            <span className="stats-title">Courses</span>
                                        </div>
                                        <div className="divider-line"></div>
                                        <div className="stats-item">
                                            <span className="stats-count">{user.followers?.length}</span>
                                            <span className="stats-title">Followers</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="social-container">
                                <div className="social-links">
                                    <a href={user.socials?.facebook} target="_blank" rel="noopener nore ferrer">
                                        <img src={facebook} alt="Facebook URL" className='user-social-icons' />
                                    </a>
                                    <a href={user.socials?.linkedin} target="_blank" rel="noopener noreferrer">
                                        <img src={linkedin} alt="LinkedIn URL" className='user-social-icons' />
                                    </a>
                                    <a href={user.socials?.github} target="_blank" rel="noopener noreferrer">
                                        <img src={github} alt="GitHub URL" className='user-social-icons' />
                                    </a>
                                    <a href={user.socials?.twitter} target="_blank" rel="noopener noreferrer">
                                        <img src={twitter} alt="Twitter URL" className='user-social-icons' />
                                    </a>
                                    <a href={user.socials?.youtube} target="_blank" rel="noopener noreferrer">
                                        <img src={youtube} alt="YouTube URL" className='user-social-icons' />
                                    </a>
                                </div>
                                <Button className="edit-button" onClick={showDrawer}>Edit</Button>
                            </div>
                        </div>
                    </div>

                    <div className="profile-page-content">
                        <Menu mode="horizontal" selectedKeys={[location.pathname]} >
                            <Menu.Item key="/dashboard/profile/about">
                                <Link to="/dashboard/profile/about" className='navbar-link'>About</Link>
                            </Menu.Item>
                            <Menu.SubMenu key="/dashboard/profile/courses" title="Courses" className='navbar-link'>
                                <Menu.Item key="/dashboard/profile/courses/enrolled">
                                    <Link to="/dashboard/profile/courses/enrolled" className='navbar-link'>Enrolled Courses</Link>
                                </Menu.Item>
                                <Menu.Item key="/dashboard/profile/courses/added">
                                    <Link to="/dashboard/profile/courses/added" className='navbar-link'>Added Courses</Link>
                                </Menu.Item>
                            </Menu.SubMenu>
                            <Menu.Item key="/dashboard/profile/products">
                                <Link to="/dashboard/profile/products" className='navbar-link'>Products</Link>
                            </Menu.Item>
                            <Menu.Item key="/dashboard/profile/articles">
                                <Link to="/dashboard/profile/articles" className='navbar-link'>Articles</Link>
                            </Menu.Item>
                            <Menu.Item key="/dashboard/profile/blogs">
                                <Link to="/dashboard/profile/blogs" className='navbar-link'>Blogs</Link>
                            </Menu.Item>
                            <Menu.Item key="/dashboard/profile/case-study">
                                <Link to="/dashboard/profile/case-study" className='navbar-link'>Case Study</Link>
                            </Menu.Item>
                            <Menu.Item key="/dashboard/profile/forum">
                                <Link to="/dashboard/profile/forum" className='navbar-link'>Forum</Link>
                            </Menu.Item>
                            <Menu.Item key="/dashboard/profile/badges">
                                <Link to="/dashboard/profile/badges" className='navbar-link'>Badges</Link>
                            </Menu.Item>
                        </Menu>

                        <Routes>
                            <Route path="about" element={<PrivateRoute><div>About</div></PrivateRoute>} />
                            <Route path="courses/enrolled" element={<PrivateRoute><div>Enrolled Courses</div></PrivateRoute>} />
                            <Route path="courses/added" element={<PrivateRoute><div>Added Courses</div></PrivateRoute>} />
                            <Route path="products" element={<PrivateRoute><div>Products</div></PrivateRoute>} />
                            <Route path="articles" element={<PrivateRoute><div>Articles</div></PrivateRoute>} />
                            <Route path="blogs" element={<PrivateRoute><div>Blogs</div></PrivateRoute>} />
                            <Route path="case-study" element={<PrivateRoute><div>Case Study</div></PrivateRoute>} />
                            <Route path="forum" element={<PrivateRoute><div>Forum</div></PrivateRoute>} />
                            <Route path="badges" element={<PrivateRoute><div>Badges</div></PrivateRoute>} />
                            <Route path="/" element={<Navigate to="about" replace />} />
                        </Routes>
                    </div>
                </>
            )}
            <Drawer
                title="Edit Profile"
                width={480}
                onClose={onClose}
                visible={drawerVisible}
            >
                <Form form={form} onFinish={onFinish} layout="vertical">
                    <div style={{ display: "flex", gap: "10px" }}>
                    <Form.Item name="profilePic" valuePropName='fileList' getValueFromEvent={e => e.fileList} style={{flex:"1"}}>
                        <Upload name='profilePic' listType='picture' beforeUpload={() => false} maxCount={1}>
                            <Button icon={<EditOutlined />}>Upload Profile Photo</Button>
                        </Upload>
                    </Form.Item>
                    <Form.Item name="coverImage" valuePropName='fileList' getValueFromEvent={e => e.fileList} style={{flex:"1"}}>
                        <Upload name='coverImage' listType='picture' beforeUpload={() => false} maxCount={1}>
                            <Button icon={<EditOutlined />}>Upload Cover Image</Button>
                        </Upload>
                    </Form.Item>
                    </div>
                    <div style={{ display: "flex", gap: "10px" }}>
                        <Form.Item name="firstname" rules={[{ required: true, message: 'Please enter your first name' }]} style={{flex:"1"}}>
                            <Input placeholder='Enter FirstName' />
                        </Form.Item>
                        <Form.Item name="lastname" rules={[{ required: true, message: 'Please enter your last name' }]} style={{flex:"1"}}>
                            <Input placeholder='Enter LastName' />
                        </Form.Item>
                    </div>
                    <Form.Item name="email">
                        <Input placeholder='Enter Email' disabled />
                    </Form.Item>
                    <div style={{ display: "flex", gap: "10px" }}>
                    <Form.Item name="phoneNumber" rules={[{ required: true, message: 'Please enter your phone number' }]} style={{flex:"1"}}>
                        <Input placeholder='Enter PhoneNumber' />
                    </Form.Item>
                    <Form.Item name="designation" style={{flex:"1"}}>
                        <Input placeholder='Enter Designation' />
                    </Form.Item>
                    </div>
                    <Form.List name="educations">
                        {(fields, { add, remove }) => (
                            <>
                                {fields.map(({ key, name, fieldKey, ...restField }) => (
                                    <Form.Item
                                        key={key}
                                        {...restField}
                                        name={[name]}
                                        fieldKey={[fieldKey]}
                                        rules={[{ required: true, message: 'Please enter an Education Details' }]}
                                        style={{ marginBottom: '8px' }}
                                    >
                                        <Input
                                            placeholder='Education'
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
                                        Add Eduaction Details
                                    </Button>
                                </Form.Item>
                            </>
                        )}
                    </Form.List>
                    <Form.List name="skills">
                        {(fields, { add, remove }) => (
                            <>
                                {fields.map(({ key, name, fieldKey, ...restField }) => (
                                    <Form.Item
                                        key={key}
                                        {...restField}
                                        name={[name]}
                                        fieldKey={[fieldKey]}
                                        rules={[{ required: true, message: 'Please enter Your Skills' }]}
                                        style={{ marginBottom: '8px' }}
                                    >
                                        <Input
                                            placeholder='Skills'
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
                                        Add Skills
                                    </Button>
                                </Form.Item>
                            </>
                        )}
                    </Form.List>
                    <Form.List name="experience">
                        {(fields, { add, remove }) => (
                            <>
                                {fields.map(({ key, name, fieldKey, ...restField }) => (
                                    <Form.Item
                                        key={key}
                                        {...restField}
                                        name={[name]}
                                        fieldKey={[fieldKey]}
                                        rules={[{ required: true, message: 'Please enter an experience' }]}
                                        style={{ marginBottom: '8px' }}
                                    >
                                        <Input
                                            placeholder='Experience'
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
                                        Add experience Details
                                    </Button>
                                </Form.Item>
                            </>
                        )}
                    </Form.List>
                    <Form.Item name="facebook">
                        <Input placeholder='Facebook Link' />
                    </Form.Item>
                    <Form.Item name="linkedin">
                        <Input placeholder='LinkedIn Link' />
                    </Form.Item>
                    <Form.Item name="github">
                        <Input placeholder='GitHub Link' />
                    </Form.Item>
                    <Form.Item name="twitter">
                        <Input placeholder='Twitter Link' />
                    </Form.Item>
                    <Form.Item name="youtube">
                        <Input placeholder='YouTube Link' />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" style={{width:"100%"}} loading={loading} htmlType="submit">Save Changes</Button>
                    </Form.Item>
                </Form>
            </Drawer>
        </div>
    );
};

export default Profile;
