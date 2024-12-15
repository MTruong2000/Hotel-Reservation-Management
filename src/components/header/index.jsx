import { useEffect, useState } from 'react';
import { CiMenuBurger } from 'react-icons/ci';
import Cookies from 'js-cookie';
import axios from 'axios';
import proFileAvatarPlaceholder from '/img/Profile_avatar_placeholder.png';
import PropTypes from 'prop-types';
import './style.scss';


const Header = ({ isSidebarOpen, toggleSidebar }) => {
  Header.propTypes = {
    isSidebarOpen: PropTypes.bool.isRequired,
    toggleSidebar: PropTypes.func.isRequired,
  };
  const token = Cookies.get('token');
  const [user, setUser] = useState({});
  const getUserAPI = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_DOMAIN}api/admin/profile`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(response.data[0]);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getUserAPI();
  }, []);

  return (
    <>
      <div className="block-main-layout">
        <div className={`main-content ${isSidebarOpen ? 'sidebar-open' : ''}`}>
          <header className="header">
            <button className="menu-toggle" onClick={toggleSidebar}>
              <CiMenuBurger />
            </button>
            <div className="user-info">
              <i className="ri-notification-line notification-icon"></i>
              <img
                src={user.avatar ? user.avatar : proFileAvatarPlaceholder}
                alt="User Avatar"
                className="user-avatar"
              />
              <span className="user-name">{user.name}</span>
            </div>
          </header>
        </div>
      </div>
    </>
  );
};

export default Header;
