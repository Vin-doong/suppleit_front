
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
import Schedule from "./pages/schedule";
import NoticeBoardInsert from "./pages/NoticeBoardInsert";
import { useCallback, useState } from "react";
import NoticeBoardDetail from "./pages/NoticeBoardDetail";
import NoticeBoardEdit from "./pages/NoticeBoardEdit";

function App() {
  //공지사항 관리 시 리덕스 등의 상태관리가 필요한데 리덕스 사용대신 App.jsx에서 넘겨주는 걸로 했습니다.
  const [notices, setNotices] = useState([]);

  const handleAddNotice = useCallback((newNotice) => {
    setNotices((prevNotices) => [newNotice, ...prevNotices]);
  }, []);

  return (
    <Router>
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
      </Routes>
    </Router>
  );
};

export default App;
