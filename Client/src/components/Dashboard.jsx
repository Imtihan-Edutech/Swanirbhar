import React, { useEffect, useState } from 'react';
import { Layout, Menu, Button, FloatButton, Modal, Tooltip } from 'antd';
import { Link, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import PrivateRoute from '../AllRoutes/PrivateRoutes';
import {
    HomeOutlined,
    BookOutlined,
    TrophyOutlined,
    DollarOutlined,
    ToolOutlined,
    SoundOutlined,
    SettingOutlined,
    DoubleRightOutlined,
    DoubleLeftOutlined,
    BellOutlined,
    HeartOutlined,
    ShoppingCartOutlined,
    FileTextOutlined,
    BulbOutlined,
    InboxOutlined,
    TeamOutlined,
    CommentOutlined,
    DesktopOutlined,
    ShopOutlined,
    AppstoreOutlined,
    LogoutOutlined,
    FileSyncOutlined,
    UnorderedListOutlined,
    CreditCardOutlined,
    FileDoneOutlined,
    FileTextOutlined as FileTextFilled,
    CalculatorOutlined,
    MoneyCollectOutlined,
    SwapOutlined,
    CalendarOutlined,
    ReconciliationOutlined,
    RobotOutlined,
    UserSwitchOutlined,
    FileZipOutlined,
    ScheduleOutlined,
    FileSearchOutlined,
    EditOutlined,
    ReadOutlined,
    TagOutlined,
    PieChartOutlined,
    BankOutlined,
    FileAddOutlined,
    BarChartOutlined,
    WalletOutlined,
    CustomerServiceOutlined,
    ShoppingOutlined,
    MessageOutlined,
    AppstoreAddOutlined,
    StarOutlined,
    HomeFilled,
    RobotFilled,
    UsergroupAddOutlined,
    MailOutlined,
    NotificationOutlined,
    HeartFilled,
    PercentageOutlined,
    RocketOutlined,
    UserAddOutlined,
    GiftOutlined
} from '@ant-design/icons';
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
import WorkInProgress from '../pages/WorkInProgress';

const { Header, Sider, Content } = Layout;
const { SubMenu } = Menu;

const Dashboard = () => {
    const location = useLocation();
    const [collapsed, setCollapsed] = useState(false);
    const [courseCount, setCourseCount] = useState([]);
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
                    <SubMenu key="task-management" className='navbar-link' icon={<AppstoreOutlined />} title="Task Management">
                        <Menu.Item key="/dashboard/task-management/taskManager" icon={<CalendarOutlined />}>
                            <Link to="/dashboard/task-management/taskManager" className="navbar-link">Task Manager</Link>
                        </Menu.Item>
                        <Menu.Item key="/dashboard/task-management/meetingEvents" icon={<ScheduleOutlined />}>
                            <Link to="/dashboard/task-management/meetingEvents" className="navbar-link">Meeting and Events</Link>
                        </Menu.Item>
                        <Menu.Item key="/dashboard/task-management/leads" icon={<TeamOutlined />}>
                            <Link to="/dashboard/task-management/leads" className="navbar-link">Leads</Link>
                        </Menu.Item>
                    </SubMenu>


                    <SubMenu key="public-relation" icon={<BookOutlined />} title="Public Relation">
                        <Menu.Item key="/dashboard/public-relation/articles" icon={<FileTextOutlined />}>
                            <Link to="/dashboard/public-relation/articles" className="navbar-link">Articles</Link>
                        </Menu.Item>
                        <Menu.Item key="/dashboard/public-relation/blogs" icon={<ReadOutlined />}>
                            <Link to="/dashboard/public-relation/blogs" className="navbar-link">Blogs</Link>
                        </Menu.Item>
                        <Menu.Item key="/dashboard/public-relation/case-studies" icon={<FileSearchOutlined />}>
                            <Link to="/dashboard/public-relation/case-studies" className="navbar-link">Case Studies</Link>
                        </Menu.Item>
                    </SubMenu>


                    <Menu.Item key="/dashboard/assessment" icon={<PieChartOutlined />}>
                        <Link to="/dashboard/assessment" className='navbar-link'>Assessment</Link>
                    </Menu.Item>

                    <SubMenu key="finance" title="Finance" icon={<DollarOutlined />}>
                        <SubMenu key="sales" title="Sales" icon={<ShoppingOutlined />}>
                            <Menu.Item key="/dashboard/financial/sales/invoice" icon={<FileTextOutlined />}>
                                <Link to="/dashboard/financial/sales/invoice" className="navbar-link">Invoice</Link>
                            </Menu.Item>
                            <Menu.Item key="/dashboard/financial/sales/orderlist" icon={<UnorderedListOutlined />}>
                                <Link to="/dashboard/financial/sales/orderlist" className="navbar-link">Order List</Link>
                            </Menu.Item>
                            <Menu.Item key="/dashboard/financial/sales/payment" icon={<CreditCardOutlined />}>
                                <Link to="/dashboard/financial/sales/payment" className="navbar-link">Payment</Link>
                            </Menu.Item>
                            <Menu.Item key="/dashboard/financial/sales/contract" icon={<FileDoneOutlined />}>
                                <Link to="/dashboard/financial/sales/contract" className="navbar-link">Contract</Link>
                            </Menu.Item>
                            <Menu.Item key="/dashboard/financial/sales/proposal" icon={<FileAddOutlined />}>
                                <Link to="/dashboard/financial/sales/proposal" className="navbar-link">Proposal</Link>
                            </Menu.Item>
                            <Menu.Item key="/dashboard/financial/sales/estimation" icon={<CalculatorOutlined />}>
                                <Link to="/dashboard/financial/sales/estimation" className="navbar-link">Estimation</Link>
                            </Menu.Item>
                            <Menu.Item key="/dashboard/financial/sales/credit-notes" icon={<BankOutlined />}>
                                <Link to="/dashboard/financial/sales/credit-notes" className="navbar-link">Credit Notes</Link>
                            </Menu.Item>
                        </SubMenu>

                        <SubMenu key="finance-summary" title="Finance Summary" icon={<BarChartOutlined />}>
                            <Menu.Item key="/dashboard/financial/finance-summary/payout" icon={<WalletOutlined />}>
                                <Link to="/dashboard/financial/finance-summary/payout" className="navbar-link">Payout</Link>
                            </Menu.Item>
                            <Menu.Item key="/dashboard/financial/finance-summary/change-account" icon={<SwapOutlined />}>
                                <Link to="/dashboard/financial/finance-summary/change-account" className="navbar-link">Change Account</Link>
                            </Menu.Item>
                            <Menu.Item key="/dashboard/financial/finance-summary/subscription" icon={<CalendarOutlined />}>
                                <Link to="/dashboard/financial/finance-summary/subscription" className="navbar-link">Subscription</Link>
                            </Menu.Item>
                            <Menu.Item key="/dashboard/financial/finance-summary/installments" icon={<PieChartOutlined />}>
                                <Link to="/dashboard/financial/finance-summary/installments" className="navbar-link">Installments</Link>
                            </Menu.Item>
                        </SubMenu>
                    </SubMenu>

                    <SubMenu key="support" title="Support" icon={<CustomerServiceOutlined />}>
                        <Menu.Item key="/dashboard/support/ticket" icon={<TagOutlined />}>
                            <Link to="/dashboard/support/ticket" className="navbar-link">Ticket</Link>
                        </Menu.Item>
                    </SubMenu>

                    <SubMenu key="marketing" title="Marketing" icon={<TagOutlined />}>
                        <Menu.Item key="/dashboard/marketing/discount" icon={<PercentageOutlined />}>
                            <Link to="/dashboard/marketing/discount" className="navbar-link">Discount</Link>
                        </Menu.Item>
                        <Menu.Item key="/dashboard/marketing/promotion" icon={<RocketOutlined />}>
                            <Link to="/dashboard/marketing/promotion" className="navbar-link">Promotion</Link>
                        </Menu.Item>
                        <Menu.Item key="/dashboard/marketing/affilation" icon={<UserAddOutlined />}>
                            <Link to="/dashboard/marketing/affilation" className="navbar-link">Affiliation</Link>
                        </Menu.Item>
                        <Menu.Item key="/dashboard/marketing/registration-bonus" icon={<GiftOutlined />}>
                            <Link to="/dashboard/marketing/registration-bonus" className="navbar-link">Registration Bonus</Link>
                        </Menu.Item>
                        <Menu.Item key="/dashboard/marketing/coupons" icon={<CreditCardOutlined />}>
                            <Link to="/dashboard/marketing/coupons" className="navbar-link">Coupons</Link>
                        </Menu.Item>
                    </SubMenu>

                    <Menu.Item key="/dashboard/settings" icon={<SettingOutlined />}>
                        <Link to="/dashboard/settings" className='navbar-link'>Settings</Link>
                    </Menu.Item>
                    <Menu.Item className='logout-btn' icon={<LogoutOutlined />}>
                        <Link className='navbar-link' onClick={handleLogout}>Logout</Link>
                    </Menu.Item>
                </Menu>
            </Sider>


            <Layout className='site-layout'>
                <Button
                    type="text"
                    size='small'
                    icon={collapsed ? <DoubleRightOutlined /> : <DoubleLeftOutlined />}
                    onClick={() => setCollapsed(!collapsed)}
                    className="toggle-button"
                    style={{ left: collapsed ? '65px' : '220px' }}
                />
                <Header className="site-header">
                    <div className="header-section">
                        <Tooltip placement='bottom' title="Home">
                            <Link to="/dashboard/home" className="header-link">
                                <HomeOutlined />
                            </Link>
                        </Tooltip>
                        <Tooltip placement='bottom' title="AI-Tool">
                            <Link to="/dashboard/ai-tool" className="header-link">
                                <RobotOutlined />
                            </Link>
                        </Tooltip>
                        <Tooltip placement='bottom' title="Creators Near Me">
                            <Link to="/dashboard/creators-near-me" className="header-link">
                                <UsergroupAddOutlined />
                            </Link>
                        </Tooltip>
                        <Tooltip placement='bottom' title="Forum">
                            <Link to="/dashboard/forum" className="header-link">
                                <MessageOutlined />
                            </Link>
                        </Tooltip>
                        <Tooltip placement='bottom' title="Inbox">
                            <Link to="/dashboard/inbox" className="header-link">
                                <MailOutlined />
                            </Link>
                        </Tooltip>
                        <Tooltip placement='bottom' title="Courses">
                            <Link to="/dashboard/courses" className="header-link">
                                <BookOutlined />
                            </Link>
                        </Tooltip>
                        <Tooltip placement='bottom' title="Shop">
                            <Link to="/dashboard/shop" className="header-link">
                                <AppstoreAddOutlined />
                            </Link>
                        </Tooltip>
                    </div>
                    <div className="header-section">
                        <Tooltip placement='bottom' title="Wishlist">
                            <Link to="/dashboard/wishlist" className="header-link">
                                <HeartOutlined />
                            </Link>
                        </Tooltip>

                        <Tooltip placement='bottom' title="Cart">
                            <Link to="/dashboard/cart" className="header-link">
                                <ShoppingCartOutlined />
                            </Link>
                        </Tooltip>
                        <Tooltip placement='bottom' title="Notifications">
                            <Link to="/dashboard/notifications" className="header-link">
                                <NotificationOutlined />
                            </Link>
                        </Tooltip>
                    </div>
                </Header>

                <Content className="content custom-scrollbar">
                    <Routes>
                        <Route path="task-management/taskManager" element={<PrivateRoute><WorkInProgress/></PrivateRoute>} />
                        <Route path="task-management/meetingEvents" element={<PrivateRoute><WorkInProgress/></PrivateRoute>} />
                        <Route path="task-management/leads" element={<PrivateRoute><WorkInProgress/></PrivateRoute>} />
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
