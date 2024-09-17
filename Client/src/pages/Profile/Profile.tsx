import { useEffect, useState } from 'react';
import { Button, message, Spin, Menu } from 'antd';
import { Link, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import facebook from '../../images/facebook-1.png';
import linkedin from '../../images/linkedin.png';
import github from '../../images/github.png';
import twitter from '../../images/twitter.png';
import youtube from '../../images/youtube.png';
import PrivateRoute from '../../utils/PrivateRoute';
import { baseURL } from '../../App';
import About from './About';
import Project from './Project';
import StartupDetails from './StartupDetails';
import Products from './Products';
import Team from './Team';
import InsightHub from './InsightHub';
import Forum from './Forum';
import Badges from './Badges';
import EntrepreneurEdit from './EntrepreneurEdit';
import FreelancerEdit from './FreelancerEdit';

interface User {
  _id: string;
  fullName: string;
  followers: number[];
  profilePic: string;
  coverImage: string;
  role:string;
  socials?: {
    facebook: string;
    linkedin: string;
    github: string;
    twitter: string;
    youtube: string;
  };
}

const Profile = () => {
  const [user, setUser] = useState<User>({} as User);
  const [loading, setLoading] = useState(false);
  const userId = localStorage.getItem('userId');
  const location = useLocation();
  const navigate = useNavigate();

  const handleEditClick = () => {
    if (user.role === 'entrepreneur') {
      navigate('/profile/entrepreneur-editInfo');
    } else if (user.role === 'freelancer') {
      navigate('/profile/freelancer-editInfo');
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const fetchUserDetails = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${baseURL}/user/${userId}`);
      setUser(response.data);
    } catch (error: any) {
      if (error.response?.data) {
        message.error(error.response.data.message);
      }
    }
    setLoading(false);
  };

  const renderMenuItems = () => {
    if (user.role === 'freelancer') {
      return (
        <>
          <Menu.Item key="/profile/about">
            <Link to="/profile/about">About</Link>
          </Menu.Item>
          <Menu.Item key="/profile/projects">
            <Link to="/profile/projects">Projects</Link>
          </Menu.Item>
          <Menu.Item key="/profile/products">
            <Link to="/profile/products">Products</Link>
          </Menu.Item>
          <Menu.Item key="/profile/team">
            <Link to="/profile/team">Team</Link>
          </Menu.Item>
          <Menu.Item key="/profile/insight-hub">
            <Link to="/profile/insight-hub">Insight Hub</Link>
          </Menu.Item>
          <Menu.Item key="/profile/forum">
            <Link to="/profile/forum">Forum</Link>
          </Menu.Item>
          <Menu.Item key="/profile/badges">
            <Link to="/profile/badges">Badges</Link>
          </Menu.Item>
        </>
      );
    } else if (user.role === 'entrepreneur') {
      return (
        <>
          <Menu.Item key="/profile/about">
            <Link to="/profile/about">About</Link>
          </Menu.Item>
          <Menu.Item key="/profile/startup-details">
            <Link to="/profile/startup-details">Startup Details</Link>
          </Menu.Item>
          <Menu.Item key="/profile/products">
            <Link to="/profile/products">Products</Link>
          </Menu.Item>
          <Menu.Item key="/profile/team">
            <Link to="/profile/team">Team</Link>
          </Menu.Item>
          <Menu.Item key="/profile/insight-hub">
            <Link to="/profile/insight-hub">Insight Hub</Link>
          </Menu.Item>
          <Menu.Item key="/profile/forum">
            <Link to="/profile/forum">Forum</Link>
          </Menu.Item>
          <Menu.Item key="/profile/badges">
            <Link to="/profile/badges">Badges</Link>
          </Menu.Item>
        </>
      );
    }
    return null;
  };

  return (
    <div>
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <Spin className="loading-spinner" />
        </div>
      ) : (
        <>
          <div className="relative bg-center bg-no-repeat bg-cover mb-5 h-[200px] sm:h-[250px]"
            style={{ backgroundImage: `url(${user.coverImage ? `${baseURL}/uploads/profileImages/coverImage/${user.coverImage}` : 'https://via.placeholder.com/800x200'})` }}>
            <div className="absolute top-[55%] left-1/2 transform -translate-x-1/2 bg-white p-4 sm:p-5 rounded-xl shadow-md w-[90%] max-w-lg z-10 flex flex-col sm:flex-row justify-between items-center">
              <div className="flex items-center gap-5 sm:gap-7">
                <div className="w-[80px] sm:w-[110px] h-[80px] sm:h-[110px] rounded-full overflow-hidden border-4 border-white shadow-md">
                  <img src={user.profilePic ? `${baseURL}/uploads/profileImages/profilePic/${user.profilePic}` : 'https://via.placeholder.com/130'} alt="Profile Pic" className="w-full h-full object-cover" />
                </div>
                <div className='flex flex-col items-center sm:items-start'>
                  <h2 className="text-lg sm:text-xl font-bold text-gray-800">{user.fullName}</h2>
                  <div className="flex items-center mt-4">
                    <div className="text-center">
                      <span className="block text-xl font-bold text-gray-700">0</span>
                      <span className="text-xs font-semibold text-gray-500">Courses</span>
                    </div>
                    <div className="h-8 w-px bg-gray-300 mx-4 sm:mx-8"></div>
                    <div className="text-center">
                      <span className="block text-xl font-bold text-gray-700">{user.followers?.length}</span>
                      <span className="text-xs font-semibold text-gray-500">Followers</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-5 sm:gap-14 items-end">
                <div className="flex gap-2">
                  {user.socials?.facebook && (
                    <a href={user.socials.facebook} target="_blank" rel="noopener noreferrer">
                      <img src={facebook} alt="Facebook URL" className="w-6 sm:w-7" />
                    </a>
                  )}
                  {user.socials?.linkedin && (
                    <a href={user.socials.linkedin} target="_blank" rel="noopener noreferrer">
                      <img src={linkedin} alt="LinkedIn URL" className="w-6 sm:w-7" />
                    </a>
                  )}
                  {user.socials?.github && (
                    <a href={user.socials.github} target="_blank" rel="noopener noreferrer">
                      <img src={github} alt="GitHub URL" className="w-6 sm:w-7" />
                    </a>
                  )}
                  {user.socials?.twitter && (
                    <a href={user.socials.twitter} target="_blank" rel="noopener noreferrer">
                      <img src={twitter} alt="Twitter URL" className="w-6 sm:w-7" />
                    </a>
                  )}
                  {user.socials?.youtube && (
                    <a href={user.socials.youtube} target="_blank" rel="noopener noreferrer">
                      <img src={youtube} alt="YouTube URL" className="w-6 sm:w-7" />
                    </a>
                  )}
                </div>
                <Button size="small" className="mt-2" danger onClick={handleEditClick}>Edit</Button>
              </div>
            </div>
          </div>

          <div className="mt-36 sm:mt-20">
            <Menu mode="horizontal" selectedKeys={[location.pathname]} className="mb-0 font-semibold">
              {renderMenuItems()}
            </Menu>
            <div className='bg-white p-4 sm:p-6'>
              <Routes>
                <Route path="about" element={<PrivateRoute><About /></PrivateRoute>} />
                <Route path="projects" element={<PrivateRoute><Project /></PrivateRoute>} />
                <Route path="startup-details" element={<PrivateRoute><StartupDetails /></PrivateRoute>} />
                <Route path="products" element={<PrivateRoute><Products /></PrivateRoute>} />
                <Route path="team" element={<PrivateRoute><Team /></PrivateRoute>} />
                <Route path="insight-hub" element={<PrivateRoute><InsightHub /></PrivateRoute>} />
                <Route path="forum" element={<PrivateRoute><Forum /></PrivateRoute>} />
                <Route path="badges" element={<PrivateRoute><Badges /></PrivateRoute>} />
                <Route path="entrepreneur-editInfo" element={<PrivateRoute><EntrepreneurEdit /></PrivateRoute>} />
                <Route path="freelancer-editInfo" element={<PrivateRoute><FreelancerEdit /></PrivateRoute>} />
                <Route path="/" element={<Navigate to="about" replace />} />
              </Routes>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Profile;
