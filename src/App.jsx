// App.jsx의 import 부분을 확인
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { useState } from "react";
import Home from "./pages/Home/Home";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import MyPage from "./pages/Home/MyPage";
import ProductList from "./pages/Product/ProductList";
import ProductDetail from "./pages/Product/ProductDetail";
import ReviewForm from "./pages/Product/ReviewForm";
import FavoriteList from "./pages/Home/FavoriteList";
import NoticeBoard from "./pages/Notice/NoticeBoard";
import NoticeBoardDetail from "./pages/Notice/NoticeBoardDetail";
import NoticeBoardEdit from "./pages/Notice/NoticeBoardEdit";
import NoticeBoardInsert from "./pages/Notice/NoticeBoardInsert";
import Schedule from "./pages/Schedule";
import GoogleCallback from "./pages/Auth/GoogleCallback";
import NaverCallback from "./pages/Auth/NaverCallback";
import UpdateProfile from "./pages/Auth/UpdateProfile";

function App() {
  // 공지사항 상태 관리
  const [notices, setNotices] = useState([]);

  // 공지사항 추가 함수
  const handleAddNotice = (newNotice) => {
    setNotices((prevNotices) => [newNotice, ...prevNotices]);
  };

  return (
    <Router> 
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/profile" element={<UpdateProfile />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/productdetail" element={<ProductDetail />} />
        <Route path="/review" element={<ReviewForm />} />
        <Route path="/favorites" element={<FavoriteList />} />
        
        {/* 공지사항 라우트 - 수정된 경로 */}
        <Route path="/notices" element={<NoticeBoard />} />
        <Route path="/notices/:id" element={<NoticeBoardDetail />} />
        <Route path="/notices/edit/:id" element={<NoticeBoardEdit />} />
        <Route path="/newnotice" element={<NoticeBoardInsert onSubmit={handleAddNotice} />} />
        
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/callback/google" element={<GoogleCallback />} />
        <Route path="/callback/naver" element={<NaverCallback />} />
      </Routes>
    </Router>
  );
}

export default App;