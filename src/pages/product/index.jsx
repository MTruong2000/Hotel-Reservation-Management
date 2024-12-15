import { useEffect, useState } from 'react';
import { Table, Button, Input, Space, Modal, Form, Select, Checkbox } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';
import axios from 'axios';
import noImage from '/img/no-image.avif';
import { Option } from 'antd/es/mentions';
import './style.scss';

// const { Search } = Input;

const Product = () => {
  const authData = Cookies.get('Auth');
  const authObject = JSON.parse(authData);

  const token = Cookies.get('token');
  const [form] = Form.useForm();
  const [formEdit] = Form.useForm();

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [idCategory, setIdCategory] = useState('');
  const [listCategory, setListCategory] = useState([]);
  const [imageLink, setImageLink] = useState('');
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
      title: 'Image',
      dataIndex: 'image',
      key: 'image',
      render: (image) => <img src={image ? image : noImage} style={{ width: '100px', height: '100px' }} />,
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

  const getCategoryRoom = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_DOMAIN}api/admin/list-cate-product`, {
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
    if (!name || !price || !idCategory || !imageLink) {
      Swal.fire({
        title: 'Warning: Please Complete All Required Information',
        text: 'Please fill in all the information.',
        icon: 'warning',
      });
      return;
    }

    const params = {
      id_user: authObject.id,
      name,
      price,
      id_category: idCategory,
      image: imageLink,
      status: active ? 1 : 0,
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
    params.append('image', selectedUser.image);
    params.append('status', selectedUser.status ? 1 : 0);

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
        imageLink: selectedUser.image,
        status: selectedUser.status,
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
            label="Product Category"
            name="idRoomCategories"
            rules={[{ required: true, message: 'Please select idCategory!' }]}
          >
            <Select placeholder="Select idCategory" value={idCategory} onChange={(value) => setIdCategory(value)}>
              {listCategory.map((item) => (
                <Option value={item.id} key={item.id}>
                  {item.CateName}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Image Link"
            name="imageLink"
            rules={[{ required: true, message: 'Please enter the Image Link!' }]}
          >
            <Input placeholder="Enter Image Link" value={imageLink} onChange={(e) => setImageLink(e.target.value)} />
          </Form.Item>
          <Form.Item name="active" valuePropName="checked">
            <Checkbox checked={active} onChange={(e) => setActive(e.target.checked)}>
              Active
            </Checkbox>
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
            <Form.Item label="ImageLink" name="imageLink" required>
              <Input
                value={selectedUser.image}
                onChange={(e) => setSelectedUser({ ...selectedUser, image: e.target.value })}
              />
            </Form.Item>
            <Form.Item name="status" valuePropName="checked">
              <Checkbox
                checked={selectedUser.status}
                onChange={(e) => setSelectedUser({ ...selectedUser, status: e.target.checked })}
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

export default Product;
