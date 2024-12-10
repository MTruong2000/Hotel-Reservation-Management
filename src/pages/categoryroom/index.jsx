import { useEffect, useState } from 'react';
import { Table, Button, Input, Space, Modal, Form } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';
import axios from 'axios';
import './style.scss';

// const { Search } = Input;

const CategoryRoom = () => {
  const token = Cookies.get('token');
  const [form] = Form.useForm();

  const [roomType, setRoomType] = useState('');
  const [adult, setAdult] = useState('');
  const [children, setChildren] = useState('');
  const [size, setSize] = useState('');

  const [listUser, setListUser] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Room type',
      dataIndex: 'room_type',
      key: 'room_type',
    },
    {
      title: 'Adult',
      dataIndex: 'adult',
      key: 'adult',
    },
    {
      title: 'Count Children',
      dataIndex: 'num_children',
      key: 'num_children',
    },
    {
      title: 'Size',
      dataIndex: 'size',
      key: 'size',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (status === 1 ? 'Active' : 'Inactive'),
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
      const response = await axios.get(`${import.meta.env.VITE_DOMAIN}api/admin/list-cate-room`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const list = Array.isArray(response.data) && Array.isArray(response.data[0]) ? response.data[0] : [];

      const processedList = list.map((item) => ({
        ...item,
        num_children: Number(item.children),
        children: undefined,
      }));

      setListUser(processedList);
    } catch (error) {
      console.error(error);
      setListUser([]);
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
          Add Category Room
        </Button>
        {/* <Space>
          <Search placeholder="Search by name or email" style={{ width: 200 }} />
        </Space> */}
      </div>
      <Table
        columns={columns}
        dataSource={listUser.map((user) => ({
          ...user,
          key: user.id,
        }))}
      />
      <Modal
        title="Add Category Room"
        open={isModalOpen}
        onOk={handleSignUp}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleSignUp}>
            Add Category Room
          </Button>,
        ]}
      >
        <Form layout="vertical" form={form}>
          <Form.Item
            label="Room Type"
            name="room_type"
            rules={[{ required: true, message: 'Please enter the room type!' }]}
          >
            <Input placeholder="Enter room type" value={roomType} onChange={(e) => setRoomType(e.target.value)} />
          </Form.Item>

          <Form.Item
            label="Adults"
            name="adult"
            rules={[{ required: true, message: 'Please enter the number of adults!' }]}
          >
            <Input
              type="number"
              placeholder="Enter number of adults"
              value={adult}
              onChange={(e) => setAdult(e.target.value)}
            />
          </Form.Item>

          <Form.Item
            label="Children"
            name="children"
            rules={[{ required: true, message: 'Please enter the number of children!' }]}
          >
            <Input
              type="number"
              placeholder="Enter number of children"
              value={children}
              onChange={(e) => setChildren(e.target.value)}
            />
          </Form.Item>

          <Form.Item
            label="Size (sqft)"
            name="size"
            rules={[{ required: true, message: 'Please enter the room size!' }]}
          >
            <Input
              type="number"
              placeholder="Enter room size in sqft"
              value={size}
              onChange={(e) => setSize(e.target.value)}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default CategoryRoom;
