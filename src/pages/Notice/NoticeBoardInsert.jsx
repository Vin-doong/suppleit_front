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
  const [fileType, setFileType] = useState(""); // 파일 타입 추적을 위한 상태
  const [isSubmitting, setIsSubmitting] = useState(false); // 제출 중 상태 추적
  const [previewImage, setPreviewImage] = useState(null); // 이미지 미리보기

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
      
      // 이미지 파일인 경우 미리보기 생성
      if (selectedFile.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewImage(reader.result);
        };
        reader.readAsDataURL(selectedFile);
      } else {
        setPreviewImage(null); // 이미지가 아닌 경우 미리보기 제거
      }
      
      console.log("선택된 파일 타입:", selectedFile.type);
    } else {
      setFile(null);
      setFileType("");
      setPreviewImage(null);
    }
  };

  // 파일 제거 핸들러
  const handleRemoveFile = () => {
    setFile(null);
    setFileType("");
    setPreviewImage(null);
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

      // 여기서 이미지인지 일반 첨부파일인지 판단하지 않고, 서버로 전송
      // 서버에서 파일 유형에 따라 적절히 처리
      const response = await createNotice(noticeData);
      
      alert("공지사항이 성공적으로 등록되었습니다.");
      
      // 성공 시 새로 생성된 공지사항 상세 페이지로 이동
      if (response.data && response.data.noticeId) {
        navigate(`/notices/${response.data.noticeId}`);
      } else {
        navigate("/notices"); // ID가 없으면 목록으로 이동
      }
    } catch (error) {
      console.error("공지사항 등록 중 오류:", error);
      alert("공지사항 등록 중 오류가 발생했습니다: " + 
            (error.response?.data?.message || error.message));
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
                <div style={{ minHeight: "300px" }}>
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
                <Form.Label>파일 첨부 (이미지 또는 첨부파일)</Form.Label>
                <Form.Control type="file" onChange={handleFileChange} />
                {file && (
                  <div className="mt-2 d-flex align-items-center">
                    <span className="text-muted me-2">
                      {fileType.startsWith('image/') 
                        ? `선택된 이미지: ${file.name}` 
                        : `선택된 파일: ${file.name}`}
                    </span>
                    <Button 
                      variant="outline-danger" 
                      size="sm"
                      onClick={handleRemoveFile}
                    >
                      제거
                    </Button>
                  </div>
                )}
              </Form.Group>

              {/* 이미지 미리보기 */}
              {previewImage && (
                <Form.Group className="mb-3">
                  <Form.Label>이미지 미리보기</Form.Label>
                  <div>
                    <img 
                      src={previewImage} 
                      alt="이미지 미리보기" 
                      style={{ maxWidth: "300px", maxHeight: "200px" }} 
                      className="border rounded"
                    />
                  </div>
                </Form.Group>
              )}

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
                  disabled={isSubmitting || !title.trim() || !content.trim()}
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