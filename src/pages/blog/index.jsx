import { useEffect, useState } from 'react';
import { Table, Button, Input, Space, Modal, Form, Checkbox } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';
import axios from 'axios';
import noImage from '/img/no-image.avif';
import './style.scss';

// const { Search } = Input;

const Blog = () => {
  const token = Cookies.get('token');
  const [form] = Form.useForm();
  const [formEdit] = Form.useForm();

  const [blogName, setBlogName] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [detailDescription, setDetailDescription] = useState('');
  const [imageLink, setImageLink] = useState('');
  const [active, setActive] = useState(true);

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
      title: 'Blog Name',
      dataIndex: 'blog_name',
      key: 'blog_name',
    },
    {
      title: 'Short Description',
      dataIndex: 'short_describe',
      key: 'short_describe',
    },
    {
      title: 'Detail Description',
      dataIndex: 'detail_describe',
      key: 'detail_describe',
    },
    {
      title: 'Image',
      dataIndex: 'img',
      key: 'img',
      render: (img) => <img src={img ? img : noImage} style={{ width: '100px', height: '100px' }} />,
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
        </Space>
      ),
    },
  ];

  const getUserAPI = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_DOMAIN}api/staff/list-blog`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data.blog);
      response.data.blog ? setListUser(response.data.blog) : setListUser([]);
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
    if (!blogName || !shortDescription || !detailDescription || !imageLink) {
      Swal.fire({
        title: 'Warning: Please Complete All Required Information',
        text: 'Please fill in all the information.',
        icon: 'warning',
      });
      return;
    }

    const params = {
      blog_name: blogName,
      short_describe: shortDescription,
      detail_describe: detailDescription,
      img: imageLink,
      status: active ? 1 : 0,
    };

    try {
      const response = await axios.post(`${import.meta.env.VITE_DOMAIN}api/staff/create-blog`, params, {
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

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`${import.meta.env.VITE_DOMAIN}api/staff/delete-blog/${id}`, {
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
    if (!selectedUser.blog_name || !selectedUser.short_describe || !selectedUser.detail_describe || !selectedUser.img) {
      Swal.fire({
        title: 'Warning: Please Complete All Required Information',
        text: 'Please fill in all the information.',
        icon: 'warning',
      });
      return;
    }

    const params = {
      blog_name: selectedUser.blog_name,
      short_describe: selectedUser.short_describe,
      detail_describe: selectedUser.detail_describe,
      img: selectedUser.img,
      status: selectedUser.status,
    };

    try {
      const response = await axios.post(`${import.meta.env.VITE_DOMAIN}api/staff/edit-blog/${selectedUser.id}`, params, {
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
        blogName: selectedUser.blog_name,
        shortDescription: selectedUser.short_describe,
        detailDescription: selectedUser.detail_describe,
        imageLink: selectedUser.img,
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
        title="Add Blog"
        open={isModalOpen}
        onOk={handleSignUp}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleSignUp}>
            Add Blog
          </Button>,
        ]}
      >
        <Form layout="vertical" form={form}>
          <Form.Item
            label="Blog Name"
            name="blogName"
            rules={[{ required: true, message: 'Please enter the Blog Name!' }]}
          >
            <Input placeholder="Enter Blog Name" value={blogName} onChange={(e) => setBlogName(e.target.value)} />
          </Form.Item>
          <Form.Item
            label="Shoft Description"
            name="shortDescribe"
            rules={[{ required: true, message: 'Please enter the Shoft Description!' }]}
          >
            <Input
              placeholder="Enter Shoft Description"
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
            />
          </Form.Item>
          <Form.Item
            label="Detail Description"
            name="detailDescribe"
            rules={[{ required: true, message: 'Please enter the Detail Description!' }]}
          >
            <Input.TextArea
              placeholder="Enter Detail Description"
              value={detailDescription}
              onChange={(e) => setDetailDescription(e.target.value)}
              rows={4}
            />
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

      <Modal title="Edit Blog" open={isModalOpenEdit} onCancel={handleEditCancel} onOk={handleEditCourse}>
        {selectedUser && (
          <Form layout="vertical" form={formEdit}>
            <Form.Item label="Blog Name" name="blogName" required>
              <Input
                value={selectedUser.room_name}
                onChange={(e) => setSelectedUser({ ...selectedUser, blog_name: e.target.value })}
              />
            </Form.Item>
            <Form.Item label="Short Description" name="shortDescription" required>
              <Input
                value={selectedUser.short_describe}
                onChange={(e) => setSelectedUser({ ...selectedUser, short_describe: e.target.value })}
              />
            </Form.Item>
            <Form.Item label="Detail Description" name="detailDescription" required>
              <Input
                value={selectedUser.detail_describe}
                onChange={(e) => setSelectedUser({ ...selectedUser, detail_describe: e.target.value })}
              />
            </Form.Item>
            <Form.Item label="Image Link" name="imageLink" required>
              <Input
                value={selectedUser.img}
                onChange={(e) => setSelectedUser({ ...selectedUser, img: e.target.value })}
              />
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

export default Blog;
