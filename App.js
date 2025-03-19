import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/include/Navbar';
import Footer from './components/include/Footer';
import Home from './pages/Home';
import MyPage from './pages/MyPage'; // 마이페이지 추가
import Login from './src/pages/Login';

const App = () => {
  return (
    <Router>
      {/* 네비게이션 바를 Router 내부에 포함 */}
      <Navbar />  
      
      <div className="min-h-screen flex flex-col bg-gray-900 text-gray-100 font-[Noto_Sans_KR]">
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/mypage" element={<MyPage />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
