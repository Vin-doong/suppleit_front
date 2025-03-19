import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* 로고 영역 */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img
                src="/images/logo.png" // public 폴더 기준으로 변경
                className="h-8 w-auto"
                alt="SUPPLE IT Logo"
              />
              <span className="ml-2 text-xl font-bold text-gray-900">SUPPLE IT</span>
            </Link>
          </div>

          {/* 네비게이션 메뉴 */}
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-teal-500 font-medium">홈</Link>
            <Link to="/detail" className="text-gray-700 hover:text-teal-500 font-medium">상세페이지</Link>
            <Link to="/mypage" className="text-gray-700 hover:text-teal-500 font-medium">마이페이지</Link>
            <Link to="/notices" className="text-gray-700 hover:text-teal-500 font-medium">공지사항</Link>
          </div>

          {/* 로그인 및 회원가입 버튼 */}
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => navigate('/login')} 
              className="rounded-md px-4 py-2 text-teal-500 border border-teal-500 hover:bg-teal-500 hover:text-white transition-colors"
            >
              로그인
            </button>
            <Link 
              to="/signup" 
              className="rounded-md px-4 py-2 bg-teal-500 text-white hover:bg-teal-600 transition-colors"
            >
              회원가입
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
