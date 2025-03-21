import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Form, Button, Card } from "react-bootstrap";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { createNotice } from '../../services/api';
import Header from "../../components/include/Header";

const NoticeBoardInsert = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);
  const [fileType, setFileType] = useState(""); // 파일 타입 추적을 위한 상태 추가
  const [isSubmitting, setIsSubmitting] = useState(false); // 제출 중 상태 추적

  useEffect(() => {
    const checkUserRole = () => {
      const userRole = localStorage.getItem("role");
      const isAdmin = userRole === "ADMIN";
      setIsAdmin(isAdmin);

      if (!isAdmin) {
        alert("공지사항 작성 권한이 없습니다. 관리자만 작성할 수 있습니다.");
        navigate("/notices");
      }
    };
    
    checkUserRole();
  }, [navigate]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileType(selectedFile.type);
      console.log("선택된 파일 타입:", selectedFile.type);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) {
      alert("제목과 내용을 입력하세요!");
      return;
    }

    if (isSubmitting) {
      return; // 중복 제출 방지
    }

    try {
      setIsSubmitting(true);
      
      // FormData 객체로 데이터 준비
      const noticeData = {
        title,
        content,
        file
      };

      await createNotice(noticeData);
      
      alert("공지사항이 성공적으로 등록되었습니다.");
      navigate("/notices");
    } catch (error) {
      console.error("공지사항 등록 중 오류:", error);
      alert("공지사항 등록 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
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

  // 관리자가 아닌 경우 작성 페이지 렌더링 방지
  if (!isAdmin) {
    return null;
  }

  return (
    <>
      <Header />
      <div style={{ backgroundColor: "#c0ebe5", padding: "20px", minHeight: "100vh" }}>
        <Container style={{ marginTop: "50px" }}>
          <Card className="p-4 shadow-lg">
            <h2 className="mb-3 text-center" style={{ fontSize: "24px", fontWeight: "bold" }}>공지사항 쓰기</h2>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>제목</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="공지사항 제목을 입력하세요"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>내용</Form.Label>
                <div style={{ border: "none", borderRadius: "5px", padding: "5px", minHeight: "300px" }}>
                  <ReactQuill 
                    theme="snow" 
                    value={content}  
                    modules={modules} 
                    formats={formats}
                    onChange={setContent} 
                    style={{ height: "250px" }}
                  />
                </div>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>첨부 파일</Form.Label>
                <Form.Control type="file" onChange={handleFileChange} />
                {file && (
                  <div className="mt-2 text-muted">
                    {fileType.startsWith('image/') 
                      ? `선택된 이미지: ${file.name}` 
                      : `선택된 파일: ${file.name}`}
                  </div>
                )}
              </Form.Group>

              <div className="d-flex justify-content-end">
                <Button 
                  variant="secondary" 
                  className="me-2" 
                  onClick={() => navigate("/notices")}
                  disabled={isSubmitting}
                >
                  취소
                </Button>
                <Button 
                  style={{ backgroundColor: "#2A9D8F", color: "white", border: "none" }} 
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "등록 중..." : "등록"}
                </Button>
              </div>
            </Form>
          </Card>
        </Container>
      </div>
    </>
  );
};

export default NoticeBoardInsert;