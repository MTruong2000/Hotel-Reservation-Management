import { useEffect, useState } from 'react';
import { Table, Button, Input, Space, Modal, Form, Select, Checkbox } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';
import axios from 'axios';
import './style.scss';

const { Option } = Select;

// const { Search } = Input;

const Room = () => {
  const token = Cookies.get('token');
  const [form] = Form.useForm();
  const [formEdit] = Form.useForm();

  const [roomName, setRoomName] = useState('');
  const [price, setPrice] = useState('');
  const [listCategory, setListCategory] = useState([]);
  const [idRoomCategories, setIdRoomCategory] = useState(null);
  const [active, setActive] = useState(false);

  const [listUser, setListUser] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenEdit, setIsModalOpenEdit] = useState(false);
  const [selectedUser, setSelectedUser] = useState({});
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Room Name',
      dataIndex: 'room_name',
      key: 'room_name',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: 'Type Room',
      dataIndex: 'id_room_categories',
      key: 'id_room_categories',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) =>
        status === 1 ? (
          <Button type="primary" style={{ backgroundColor: 'green', borderColor: 'green' }}>
            Active
          </Button>
        ) : (
          <Button type="primary" style={{ backgroundColor: 'yellow', borderColor: 'yellow', color: 'black' }}>
            Inactive
          </Button>
        ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Button icon={<DeleteOutlined />} danger onClick={() => handleDelete(record.id)} />
          {record.status == 1 ? <Button onClick={() => handleCreateAutoRental(record)}>Tạo đặt phòng</Button> : null}
        </Space>
      ),
    },
  ];

  const getUserAPI = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_DOMAIN}api/staff/list-room`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      response.data.room ? setListUser(response.data.room) : setListUser([]);
    } catch (error) {
      console.error(error);
      setListUser([]);
    }
  };

  const getCategoryRoom = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_DOMAIN}api/admin/list-cate-room`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      setListCategory(response.data[0]);
    } catch (error) {
      console.error(error);
      setListUser([]);
    }
  };

  useEffect(() => {
    getUserAPI();
    getCategoryRoom();
  }, []);

  const handleCreateAutoRental = async (record) => {
    const params = {
      id_room: record.id,
      status: record.status,
    };

    console.log(params);
    try {
      const response = await axios.post(`${import.meta.env.VITE_DOMAIN}api/staff/create-rental-detail`, params, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      Swal.fire({
        position: 'center',
        icon: 'success',
        title: response.data.message,
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      Swal.fire({
        title: 'Fail ?',
        text: error.response.data.message,
        icon: 'error',
      });
    }
  };

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
    if (!roomName || !price || !idRoomCategories) {
      Swal.fire({
        title: 'Warning: Please Complete All Required Information',
        text: 'Please fill in all the information.',
        icon: 'warning',
      });
      return;
    }

    const params = {
      room_name: roomName,
      price: price,
      id_room_categories: idRoomCategories,
      status: active ? 1 : 0,
    };

    try {
      const response = await axios.post(`${import.meta.env.VITE_DOMAIN}api/staff/create-room`, params, {
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
      const response = await axios.delete(`${import.meta.env.VITE_DOMAIN}api/staff/delete-room/${id}`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: response.data.message,
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

  const handleEdit = (record) => {
    setSelectedUser(record);
    setIsModalOpenEdit(true);
  };

  const handleEditCourse = async () => {
    if (!selectedUser.room_name || !selectedUser.price || !selectedUser.id_room_categories) {
      Swal.fire({
        title: 'Warning: Please Complete All Required Information',
        text: 'Please fill in all the information.',
        icon: 'warning',
      });
      return;
    }

    const params = {
      room_name: selectedUser.room_name,
      price: selectedUser.price,
      id_room_categories: selectedUser.id_room_categories,
      status: selectedUser.status,
    };

    try {
      const response = await axios.put(`${import.meta.env.VITE_DOMAIN}api/staff/edit-room/${selectedUser.id}`, params, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      Swal.fire({
        position: 'center',
        icon: 'success',
        title: response.data.message,
        showConfirmButton: false,
        timer: 1500,
      });
      getUserAPI();
      setIsModalOpenEdit(false);
    } catch (error) {
      Swal.fire({
        title: 'Request Fail ?',
        text: error,
        icon: 'error',
      });
    }
  };

  const handleEditCancel = () => {
    setIsModalOpenEdit(false);
  };
  useEffect(() => {
    if (selectedUser) {
      formEdit.setFieldsValue({
        roomName: selectedUser.room_name,
        price: selectedUser.price,
        idRoomCategories: selectedUser.id_room_categories,
        active: selectedUser.status === 1,
      });
    }
  }, [selectedUser, formEdit]);

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Button type="primary" onClick={showModal}>
          Add Product
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
        title="Add Room"
        open={isModalOpen}
        onOk={handleSignUp}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleSignUp}>
            Add Room
          </Button>,
        ]}
      >
        <Form layout="vertical" form={form}>
          <Form.Item
            label="Room Name"
            name="roomName"
            rules={[{ required: true, message: 'Please enter the Room Name!' }]}
          >
            <Input placeholder="Enter Id User" value={roomName} onChange={(e) => setRoomName(e.target.value)} />
          </Form.Item>

          <Form.Item
            label="Price"
            name="price"
            rules={[{ required: true, message: 'Please enter the number of price!' }]}
          >
            <Input
              type="number"
              placeholder="Enter number of price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </Form.Item>

          <Form.Item
            label="Room Category"
            name="idRoomCategories"
            rules={[{ required: true, message: 'Please select idCategory!' }]}
          >
            <Select
              placeholder="Select idCategory"
              value={idRoomCategories}
              onChange={(value) => setIdRoomCategory(value)}
            >
              {listCategory.map((item) => (
                <Option value={item.id} key={item.id}>
                  {item.room_type}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="active" valuePropName="checked">
            <Checkbox checked={active} onChange={(e) => setActive(e.target.checked)}>
              Active
            </Checkbox>
          </Form.Item>
        </Form>
      </Modal>

      <Modal title="Edit Room" open={isModalOpenEdit} onCancel={handleEditCancel} onOk={handleEditCourse}>
        {selectedUser && (
          <Form layout="vertical" form={formEdit}>
            <Form.Item label="Room Name" name="roomName" required>
              <Input
                value={selectedUser.room_name}
                onChange={(e) => setSelectedUser({ ...selectedUser, room_name: e.target.value })}
              />
            </Form.Item>
            <Form.Item label="Price" name="price" required>
              <Input
                value={selectedUser.price}
                onChange={(e) => setSelectedUser({ ...selectedUser, price: e.target.value })}
              />
            </Form.Item>
            <Form.Item label="Room Category" name="idRoomCategories" required>
              <Select
                placeholder="Select idCategory"
                value={selectedUser.id_room_categories}
                onChange={(value) => setSelectedUser({ ...selectedUser, id_room_categories: value })}
              >
                {listCategory.map((item) => (
                  <Option value={item.id} key={item.id}>
                    {item.room_type}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="active" valuePropName="checked">
              <Checkbox
                checked={selectedUser.status === 1}
                onChange={(e) => setSelectedUser({ ...selectedUser, status: e.target.checked ? 1 : 0 })}
              >
                Active
              </Checkbox>
            </Form.Item>
          </Form>
        )}
      </Modal>
    </>
  );
};

export default Room;
