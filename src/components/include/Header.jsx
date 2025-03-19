import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Nav, Navbar } from 'react-bootstrap';

const Header = ({ isTokenExpired }) => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");
    if (accessToken || refreshToken) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [isTokenExpired]);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("check");
    localStorage.removeItem("username");
    localStorage.removeItem("email");
    localStorage.removeItem("role");
    localStorage.removeItem("id");
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <>
      <Navbar bg="white" expand="lg" className="shadow-sm">
        <Container>
          <Navbar.Brand href="/" className="text-teal-500 font-bold">SUPPLE IT</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Link to="/" className="nav-link text-gray-700 hover:text-teal-500">홈</Link>
              <Link to="/login" className='nav-link text-gray-700 hover:text-teal-500'>로그인</Link>
              <Link to="/schedule" className='nav-link text-gray-700 hover:text-teal-500'>스케쥴</Link>
              <Link to="/notice" className='nav-link text-gray-700 hover:text-teal-500'>공지사항</Link>
            </Nav>
            {isLoggedIn && (
              <button 
                type='button' 
                onClick={handleLogout}
                className="px-4 py-2 text-teal-500 border border-teal-500 hover:bg-teal-500 hover:text-white transition-colors rounded-button"
              >
                로그아웃
              </button>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>    
    </>
  );
};

export default Header;
