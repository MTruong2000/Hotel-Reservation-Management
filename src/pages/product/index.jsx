import { useEffect, useState } from 'react';
import { Table, Button, Input, Space, Modal, Form } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';
import axios from 'axios';
import './style.scss';

// const { Search } = Input;

const Product = () => {
  const token = Cookies.get('token');
  const [form] = Form.useForm();
  const [formEdit] = Form.useForm();

  const [idUser, setIdUser] = useState('');
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [idCategory, setIdCategory] = useState('');

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
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
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
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Button icon={<DeleteOutlined />} danger onClick={() => handleDelete(record.id)} />
        </Space>
      ),
    },
  ];

  const getUserAPI = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_DOMAIN}api/admin/list-product`, {
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
    if (!idUser || !name || !price || !idCategory) {
      Swal.fire({
        title: 'Warning: Please Complete All Required Information',
        text: 'Please fill in all the information.',
        icon: 'warning',
      });
      return;
    }

    const params = {
      id_user: idUser,
      name,
      price,
      id_category: idCategory,
      status: 1,
    };

    try {
      const response = await axios.post(`${import.meta.env.VITE_DOMAIN}api/admin/create-product`, params, {
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
      const response = await axios.delete(`${import.meta.env.VITE_DOMAIN}api/admin/delete-product/${id}`, {
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

  const handleEdit = (record) => {
    setSelectedUser(record);
    setIsModalOpenEdit(true);
  };

  const handleEditCourse = async () => {
    if (!selectedUser.id_user || !selectedUser.name || !selectedUser.price || !selectedUser.id_category) {
      Swal.fire({
        title: 'Warning: Please Complete All Required Information',
        text: 'Please fill in all the information.',
        icon: 'warning',
      });
      return;
    }

    const params = new FormData();
    params.append('id_user', selectedUser.id_user);
    params.append('name', selectedUser.name);
    params.append('price', selectedUser.price);
    params.append('id_category', selectedUser.id_category);
    params.append('status', 1);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_DOMAIN}api/admin/edit-product/${selectedUser.id}`,
        params,
        {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: response.data,
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
        id_user: selectedUser.id_user,
        name: selectedUser.name,
        price: selectedUser.price,
        id_category: selectedUser.id_category,
      });
    }
  }, [selectedUser, formEdit]);

  console.log(selectedUser);
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
        title="Add Product"
        open={isModalOpen}
        onOk={handleSignUp}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleSignUp}>
            Add Product
          </Button>,
        ]}
      >
        <Form layout="vertical" form={form}>
          <Form.Item label="Id User" name="idUser" rules={[{ required: true, message: 'Please enter the Id User!' }]}>
            <Input placeholder="Enter Id User" value={idUser} onChange={(e) => setIdUser(e.target.value)} />
          </Form.Item>

          <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Please enter name!' }]}>
            <Input placeholder="Enter name" value={name} onChange={(e) => setName(e.target.value)} />
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
            label="Id Category"
            name="idCategory"
            rules={[{ required: true, message: 'Please enter idCategory!' }]}
          >
            <Input placeholder="Enter idCategory" value={idCategory} onChange={(e) => setIdCategory(e.target.value)} />
          </Form.Item>
        </Form>
      </Modal>
      <Modal title="Edit Product" open={isModalOpenEdit} onCancel={handleEditCancel} onOk={handleEditCourse}>
        {selectedUser && (
          <Form layout="vertical" form={formEdit}>
            <Form.Item label="Id User" name="id_user" required>
              <Input
                value={selectedUser.id_user}
                onChange={(e) => setSelectedUser({ ...selectedUser, id_user: e.target.value })}
              />
            </Form.Item>
            <Form.Item label="Name" name="name" required>
              <Input
                value={selectedUser.name}
                onChange={(e) => setSelectedUser({ ...selectedUser, name: e.target.value })}
              />
            </Form.Item>
            <Form.Item label="Price" name="price" required>
              <Input
                value={selectedUser.price}
                onChange={(e) => setSelectedUser({ ...selectedUser, price: e.target.value })}
              />
            </Form.Item>
            <Form.Item label="Id Category" name="id_category" required>
              <Input
                value={selectedUser.id_category}
                onChange={(e) => setSelectedUser({ ...selectedUser, id_category: e.target.value })}
              />
            </Form.Item>
          </Form>
        )}
      </Modal>
    </>
  );
};

export default Product;
