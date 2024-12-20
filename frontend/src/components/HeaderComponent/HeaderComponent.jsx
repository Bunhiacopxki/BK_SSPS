import React, {useState, useEffect} from 'react'
import {
  WrapperContainer
} from './style'
import { 
  BellOutlined,
  SearchOutlined,
  AlignLeftOutlined, 
  LogoutOutlined, 
  UserOutlined, 
  SafetyCertificateOutlined, 
  ShopOutlined,
  ShoppingOutlined,
  InboxOutlined,

} from '@ant-design/icons';
import { Input, Dropdown, Menu, Badge } from 'antd';
import user from '../../assets/user.png';
import { Link } from "react-router-dom";
import axios from "axios";


const { Search } = Input;

const HeaderComponent = ({ isOpen, setIsOpen }) => {
  const [notifications, setNotifications] = useState([]);
  const [countpage, setCountPage] = useState(0);
  const [countNotice, setCountNotice] = useState(0);
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const apiUrl = process.env.REACT_APP_API_URL;

  const handleLogout = async () => {
    try {
        await axios.post(`${apiUrl}auth/log_out`, {}, { withCredentials: true });
        localStorage.clear();
        window.location.href = '/';
    } catch (error) {
        console.error('Logout failed:', error);
    }
  };

  const goOrders = async (id, idspham) => {
      const data = { id };
      await axios.post(`${apiUrl}user/notice`, data, { withCredentials: true });
      if(idspham!==''){
        window.location.href = '/history';
      }else{
        window.location.href = '/buy';
      }
  };

  const truncateText = (text, maxLength) => {
    if (!text) {
      return ''; 
    }
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + '...';
    }
    return text;
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${apiUrl}user/notice`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });
        const data = await response.json();
        setNotifications(data.message);
        let count = data.message.filter(item => item.trang_thai === 0).length;
        setCountNotice(count);
        setCount(data.message.length)
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setIsLoading(false);
      }
    };
    const fetchUserProfile = async () => {
      try {
        const response = await fetch(`${apiUrl}user/profile`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include',
        });

        const data = await response.json();

        if (response.ok) {
          setCountPage(data.so_giay_con)
        }
      } catch (error) {
        console.error('Lỗi:', error);
      }
    };
    fetchNotifications();
    fetchUserProfile();
  }, [setCountNotice, apiUrl]);  
  

  const notice = (
    <Menu style={{ width: '350px', maxHeight: '300px', overflow: 'auto', position: 'relative', padding: 0, margin: 0 }}>
      <div style={{
        position: 'sticky',
        top: 0,
        background: '#fff',
        zIndex: 1,
        padding: '10px 15px',
      }}>
        <div style={{ margin: 0, fontWeight: 'bold', fontSize: '18px' }}>Thông báo</div>
      </div>
      {isLoading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
          <div className="loader" />
        </div>
      ) : (
        count === 0 ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px', gap: '5px'}}>
            <InboxOutlined style={{ fontSize: '25px', color: '#6f6f6f' }} />
            <div style={{ color: '#6f6f6f'}}>Bạn chưa có thông báo nào!</div>
          </div>
        ) : (
          Object.entries(notifications).map(([key, item]) => (
            <Menu.Item key={key} style={{ position: 'relative', display: 'flex', alignItems: 'center', padding: '10px 15px' }} onClick={() => goOrders(item.ID, item.ma_don)}>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexGrow: 1 }}>
                <div style={{
                  backgroundColor: item.trang_thai === 0 ? '#00d67f' : '#6f6f6f',
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <ShoppingOutlined style={{ fontSize: '20px', color: '#fff' }} />
                </div>
                <div
                  style={{ color: '#444', textAlign: 'left', wordWrap: 'break-word', whiteSpace: 'normal' }}
                >
                  {truncateText(item.noi_dung, 73)}
                </div>
              </div>
            </Menu.Item>
          ))
        )
      )}
    </Menu>
  );  

  const menu = (
    <Menu style={{ width: '250px', maxHeight: '300px' }}>
      <div style={{ marginLeft: '15px', padding: '10px 0' }}>
        <div style={{ fontSize: '18px', fontWeight: 'bold' }}>
          {localStorage.getItem("name")}
        </div>
        <div style={{ fontSize: '11px', color: '#444' }}>{localStorage.getItem("email")}</div>
      </div>

      <Menu.Item key="0">
        <Link to="/myaccount" style={{ color: '#444' }} >
          <div style={{ display: 'flex', gap: '10px' }}>
            <UserOutlined />
            <div style={{ fontSize: '14px' }}>Trang cá nhân</div>
          </div>
        </Link>
      </Menu.Item>
      <Menu.Item key="1">
        <Link to="/history" style={{ color: '#444' }} >
          <div style={{ display: 'flex', gap: '10px' }}>
            <ShopOutlined />
            <div style={{ fontSize: '14px' }}>Lịch sử in tài liệu</div>
          </div>
        </Link>
      </Menu.Item>
      {localStorage.getItem("role") === 'SPSO' ?(
      <Menu.Item key="2">
        <Link to="/admin/home" style={{ color: '#444' }} >
          <div style={{ display: 'flex', gap: '10px' }}>
            <SafetyCertificateOutlined />
            <div style={{ fontSize: '14px' }}>Quản trị hệ thống</div>
          </div>
        </Link>
      </Menu.Item>
      ): null}
      <div style={{ width: '250px', borderBottom: '1.5px solid #F5F5F5', margin: '5px 0' }} />
      <Menu.Item key="3">
        <div style={{ display: 'flex', gap: '10px' }} onClick={handleLogout}>
          <LogoutOutlined />
          <div style={{ color: '#444' }}>Đăng xuất</div>
        </div>
      </Menu.Item>
    </Menu>
  );

  return (
    <WrapperContainer>
      <div className='wrap-outline'>
        <AlignLeftOutlined style={{ cursor: 'pointer' }} onClick={() => setIsOpen(!isOpen)} />
        <SearchOutlined style={{ cursor: 'pointer', paddingLeft: '20px' }} />
      </div>
      <div className='left-container'>
        <Search placeholder="Tìm kiếm bất cứ thứ gì..." className='wrap-search' size='large' />
      </div>
      <div className='right-container'>
        <div className='wrap-button-con'>
          <div className='wrap-button'>
          {countpage} Trang
          </div>
        </div>
        <Dropdown overlay={notice} trigger={['click']} overlayStyle={{ paddingTop: '10px'}} >
        <Badge count={countNotice}> 
          <BellOutlined style={{ fontSize: '25px', color: '#444', cursor: 'pointer' }} />
        </Badge>
        </Dropdown>
        <Dropdown overlay={menu} trigger={['click']} overlayStyle={{ paddingTop: '10px' }} >
          <img src={user} alt='user' width="40px" style={{ cursor: 'pointer' }} />
        </Dropdown>
      </div>
    </WrapperContainer>
  )
}

export default HeaderComponent