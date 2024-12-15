import { RiDashboardLine, RiUser3Line, RiListCheck2, RiLogoutBoxLine } from 'react-icons/ri';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';
import Swal from 'sweetalert2';
import './style.scss';

function Sidebar() {
  const token = Cookies.get('token');
  const navigate = useNavigate();
  const authData = Cookies.get('Auth');
  const authObject = JSON.parse(authData);

  const handleLogout = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_DOMAIN}api/admin/logout`, {
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
      const cookies = document.cookie.split(';');

      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i];
        const eqPos = cookie.indexOf('=');
        const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;

        document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/';
      }

      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      console.error('Logout error:', error);
      Swal.fire({
        title: 'Fail ?',
        text: 'Logout fails',
        icon: 'error',
      });
    }
  };
  return (
    <>
      <div className="sidebar">
        <h2 className="sidebar-title">HOTEL MANAGEMENT</h2>
        <ul className="sidebar-menu">
          {authObject.level === 1 && (
            <>
              <li className="menu-item">
                <Link className="" to={`/`}>
                  <RiDashboardLine className="icon" />
                  Dashboard
                </Link>
              </li>
              <li className="menu-item">
                <Link className="" to={`/user`}>
                  <RiUser3Line className="icon" /> Quản lý nhân viên
                </Link>
              </li>
              <li className="menu-item">
                <Link className="" to={`/category-room`}>
                  <RiListCheck2 className="icon" /> Quản lý loại phòng
                </Link>
              </li>
              <li className="menu-item">
                <Link className="" to={`/service`}>
                  <RiListCheck2 className="icon" /> Quản lý dịch vụ
                </Link>
              </li>
              <li className="menu-item">
                <Link className="" to={`/category-product`}>
                  <RiListCheck2 className="icon" /> Quản lý loại sản phẩm
                </Link>
              </li>
              <li className="menu-item">
                <Link className="" to={`/product`}>
                  <RiListCheck2 className="icon" /> Quản lý sản phẩm
                </Link>
              </li>
            </>
          )}
          {authObject.level === 3 && (
            <>
              <li className="menu-item">
                <Link className="" to={`/room`}>
                  <RiListCheck2 className="icon" /> Quản lý phòng
                </Link>
              </li>
              <li className="menu-item">
                <Link className="" to={`/list-product`}>
                  <RiListCheck2 className="icon" /> Danh sách sản phẩm
                </Link>
              </li>
              <li className="menu-item">
                <Link className="" to={`/blog`}>
                  <RiListCheck2 className="icon" /> Quản lý blog
                </Link>
              </li>
            </>
          )}

          <li className="menu-item logout-item" onClick={handleLogout}>
            <RiLogoutBoxLine className="icon" /> Logout
          </li>
        </ul>
      </div>
    </>
  );
}

export default Sidebar;
