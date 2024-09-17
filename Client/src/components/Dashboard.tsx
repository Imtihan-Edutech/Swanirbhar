import { useEffect, useState } from 'react';
import { Layout, Menu, Button, FloatButton, Modal, Tooltip, Dropdown, message, Drawer } from 'antd';
import { Link, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import {
    BookOutlined,
    HeartOutlined,
    ShoppingCartOutlined,
    UsergroupAddOutlined,
    LogoutOutlined,
    BellOutlined,
    MenuOutlined,
    AppstoreAddOutlined,
    UserOutlined,
    FileTextOutlined,
    TeamOutlined,
    UnorderedListOutlined,
    CalendarOutlined,
    ReadOutlined,
    PieChartOutlined,
} from '@ant-design/icons';
import ChatBox from './ChatBox';
import logo from "../images/logo.png";
import favicon from "../images/favicon.png";
import { baseURL } from '../App';
import axios from 'axios';
import PrivateRoute from '../utils/PrivateRoute';
import Article from '../pages/Insight Hub/Article';
import Project from '../pages/Assignment/Project/Project';
import ProjectDetail from '../pages/Assignment/Project/ProjectDetail';
import Profile from '../pages/Profile/Profile';

const { Header, Sider, Content } = Layout;
const { SubMenu } = Menu;

interface User {
    profilePic?: string;
    role?: string;
}

const Dashboard = () => {
    const location = useLocation();
    const [collapsed, setCollapsed] = useState<boolean>(false);
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [drawerVisible, setDrawerVisible] = useState<boolean>(false);
    const userId = localStorage.getItem("userId");
    const [user, setUser] = useState<User>({});
    const navigate = useNavigate();

    useEffect(() => {
        fetchUserDetails();
    }, []);

    const fetchUserDetails = async () => {
        try {
            const response = await axios.get(`${baseURL}/user/${userId}`);
            setUser(response.data);
        } catch (error: any) {
            message.error(error.response?.data?.message);
        }
    };

    const handleLogout = () => {
        Modal.confirm({
            title: 'Confirm Logout',
            content: 'Are you sure you want to log out?',
            okText: 'Yes',
            cancelText: 'No',
            onOk: () => {
                localStorage.removeItem('token');
                localStorage.removeItem('userId');
                localStorage.removeItem('role');
                setTimeout(() => {
                    navigate('/');
                }, 1000);
            },
        });
    };

    const profileMenu = (
        <Menu>
            <Menu.Item key="profile" onClick={() => navigate('/profile')} icon={<UserOutlined />}>
                <span>Profile</span>
            </Menu.Item>
            <Menu.Item key="logout" onClick={handleLogout} icon={<LogoutOutlined />} className="text-red-500">
                <span>Logout</span>
            </Menu.Item>
        </Menu>
    );

    const headerMenu = (
        <Menu mode="vertical">
            <Menu.Item key="/creators-near-me" icon={<UsergroupAddOutlined />} onClick={() => navigate('/creators-near-me')}>
                Creators Near Me
            </Menu.Item>
            <Menu.Item key="/courses" icon={<BookOutlined />} onClick={() => navigate('/courses')}>
                Courses
            </Menu.Item>
            <Menu.Item key="/shop" icon={<AppstoreAddOutlined />} onClick={() => navigate('/shop')}>
                Shop
            </Menu.Item>
            <Menu.Item key="/wishlist" icon={<HeartOutlined />} onClick={() => navigate('/wishlist')}>
                Wishlist
            </Menu.Item>
            <Menu.Item key="/cart" icon={<ShoppingCartOutlined />} onClick={() => navigate('/cart')}>
                Cart
            </Menu.Item>
            <Menu.Item key="/notifications" icon={<BellOutlined />} onClick={() => navigate('/notifications')}>
                Notifications
            </Menu.Item>
        </Menu>
    );

    return (
        <Layout className="min-h-screen">
            <Sider
                width={250}
                style={{ position: 'fixed', height: '100%', left: 0, zIndex: 1, overflow: "auto" }}
                collapsible
                collapsed={collapsed}
                theme='light'
                breakpoint="md"
                onBreakpoint={(broken) => setCollapsed(broken)}
                onCollapse={(collapsed) => setCollapsed(collapsed)}
                className="sider-custom-scroll overflow-auto"
            >
                <div className="p-4 flex justify-center items-center sticky top-0 bg-white z-20">
                    {collapsed ? (
                        <img src={favicon} alt="Favicon" className="h-10 w-auto" />
                    ) : (
                        <img src={logo} alt="Logo" className="h-10 w-auto" />
                    )}
                </div>

                <Menu className="menu-items" selectedKeys={[location.pathname]} mode="inline">
                    <Menu.Item key="/dashboard" icon={<CalendarOutlined />}>
                        <Link to="/dashboard" className="navbar-link">Dashboard</Link>
                    </Menu.Item>

                    {user.role === "super-admin" && (
                        <Menu.Item key="/marketing-dashboard" icon={<PieChartOutlined />}>
                            <Link to="/marketing-dashboard" className="navbar-link">Marketing Dashboard</Link>
                        </Menu.Item>
                    )}

                    <Menu.Item key="/mind-map" icon={<PieChartOutlined />}>
                        <Link to="/mind-map" className="navbar-link">Mind Map</Link>
                    </Menu.Item>

                    <Menu.ItemGroup title="Tasks & Projects">
                        <Menu.Item key="/tasks" icon={<UnorderedListOutlined />}>
                            <Link to="/tasks" className="navbar-link">Tasks</Link>
                        </Menu.Item>
                        <Menu.Item key="/leads" icon={<TeamOutlined />}>
                            <Link to="/leads" className="navbar-link">Leads</Link>
                        </Menu.Item>
                        <SubMenu key="assessment" icon={<CalendarOutlined />} title="Assessment">
                            <Menu.Item key="/assessment/projects" icon={<FileTextOutlined />}>
                                <Link to="/assessment/projects" className="navbar-link">Projects</Link>
                            </Menu.Item>
                            <Menu.Item key="/assessment/quizzes" icon={<ReadOutlined />}>
                                <Link to="/assessment/quizzes" className="navbar-link">Quizzes</Link>
                            </Menu.Item>
                        </SubMenu>
                    </Menu.ItemGroup>

                    {user.role !== "freelancer" && (
                        <Menu.ItemGroup title="Users">
                            <SubMenu key="users" title="Users" icon={<UsergroupAddOutlined />}>
                                <Menu.Item key='/users/admin' icon={<UserOutlined />}>
                                    <Link to="/users/admin" className="navbar-link">Admin</Link>
                                </Menu.Item>
                                <Menu.Item key='/users/staff' icon={<UserOutlined />}>
                                    <Link to="/users/staff" className="navbar-link">Staff</Link>
                                </Menu.Item>
                                <Menu.Item key='/users/organization' icon={<UserOutlined />}>
                                    <Link to="/users/organization" className="navbar-link">Organization</Link>
                                </Menu.Item>
                                <Menu.Item key='/users/entrepreneur' icon={<UserOutlined />}>
                                    <Link to="/users/entrepreneur" className="navbar-link">Entrepreneur</Link>
                                </Menu.Item>
                                <Menu.Item key='/users/freelancer' icon={<UserOutlined />}>
                                    <Link to="/users/freelancer" className="navbar-link">Freelancer</Link>
                                </Menu.Item>
                            </SubMenu>
                        </Menu.ItemGroup>
                    )}

                    <Menu.ItemGroup title="Insight's Hub">
                        <Menu.Item key="/insight-hub" icon={<FileTextOutlined />}>
                            <Link to="/insight-hub" className="navbar-link">Insight's Hub</Link>
                        </Menu.Item>
                    </Menu.ItemGroup>
                </Menu>
            </Sider>

            <Layout style={{ marginLeft: collapsed ? 80 : 250, transition: 'margin-left 0.3s' }}>
                <Header style={{ marginLeft: collapsed ? 80 : 250, transition: 'margin-left 0.3s' }} className="flex justify-between items-center border-b bg-white px-4 py-2 md:px-6 md:py-3 fixed top-0 left-0 right-0 z-20">
                    <div className="flex items-center space-x-2 md:space-x-4">
                        <Button
                            type="text"
                            size="small"
                            icon={<MenuOutlined className="text-xl" />}
                            onClick={() => setDrawerVisible(true)}
                            className="text-gray-600 md:hidden"
                        />
                        <div className="hidden md:flex items-center space-x-4">
                            <Tooltip title="Creators Near Me">
                                <Link to="/creators-near-me" className="text-gray-600">
                                    <UsergroupAddOutlined className="text-xl" />
                                </Link>
                            </Tooltip>
                            <Tooltip title="Courses">
                                <Link to="/courses" className="text-gray-600">
                                    <BookOutlined className="text-xl" />
                                </Link>
                            </Tooltip>
                            <Tooltip title="Shop">
                                <Link to="/shop" className="text-gray-600">
                                    <AppstoreAddOutlined className="text-xl" />
                                </Link>
                            </Tooltip>
                        </div>
                    </div>

                    <div className="flex items-center space-x-2 md:space-x-4">
                        <div className="hidden md:flex items-center space-x-4">
                            <Tooltip title="Wishlist">
                                <Link to="/wishlist" className="text-gray-600">
                                    <HeartOutlined className="text-xl" />
                                </Link>
                            </Tooltip>
                            <Tooltip title="Cart">
                                <Link to="/cart" className="text-gray-600">
                                    <ShoppingCartOutlined className="text-xl" />
                                </Link>
                            </Tooltip>
                            <Tooltip title="Notifications">
                                <Link to="/notifications" className="text-gray-600">
                                    <BellOutlined className="text-xl" />
                                </Link>
                            </Tooltip>
                        </div>
                        <Dropdown overlay={profileMenu}>
                            <img
                                src={user.profilePic ? `${baseURL}/uploads/profileImages/profilePic/${user.profilePic}` : 'https://via.placeholder.com/130'}
                                alt="Profile"
                                className="h-8 w-8 md:h-10 md:w-10 rounded-full object-cover cursor-pointer border border-white"
                            />
                        </Dropdown>
                    </div>
                </Header>

                <Content className="p-2 md:p-2 flex-grow mt-[65px]">
                    <Routes>
                        <Route path="/dashboard" element={<div>Dashboard</div>} />
                        <Route path="/marketing-dashboard" element={<PrivateRoute><div>Marketing Dashboard</div></PrivateRoute>} />
                        <Route path="/mind-map" element={<PrivateRoute><div>Mind map</div></PrivateRoute>} />
                        <Route path="/tasks" element={<PrivateRoute><div>Tasks</div></PrivateRoute>} />
                        <Route path="/leads" element={<PrivateRoute><div>Leads</div></PrivateRoute>} />
                        <Route path="/assessment/projects" element={<PrivateRoute><Project /></PrivateRoute>} />
                        <Route path="/assessment/projects/:id" element={<PrivateRoute><ProjectDetail /></PrivateRoute>} />
                        <Route path="/assessment/quizzes" element={<PrivateRoute><div>Quizzes</div></PrivateRoute>} />
                        <Route path="/users/admin" element={<PrivateRoute><div>Admin</div></PrivateRoute>} />
                        <Route path="/users/staff" element={<PrivateRoute><div>Staff</div></PrivateRoute>} />
                        <Route path="/users/organization" element={<PrivateRoute><div>Organization</div></PrivateRoute>} />
                        <Route path="/users/entrepreneur" element={<PrivateRoute><div>Entrepreneur</div></PrivateRoute>} />
                        <Route path="/users/freelancer" element={<PrivateRoute><div>Freelancer</div></PrivateRoute>} />
                        <Route path="/insight-hub" element={<PrivateRoute><Article /></PrivateRoute>} />
                        <Route path="/creators-near-me" element={<PrivateRoute><div>Creators Near Me</div></PrivateRoute>} />
                        <Route path="/courses" element={<PrivateRoute><div>Shop</div></PrivateRoute>} />
                        <Route path="/shop" element={<PrivateRoute><div>Dashboard</div></PrivateRoute>} />
                        <Route path="/wishlist" element={<PrivateRoute><div>Wishlist</div></PrivateRoute>} />
                        <Route path="/cart" element={<PrivateRoute><div>Cart</div></PrivateRoute>} />
                        <Route path="/notifications" element={<PrivateRoute><div>Notification</div></PrivateRoute>} />
                        <Route path="/profile/*" element={<PrivateRoute><Profile /></PrivateRoute>} />
                    </Routes>

                </Content>
            </Layout>
            <FloatButton className="fixed bottom-4 right-4" onClick={() => setModalVisible(true)} />
            {modalVisible && <ChatBox onClose={() => setModalVisible(false)} />}
            <Drawer
                title="Menu"
                placement="top"
                onClose={() => setDrawerVisible(false)}
                visible={drawerVisible}
            >
                {headerMenu}
            </Drawer>
        </Layout>
    );
};

export default Dashboard;
