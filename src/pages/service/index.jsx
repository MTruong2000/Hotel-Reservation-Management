import { useEffect, useState } from 'react';
import { Table, Button, Input, Space, Modal, Form } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';
import axios from 'axios';
import './style.scss';

// const { Search } = Input;

const ServiceManagement = () => {
  const token = Cookies.get('token');
  const [form] = Form.useForm();

  const [name, setName] = useState('');

  const [listUser, setListUser] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Service Name',
      dataIndex: 'service_name',
      key: 'service_name',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <Space>
          <Button icon={<DeleteOutlined />} danger onClick={() => handleDelete(record.id)} />
        </Space>
      ),
    },
  ];

  const getUserAPI = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_DOMAIN}api/admin/list-service`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data);
      response.data ? setListUser(response.data[0]) : setListUser([]);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getUserAPI();
  }, []);

  const showModal = () => {
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleSignUp = async () => {
    if (!name) {
      Swal.fire({
        title: 'Warning: Please Complete All Required Information',
        text: 'Please fill in all the information.',
        icon: 'warning',
      });
      return;
    }

    const params = {
      service_name: name,
    };

    try {
      const response = await axios.post(`${import.meta.env.VITE_DOMAIN}api/admin/create-service`, params, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: response.data[0],
        showConfirmButton: false,
        timer: 1500,
      });
      getUserAPI();
      handleOk();
    } catch (error) {
      console.error('Login error:', error);
      Swal.fire({
        title: 'Fail ?',
        text: error.response.data.message,
        icon: 'error',
      });
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`${import.meta.env.VITE_DOMAIN}api/admin/delete-service/${id}`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: response.data[0],
        showConfirmButton: false,
        timer: 1500,
      });
      getUserAPI();
      handleOk();
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
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Button type="primary" onClick={showModal}>
          Add Service
        </Button>
        {/* <Space>
          <Search placeholder="Search by name or email" style={{ width: 200 }} />
        </Space> */}
      </div>
      <Table columns={columns} dataSource={listUser.map((user) => ({ ...user, key: user.id }))} />
      <Modal
        title="Add Teacher Account"
        open={isModalOpen}
        onOk={handleSignUp}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleSignUp}>
            Add Service
          </Button>,
        ]}
      >
        <Form layout="vertical" form={form}>
          <Form.Item label="Service Name" name="fullName" required>
            <Input placeholder="Enter service name" value={name} onChange={(e) => setName(e.target.value)} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ServiceManagement;
