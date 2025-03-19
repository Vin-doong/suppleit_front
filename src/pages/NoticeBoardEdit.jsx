import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Card, Button, Form } from "react-bootstrap";
import ReactQuill from "react-quill-new";  // ✅ TinyMCE 대신 ReactQuill 사용
import "react-quill-new/dist/quill.snow.css";
import Navbar from "../components/include/Navbar";

const NoticeBoardEdit = ({ notices }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false); // 관리자 권한 상태 추가
  const notice = notices.find((n) => n.id === parseInt(id));

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

// 사용자 권한 확인 및 리디렉션 로직 추가
  useEffect(() => {
    const checkUserRole = () => {
      const userRole = localStorage.getItem("role");
      const isAdmin = userRole === "ADMIN";
      setIsAdmin(isAdmin);

      // 관리자가 아닌 경우 목록 페이지로 리디렉션
      if (!isAdmin) {
        alert("공지사항 수정 권한이 없습니다. 관리자만 수정할 수 있습니다.");
        navigate("/notices");
      }
    };
    
    checkUserRole();
    
    // 공지사항 데이터 로드
    if (notice) {
      setTitle(notice.title);
      setContent(notice.content);
    }
  }, [notice, navigate]);

  if (!notice) {
    return (
      <Container style={{ marginTop: "100px" }}>
        <Card className="p-4 shadow-lg text-center">
          <h3>해당 공지사항을 찾을 수 없습니다.</h3>
          <Button variant="primary" className="mt-3" onClick={() => navigate("/notices")}>
            공지사항 목록으로 돌아가기
          </Button>
        </Card>
      </Container>
    );
  }

  // ✅ ReactQuill 모듈 설정 (아까와 동일)
  const modules = {
    toolbar: [
      [{ header: "1" }, { header: "2" }, { font: [] }],
      [{ list: "ordered" }, { list: "bullet" }],
      ["bold", "italic", "underline", "strike"],
      ["link", "image"],
      ["clean"],
    ],
  };

  // ✅ 저장 (현재는 alert만 띄움, 실제 저장 로직 추가 필요)
  const handleSave = () => {
    alert("수정된 내용이 저장되었습니다! (실제 저장 기능 추가 예정)");
    navigate(`/notices/${id}`);
  };
  
  // 관리자가 아닌 경우 수정 페이지 렌더링 방지
  if (!isAdmin) {
    return null;
  }

  return (
    <>
      <Navbar />
      <Container style={{ marginTop: "100px" }}>
        <Card className="p-4 shadow-lg">
          <h2 className="mb-3" style={{ fontSize: "1.8rem", fontWeight: "bold" }}>
            📢 공지사항 수정
          </h2>

          <Form.Group className="mb-3">
            <Form.Label>제목</Form.Label>
            <Form.Control
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>내용</Form.Label>
            <ReactQuill theme="snow" value={content} onChange={setContent} modules={modules} />
          </Form.Group>

          <div className="d-flex justify-content-end">
            <Button variant="secondary" className="me-2" onClick={() => navigate(`/notices/${id}`)}>
              취소
            </Button>
            <Button variant="success" onClick={handleSave}>
              수정 완료
            </Button>
          </div>
        </Card>
      </Container>
    </>
  );
};

export default NoticeBoardEdit;
