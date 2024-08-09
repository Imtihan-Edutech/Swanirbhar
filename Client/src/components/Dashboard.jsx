import React, { useEffect, useState } from 'react';
import { Layout, Menu, Button, FloatButton, Modal, Tooltip, Dropdown } from 'antd';
import { Link, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import PrivateRoute from '../AllRoutes/PrivateRoutes';
import {
    BookOutlined,
    DoubleRightOutlined,
    DoubleLeftOutlined,
    HeartOutlined,
    ShoppingCartOutlined,
    FileTextOutlined,
    TeamOutlined,
    LogoutOutlined,
    UnorderedListOutlined,
    CreditCardOutlined,
    FileDoneOutlined,
    CalculatorOutlined,
    CalendarOutlined,
    RobotOutlined,
    ScheduleOutlined,
    FileSearchOutlined,
    ReadOutlined,
    TagOutlined,
    PieChartOutlined,
    BankOutlined,
    FileAddOutlined,
    BarChartOutlined,
    WalletOutlined,
    ShoppingOutlined,
    MessageOutlined,
    AppstoreAddOutlined,
    UsergroupAddOutlined,
    MailOutlined,
    PercentageOutlined,
    RocketOutlined,
    UserAddOutlined,
    GiftOutlined,
    UserOutlined,
    BellOutlined,
    SwapOutlined
} from '@ant-design/icons';
import ChatBox from './ChatBox';
import logo from "../images/logo.png";
import logo1 from "../images/logo-1.png";
import '../styles/Dashboard.css';
import Course from '../pages/Course';
import Profile from '../pages/Profile';
import Articles from '../pages/Articles';
import Blogs from '../pages/Blogs';
import CaseStudy from '../pages/CaseStudy';
import { baseUrl } from '../App';
import axios from 'axios';
import Notifications from '../pages/Notifications';
import WorkInProgress from '../pages/WorkInProgress';

const { Header, Sider, Content } = Layout;
const { SubMenu } = Menu;

const Dashboard = () => {
    const location = useLocation();
    const [collapsed, setCollapsed] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const userId = localStorage.getItem("userId");
    const [user, setUser] = useState({});
    const Navigate = useNavigate();

    useEffect(() => {
        fetchUserDetails();
    }, []);

    const fetchUserDetails = async () => {
        try {
            const response = await axios.get(`${baseUrl}/user/${userId}`);
            setUser(response.data);

        } catch (error) {
            message.error(error.response?.data?.message);
        }
    };

    console.log(user.role);
    

    const handleLogout = () => {
        Modal.confirm({
            title: 'Confirm Logout',
            content: 'Are you sure you want to log out?',
            okText: 'Yes',
            cancelText: 'No',
            onOk: () => {
                localStorage.removeItem('token');
                localStorage.removeItem('userId');
                setTimeout(()=>{
                    Navigate('/')
                },1000)
            },
        });
    };

    const profileMenu = (
        <Menu>
            <Menu.Item key="profile" onClick={() => Navigate('/profile')} icon={<UserOutlined />}>
                <span>Profile</span>
            </Menu.Item>
            <Menu.Item key="logout" onClick={handleLogout} icon={<LogoutOutlined />} style={{color:"red"}}>
                <span>Logout</span>
            </Menu.Item>
        </Menu>
    );

    return (
        <Layout>
            <Sider
                width={250}
                className="sidebar"
                trigger={null}
                collapsible
                collapsed={collapsed}
                theme="light"
            >
                <div className={`logo-container ${collapsed ? 'collapsed' : ''}`}>
                    <img src={logo} alt="Logo" className="logo-icon" />
                    {!collapsed && <img src={logo1} alt="Logo" className="logo-1-icon" />}
                </div>

                <Menu className='menu-items' selectedKeys={[location.pathname]}>

                    <Menu.Item key="/dashboard" icon={<CalendarOutlined />}>
                        <Link to="/dashboard" className="navbar-link">Dashboard</Link>
                    </Menu.Item>
                    <Menu.Item key="/events" icon={<ScheduleOutlined />}>
                        <Link to="/events" className="navbar-link">Events</Link>
                    </Menu.Item>

                    <Menu.Item key="/clients" icon={<TeamOutlined />}>
                        <Link to="/clients" className="navbar-link">Clients</Link>
                    </Menu.Item>

                    <SubMenu key="assessment" icon={<PieChartOutlined />} title="Assessment">
                        <Menu.Item key="/assessment/projects" icon={<FileTextOutlined />}>
                            <Link to="/assessment/projects" className="navbar-link">Project</Link>
                        </Menu.Item>
                        <Menu.Item key="/assessment/quizzes" icon={<ReadOutlined />}>
                            <Link to="/assessment/quizzes" className="navbar-link">Quizzes</Link>
                        </Menu.Item>
                    </SubMenu>

                    <Menu.Item key="/tasks" icon={<CalendarOutlined />}>
                        <Link to="/tasks" className="navbar-link">Tasks</Link>
                    </Menu.Item>

                    <SubMenu key="public-relation" icon={<BookOutlined />} title="Public Relation">
                        <Menu.Item key="/public-relation/articles" icon={<FileTextOutlined />}>
                            <Link to="/public-relation/articles" className="navbar-link">Articles</Link>
                        </Menu.Item>
                        <Menu.Item key="/public-relation/blogs" icon={<ReadOutlined />}>
                            <Link to="/public-relation/blogs" className="navbar-link">Blogs</Link>
                        </Menu.Item>
                        <Menu.Item key="/public-relation/case-studies" icon={<FileSearchOutlined />}>
                            <Link to="/public-relation/case-studies" className="navbar-link">Case Studies</Link>
                        </Menu.Item>
                    </SubMenu>

                    <Menu.Item key="/leads" icon={<TeamOutlined />}>
                        <Link to="/leads" className="navbar-link">Leads</Link>
                    </Menu.Item>

                    <SubMenu key="sales" title="Sales" icon={<ShoppingOutlined />}>
                        <Menu.Item key="/sales/invoice" icon={<FileTextOutlined />}>
                            <Link to="/sales/invoice" className="navbar-link">Invoice</Link>
                        </Menu.Item>
                        <Menu.Item key="/sales/orderlist" icon={<UnorderedListOutlined />}>
                            <Link to="/sales/orderlist" className="navbar-link">Order List</Link>
                        </Menu.Item>
                        <Menu.Item key="/sales/payment" icon={<CreditCardOutlined />}>
                            <Link to="/sales/payment" className="navbar-link">Payment</Link>
                        </Menu.Item>
                        <Menu.Item key="/sales/contract" icon={<FileDoneOutlined />}>
                            <Link to="/sales/contract" className="navbar-link">Contract</Link>
                        </Menu.Item>
                        <Menu.Item key="/sales/proposal" icon={<FileAddOutlined />}>
                            <Link to="/sales/proposal" className="navbar-link">Proposal</Link>
                        </Menu.Item>
                        <Menu.Item key="/sales/estimation" icon={<CalculatorOutlined />}>
                            <Link to="/sales/estimation" className="navbar-link">Estimation</Link>
                        </Menu.Item>
                        <Menu.Item key="/sales/credit-notes" icon={<BankOutlined />}>
                            <Link to="/sales/credit-notes" className="navbar-link">Credit Notes</Link>
                        </Menu.Item>
                    </SubMenu>

                    <SubMenu key="finance" title="Finance" icon={<BarChartOutlined />}>
                        <Menu.Item key="/finance/payout" icon={<WalletOutlined />}>
                            <Link to="/finance/payout" className="navbar-link">Payout</Link>
                        </Menu.Item>
                        <Menu.Item key="/finance/change-account" icon={<SwapOutlined />}>
                            <Link to="/finance/change-account" className="navbar-link">Change Account</Link>
                        </Menu.Item>
                        <Menu.Item key="/finance/subscription" icon={<CalendarOutlined />}>
                            <Link to="/finance/subscription" className="navbar-link">Subscription</Link>
                        </Menu.Item>
                        <Menu.Item key="/finance/installments" icon={<PieChartOutlined />}>
                            <Link to="/finance/installments" className="navbar-link">Installments</Link>
                        </Menu.Item>
                    </SubMenu>

                    <Menu.Item key="/support" icon={<TagOutlined />}>
                        <Link to="/support" className="navbar-link">Support</Link>
                    </Menu.Item>

                    <Menu.Item key="/ticket" icon={<TagOutlined />}>
                        <Link to="/ticket" className="navbar-link">Ticket</Link>
                    </Menu.Item>

                    <SubMenu key="marketing" title="Marketing" icon={<TagOutlined />}>
                        <Menu.Item key="/marketing/discount" icon={<PercentageOutlined />}>
                            <Link to="/marketing/discount" className="navbar-link">Discount</Link>
                        </Menu.Item>
                        <Menu.Item key="/marketing/promotion" icon={<RocketOutlined />}>
                            <Link to="/marketing/promotion" className="navbar-link">Promotion</Link>
                        </Menu.Item>
                        <Menu.Item key="/marketing/affilation" icon={<UserAddOutlined />}>
                            <Link to="/marketing/affilation" className="navbar-link">Affiliation</Link>
                        </Menu.Item>
                        <Menu.Item key="/marketing/registration-bonus" icon={<GiftOutlined />}>
                            <Link to="/marketing/registration-bonus" className="navbar-link">Registration Bonus</Link>
                        </Menu.Item>
                        <Menu.Item key="/marketing/coupons" icon={<CreditCardOutlined />}>
                            <Link to="/marketing/coupons" className="navbar-link">Coupons</Link>
                        </Menu.Item>
                    </SubMenu>
                </Menu>
            </Sider>

            <Layout className='site-layout'>
                <Button
                    type="text"
                    size='small'
                    icon={collapsed ? <DoubleRightOutlined /> : <DoubleLeftOutlined />}
                    onClick={() => setCollapsed(!collapsed)}
                    className="toggle-button"
                    style={{ left: collapsed ? '65px' : '240px' }}
                />
                <Header className="site-header">
                    <div className="header-section">
                        <Tooltip placement='bottom' title="AI-Tool">
                            <Link to="/ai-tool" className="header-link">
                                <RobotOutlined />
                            </Link>
                        </Tooltip>
                        <Tooltip placement='bottom' title="Creators Near Me">
                            <Link to="/creators-near-me" className="header-link">
                                <UsergroupAddOutlined />
                            </Link>
                        </Tooltip>
                        <Tooltip placement='bottom' title="Forum">
                            <Link to="/forum" className="header-link">
                                <MessageOutlined />
                            </Link>
                        </Tooltip>
                        <Tooltip placement='bottom' title="Inbox">
                            <Link to="/inbox" className="header-link">
                                <MailOutlined />
                            </Link>
                        </Tooltip>
                        <Tooltip placement='bottom' title="Courses">
                            <Link to="/courses" className="header-link">
                                <BookOutlined />
                            </Link>
                        </Tooltip>
                        <Tooltip placement='bottom' title="Shop">
                            <Link to="/shop" className="header-link">
                                <AppstoreAddOutlined />
                            </Link>
                        </Tooltip>
                    </div>
                    <div className="header-section">
                        <Tooltip placement='bottom' title="Wishlist">
                            <Link to="/wishlist" className="header-link">
                                <HeartOutlined />
                            </Link>
                        </Tooltip>

                        <Tooltip placement='bottom' title="Cart">
                            <Link to="/cart" className="header-link">
                                <ShoppingCartOutlined />
                            </Link>
                        </Tooltip>
                        <Tooltip placement='bottom' title="Notifications">
                            <Link to="/notifications" className="header-link">
                                <BellOutlined />
                            </Link>
                        </Tooltip>

                        <Dropdown overlay={profileMenu} >
                            <img
                                src={user.profilePic ? `${baseUrl}/uploads/profileImages/profilePic/${user.profilePic}` : 'https://via.placeholder.com/130'}
                                alt="Profile"
                                className="profile-image"
                            />
                        </Dropdown>
                    </div>
                </Header>

                <Content className="content custom-scrollbar">
                    <Routes>
                        <Route path="/tasks" element={<PrivateRoute><WorkInProgress /></PrivateRoute>} />
                        <Route path="task-management/meetingEvents" element={<PrivateRoute><WorkInProgress /></PrivateRoute>} />
                        <Route path="task-management/leads" element={<PrivateRoute><WorkInProgress /></PrivateRoute>} />
                        <Route path="public-relation/blogs" element={<PrivateRoute><Blogs /></PrivateRoute>} />
                        <Route path="public-relation/articles" element={<PrivateRoute><Articles /></PrivateRoute>} />
                        <Route path="public-relation/case-studies" element={<PrivateRoute><CaseStudy /></PrivateRoute>} />
                        <Route path="assesment" element={<PrivateRoute><div>Assessment</div></PrivateRoute>} />
                        <Route path="financial" element={<PrivateRoute><div>Financial</div></PrivateRoute>} />
                        <Route path="support" element={<PrivateRoute><div>Support</div></PrivateRoute>} />
                        <Route path="marketing" element={<PrivateRoute><div>Marketing</div></PrivateRoute>} />
                        <Route path="settings" element={<PrivateRoute><div>Settings</div></PrivateRoute>} />
                        <Route path="wishlist" element={<PrivateRoute><WorkInProgress /></PrivateRoute>} />
                        <Route path="cart" element={<PrivateRoute><div>Cart</div></PrivateRoute>} />
                        <Route path="notifications" element={<PrivateRoute><Notifications /></PrivateRoute>} />
                        <Route path="home" element={<PrivateRoute><div>Home Content</div></PrivateRoute>} />
                        <Route path="ai-tool" element={<PrivateRoute><div>AI-Tools</div></PrivateRoute>} />
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
