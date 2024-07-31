import React, { useEffect, useState } from 'react';
import { Layout, Menu, Button, FloatButton, Modal, Tooltip } from 'antd';
import { Link, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import PrivateRoute from '../AllRoutes/PrivateRoutes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faHomeUser, faBook, faAward, faMoneyBill, faTools, faBullhorn, faCog, faAngleDoubleRight, faAngleDoubleLeft,
    faBell, faHeart, faShoppingCart, faNewspaper, faClipboard, faLightbulb,
    faBrain, faInbox, faUserFriends, faComments, faChalkboardTeacher, faStore, faTasks, faSignOutAlt
} from '@fortawesome/free-solid-svg-icons';
import ChatBox from './ChatBox';
import logo from "../images/logo.png";
import '../styles/Dashboard.css';
import Course from '../pages/Course';
import Profile from '../pages/Profile';
import Articles from '../pages/Articles';
import Blogs from '../pages/Blogs';
import CaseStudy from '../pages/CaseStudy';
import { axiosInstance, baseUrl } from '../App';
import axios from 'axios';
import Notifications from '../pages/Notifications';
import Wishlist from '../pages/Wishlist';

const { Header, Sider, Content } = Layout;
const { SubMenu } = Menu;

const Dashboard = () => {
    const location = useLocation();
    const [collapsed, setCollapsed] = useState(false);
    const [courseCount , setCourseCount] = useState([]);
    const [rightSidebarCollapsed, setRightSidebarCollapsed] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const userId = localStorage.getItem("userId");
    const [user, setUser] = useState({});
    const Navigate = useNavigate();

    useEffect(() => {
        fetchUserDetails();
        fetchCourseDetails();
    }, []);

    const fetchUserDetails = async () => {
        try {
            const response = await axios.get(`${baseUrl}/user/${userId}`);
            setUser(response.data);

        } catch (error) {
            if (error.response && error.response.data) {
                message.error(error.response.data.message);
            }
        }
    };

    const fetchCourseDetails = async () => {
        try {
            const response = await axiosInstance.get(`${baseUrl}/course/myEnrolledCourses`);
            setCourseCount(response.data.totalData);
        }
        catch (error) {
            if (error.response && error.response.data) {
                message.error(error.response.data.message);
            }
        }
    }

    const handleLogout = () => {
        Modal.confirm({
            title: 'Confirm Logout',
            content: 'Are you sure you want to log out?',
            okText: 'Yes',
            cancelText: 'No',
            onOk: () => {
                localStorage.removeItem('token');
                localStorage.removeItem('userId');
                Navigate('/login');
            },
        });
    };

    return (
        <Layout>
            <Sider
                width={230}
                className="sidebar"
                trigger={null}
                collapsible
                collapsed={collapsed}
                theme="light"
            >
                <div className={`logo-container ${collapsed ? 'collapsed' : ''}`}>
                    <img src={logo} alt="Logo" className="logo-icon" />
                    {!collapsed && <span className="logo-text">Swanirbhar</span>}
                </div>

                <div className={`profile-container ${collapsed ? 'collapsed' : ''}`}>
                    <div className={`profile-image-container ${collapsed ? 'collapsed' : ''}`}>
                        <img src={user.profilePic ? `${baseUrl}/uploads/profileImages/profilePic/${user.profilePic}` : 'https://via.placeholder.com/130'} className={`profile-image ${collapsed ? 'collapsed' : ''}`} alt="Profile Pic" />
                    </div>
                    {!collapsed && (
                        <div className="profile-details">
                            <div className="profile-name-container">
                                <Link className="profile-name" to="/dashboard/profile">{user.firstname} {user.lastname}</Link>
                            </div>
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
                    )}
                </div>

                <Menu className='menu-items' selectedKeys={[location.pathname]}>
                    <Menu.Item key="/dashboard/task-management" icon={<FontAwesomeIcon icon={faTasks} />}>
                        <Link to="/dashboard/task-management" className='navbar-link'>Task Management</Link>
                    </Menu.Item>
                    <SubMenu key="public-relation" className='navbar-link' icon={<FontAwesomeIcon icon={faBook} />} title="Public Relation">
                        <Menu.Item key="/dashboard/public-relation/articles" icon={<FontAwesomeIcon icon={faClipboard} />}>
                            <Link to="/dashboard/public-relation/articles" className="navbar-link">Articles</Link>
                        </Menu.Item>
                        <Menu.Item key="/dashboard/public-relation/blogs" icon={<FontAwesomeIcon icon={faNewspaper} />}>
                            <Link to="/dashboard/public-relation/blogs" className="navbar-link">Blogs</Link>
                        </Menu.Item>
                        <Menu.Item key="/dashboard/public-relation/case-studies" icon={<FontAwesomeIcon icon={faLightbulb} />}>
                            <Link to="/dashboard/public-relation/case-studies" className="navbar-link">Case Studies</Link>
                        </Menu.Item>
                    </SubMenu>
                    <Menu.Item key="/dashboard/assesment" icon={<FontAwesomeIcon icon={faAward} />}>
                        <Link to="/dashboard/assesment" className='navbar-link'>Assessment</Link>
                    </Menu.Item>
                    <Menu.Item key="/dashboard/financial" icon={<FontAwesomeIcon icon={faMoneyBill} />}>
                        <Link to="/dashboard/financial" className='navbar-link'>Financial</Link>
                    </Menu.Item>
                    <Menu.Item key="/dashboard/support" icon={<FontAwesomeIcon icon={faTools} />}>
                        <Link to="/dashboard/support" className='navbar-link'>Support</Link>
                    </Menu.Item>
                    <Menu.Item key="/dashboard/marketing" icon={<FontAwesomeIcon icon={faBullhorn} />}>
                        <Link to="/dashboard/marketing" className='navbar-link'>Marketing</Link>
                    </Menu.Item>
                    <Menu.Item key="/dashboard/settings" icon={<FontAwesomeIcon icon={faCog} />}>
                        <Link to="/dashboard/settings" className='navbar-link'>Settings</Link>
                    </Menu.Item>
                    <Menu.Item className='logout-btn' icon={<FontAwesomeIcon icon={faSignOutAlt} />}>
                        <Link className='navbar-link' onClick={handleLogout}>Logout</Link>
                    </Menu.Item>
                </Menu>
            </Sider>
            <Sider
                width={230}
                className="right-sidebar"
                theme="light"
                style={{ height: '100vh', position: 'fixed', right: 0, overflow: "auto" }}
                trigger={null}
                collapsible
                collapsed={rightSidebarCollapsed}
            >
                <Menu className='right-menu' selectedKeys={location.pathname} >
                    <Menu.Item key="/dashboard/home" icon={<FontAwesomeIcon icon={faHomeUser} />}>
                        <Link to="/dashboard/home" className='navbar-link'>Home</Link>
                    </Menu.Item>
                    <Menu.Item key="/dashboard/ai-tools" icon={<FontAwesomeIcon icon={faBrain} />}>
                        <Link to="/dashboard/ai-tools" className='navbar-link'>AI Tools</Link>
                    </Menu.Item>
                    <Menu.Item key="/dashboard/inbox" icon={<FontAwesomeIcon icon={faInbox} />}>
                        <Link to="/dashboard/inbox" className='navbar-link'>Inbox</Link>
                    </Menu.Item>
                    <Menu.Item key="/dashboard/creators-near-me" icon={<FontAwesomeIcon icon={faUserFriends} />}>
                        <Link to="/dashboard/creators-near-me" className='navbar-link'>Creators Near Me</Link>
                    </Menu.Item>
                    <Menu.Item key="/dashboard/forum" icon={<FontAwesomeIcon icon={faComments} />}>
                        <Link to="/dashboard/forum" className='navbar-link'>Forum</Link>
                    </Menu.Item>
                    <Menu.Item key="/dashboard/courses" icon={<FontAwesomeIcon icon={faChalkboardTeacher} />}>
                        <Link to="/dashboard/courses" className='navbar-link'>Courses</Link>
                    </Menu.Item>
                    <Menu.Item key="/dashboard/shop" icon={<FontAwesomeIcon icon={faStore} />}>
                        <Link to="/dashboard/shop" className='navbar-link'>Shop</Link>
                    </Menu.Item>
                </Menu>
            </Sider>
            <Layout className={`site-layout ${rightSidebarCollapsed ? 'collapsed-content' : 'expanded-content'}`}>
                <Button
                    type="text"
                    size='small'
                    icon={collapsed ? <FontAwesomeIcon icon={faAngleDoubleRight} /> : <FontAwesomeIcon icon={faAngleDoubleLeft} />}
                    onClick={() => setCollapsed(!collapsed)}
                    className="toggle-button"
                    style={{ left: collapsed ? '65px' : '220px' }}
                />
                <Header className="site-header">
                    <Tooltip placement='bottom' title="Wishlist">
                        <Link to="/dashboard/wishlist" className="header-link">
                            <FontAwesomeIcon icon={faHeart} />
                        </Link>
                    </Tooltip>

                    <Tooltip placement='bottom' title="Cart">
                        <Link to="/dashboard/cart" className="header-link">
                            <FontAwesomeIcon icon={faShoppingCart} />
                        </Link>
                    </Tooltip>
                    <Tooltip placement='bottom' title="Notifications">
                        <Link to="/dashboard/notifications" className="header-link">
                            <FontAwesomeIcon icon={faBell} />
                        </Link>
                    </Tooltip>
                </Header>
                <Content className="content custom-scrollbar">
                    <Routes>
                        <Route path="task-management" element={<PrivateRoute><div>Task Management</div></PrivateRoute>} />
                        <Route path="public-relation/blogs" element={<PrivateRoute><Blogs /></PrivateRoute>} />
                        <Route path="public-relation/articles" element={<PrivateRoute><Articles /></PrivateRoute>} />
                        <Route path="public-relation/case-studies" element={<PrivateRoute><CaseStudy /></PrivateRoute>} />
                        <Route path="assesment" element={<PrivateRoute><div>Assessment</div></PrivateRoute>} />
                        <Route path="financial" element={<PrivateRoute><div>Financial</div></PrivateRoute>} />
                        <Route path="support" element={<PrivateRoute><div>Support</div></PrivateRoute>} />
                        <Route path="marketing" element={<PrivateRoute><div>Marketing</div></PrivateRoute>} />
                        <Route path="settings" element={<PrivateRoute><div>Settings</div></PrivateRoute>} />
                        <Route path="wishlist" element={<PrivateRoute><Wishlist /></PrivateRoute>} />
                        <Route path="cart" element={<PrivateRoute><div>Cart</div></PrivateRoute>} />
                        <Route path="notifications" element={<PrivateRoute><Notifications /></PrivateRoute>} />
                        <Route path="home" element={<PrivateRoute><div>Home Content</div></PrivateRoute>} />
                        <Route path="ai-tools" element={<PrivateRoute><div>AI-Tools</div></PrivateRoute>} />
                        <Route path="inbox" element={<PrivateRoute><div>Inbox</div></PrivateRoute>} />
                        <Route path="creators-near-me" element={<PrivateRoute><div>Creator Near Me</div></PrivateRoute>} />
                        <Route path="forum" element={<PrivateRoute><div>Forum</div></PrivateRoute>} />
                        <Route path="courses" element={<PrivateRoute><Course /></PrivateRoute>} />
                        <Route path="shop" element={<PrivateRoute><div>Shop</div></PrivateRoute>} />
                        <Route path="profile/*" element={<PrivateRoute><Profile /></PrivateRoute>} />
                    </Routes>
                </Content>
            </Layout>
            <FloatButton description="Ask" className="float-button" onClick={() => setModalVisible(true)} />
            {modalVisible && <ChatBox onClose={() => setModalVisible(false)} />}
        </Layout>
    );
};

export default Dashboard;
