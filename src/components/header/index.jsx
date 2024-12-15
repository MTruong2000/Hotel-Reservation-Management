import { useEffect, useState } from 'react';
import { CiMenuBurger } from 'react-icons/ci';
import { Modal, Button, Input, Form } from 'antd';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';
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
  const authData = Cookies.get('Auth');
  const authObject = JSON.parse(authData);
  const [user, setUser] = useState({});
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
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

  // Hiển thị Modal
  const showModal = () => {
    form.resetFields();
    setIsModalVisible(true);
  };

  // Ẩn Modal
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // Xử lý submit form
  const onFinish = async (values) => {
    console.log('Form Values:', values);
    const params = {
      name: values.name,
      password: values.password,
    };
    try {
      const response = await axios.post(`${import.meta.env.VITE_DOMAIN}api/admin/update`, params, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      Swal.fire({
        position: 'center',
        icon: 'success',
        title: response.data,
        showConfirmButton: false,
        timer: 1500,
      });
      getUserAPI();
      setIsModalVisible(false);
    } catch (error) {
      console.error('Login error:', error);
      Swal.fire({
        title: 'Fail ?',
        text: error.response.data.message,
        icon: 'error',
      });
    }
  };

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
                onClick={authObject.level === 1 ? showModal : null}
              />
              <span className="user-name">{user.name}</span>
            </div>
          </header>
        </div>
      </div>
      <Modal title="Login" open={isModalVisible} onCancel={handleCancel} footer={null}>
        <Form name="loginForm" onFinish={onFinish} layout="vertical" form={form}>
          <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Please enter your name!' }]}>
            <Input placeholder="Enter your name" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please enter your password!' }]}
          >
            <Input.Password placeholder="Enter your password" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default Header;
