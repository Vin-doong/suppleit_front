// App.jsx의 import 부분을 확인
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import MyPage from "./pages/MyPage";
import ProductList from "./pages/ProductList";
import ProductDetail from "./pages/ProductDetail";
import ReviewForm from "./pages/ReviewForm";
import FavoriteList from "./pages/FavoriteList";
import NoticeBoard from "./pages/NoticeBoard";
// 수정: schedule -> Schedule (대소문자 확인)
import Schedule from "./pages/Schedule"; 
import NoticeBoardInsert from "./pages/NoticeBoardInsert";
import { useState } from "react";
import NoticeBoardDetail from "./pages/NoticeBoardDetail";
import NoticeBoardEdit from "./pages/NoticeBoardEdit";
import Navbar from "./components/include/Navbar";

import GoogleCallback from "./pages/GoogleCallback";
import NaverCallback from "./pages/NaverCallback";

function App() {
  // 공지사항 상태 관리
  const [notices, setNotices] = useState([]);

  // 공지사항 추가 함수
  const handleAddNotice = (newNotice) => {
    setNotices((prevNotices) => [newNotice, ...prevNotices]);
  };

  return (
    <Router>
      <Navbar />   
      <div className="min-h-screen flex flex-col bg-gray-900 text-gray-100 font-[Noto_Sans_KR]">
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/mypage" element={<MyPage />} />
            <Route path="/products" element={<ProductList />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/review" element={<ReviewForm />} />
            <Route path="/favorites" element={<FavoriteList />} />
            <Route path="/notices" element={<NoticeBoard notices={notices}/>} />
            <Route path="/notice/:id" element={<NoticeBoardDetail notices={notices} />} />
            <Route path="/notices/edit/:id" element={<NoticeBoardEdit notices={notices} />} />
            <Route path="/newnotice" element={<NoticeBoardInsert onSubmit={handleAddNotice} />} />
            <Route path="/schedule" element={<Schedule />} />

            <Route path="/callback/google" element={<GoogleCallback />} />
            <Route path="/callback/naver" element={<NaverCallback />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;