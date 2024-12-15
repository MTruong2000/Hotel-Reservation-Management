import { useEffect, useState } from 'react';
import { Table, Button, Input, Modal, Form, Checkbox } from 'antd';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';
import axios from 'axios';
import noImage from '/img/no-image.avif';
import './style.scss';

// const { Search } = Input;

const ListProductStaff = () => {
  const token = Cookies.get('token');
  const [formEdit] = Form.useForm();

  const [listUser, setListUser] = useState([]);
  const [isModalOpenEdit, setIsModalOpenEdit] = useState(false);
  const [selectedUser, setSelectedUser] = useState({});
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      align: 'center',
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
      render: (status, record) =>
        status === 1 ? (
          <Button
            type="primary"
            onClick={handleChangeStatus(record.id)}
            style={{ backgroundColor: 'green', borderColor: 'green' }}
          >
            Active
          </Button>
        ) : (
          <Button
            type="primary"
            onClick={handleChangeStatus(record.id)}
            style={{ backgroundColor: 'yellow', borderColor: 'yellow', color: 'black' }}
          >
            Inactive
          </Button>
        ),
    },
  ];

  const getUserAPI = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_DOMAIN}api/staff/list-product`, {
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

  const handleChangeStatus = (id) => async () => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_DOMAIN}api/staff/change-status/${id}`,
        {},
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
        title: response.data.message,
        showConfirmButton: false,
        timer: 1500,
      });
      getUserAPI();
    } catch (error) {
      Swal.fire({
        title: 'Request Fail ?',
        text: error,
        icon: 'error',
      });
    }
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

export default ListProductStaff;
