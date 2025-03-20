import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Card, Button, Form } from "react-bootstrap";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { getNoticeById, updateNotice } from '../../services/api';
import Header from "../../components/include/Header";

const NoticeBoardEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [notice, setNotice] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkUserRole = () => {
      const userRole = localStorage.getItem("role");
      const isAdmin = userRole === "ADMIN";
      setIsAdmin(isAdmin);

      if (!isAdmin) {
        alert("공지사항 수정 권한이 없습니다.");
        navigate("/notices");
      }
    };

    const fetchNotice = async () => {
      try {
        setLoading(true);
        const response = await getNoticeById(id);
        const noticeData = response.data;
        setNotice(noticeData);
        setTitle(noticeData.title);
        setContent(noticeData.content);
        setLoading(false);
      } catch (error) {
        console.error("공지사항 조회 중 오류:", error);
        setError("공지사항을 불러오는 중 오류가 발생했습니다.");
        setLoading(false);
      }
    };

    checkUserRole();
    fetchNotice();
  }, [id, navigate]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSave = async () => {
    try {
      const noticeData = {
        title,
        content,
        file
      };

      await updateNotice(id, noticeData);
      alert("공지사항이 성공적으로 수정되었습니다.");
      navigate(`/notices/${id}`);
    } catch (error) {
      console.error("공지사항 수정 중 오류:", error);
      alert("공지사항 수정 중 오류가 발생했습니다.");
    }
  };

  // ReactQuill 모듈 설정 - 중복 툴바 방지
  const modules = {
    toolbar: {
      container: [
        [{ header: [1, 2, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        ['link', 'image'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['clean']
      ],
    }
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'link', 'image'
  ];

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>{error}</div>;
  if (!isAdmin) return null;

  return (
    <>
      <Header />
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
              placeholder="공지사항 제목을 입력하세요"
              required
            />
          </Form.Group>

          {/* 내용 입력 필드 */}
          <Form.Group className="mb-3">
            <Form.Label>내용</Form.Label>
            <ReactQuill 
              theme="snow" 
              value={content} 
              onChange={setContent} 
              modules={modules} 
              formats={formats}
              placeholder="공지사항 내용을 입력하세요"
            />
          </Form.Group>

          {/* 파일 업로드 필드 */}
          <Form.Group className="mb-3">
            <Form.Label>첨부 파일</Form.Label>
            <Form.Control 
              type="file" 
              onChange={handleFileChange} 
            />
            {/* 기존 파일 표시 (선택적) */}
            {notice.attachmentName && (
              <div className="mt-2 text-muted">
                현재 파일: {notice.attachmentName}
              </div>
            )}
          </Form.Group>

          {/* 버튼 그룹 */}
          <div className="d-flex justify-content-end">
            <Button 
              variant="secondary" 
              className="me-2" 
              onClick={() => navigate(`/notices/${id}`)}
            >
              취소
            </Button>
            <Button 
              variant="primary" 
              onClick={handleSave}
              disabled={!title.trim() || !content.trim()}
            >
              수정 완료
            </Button>
          </div>
        </Card>
      </Container>
    </>
  );
};

export default NoticeBoardEdit;