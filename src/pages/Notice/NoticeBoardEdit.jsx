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
  const [fileType, setFileType] = useState("");
  const [removeExistingFile, setRemoveExistingFile] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileType(selectedFile.type);
      console.log("선택된 파일 타입:", selectedFile.type);
    }
  };

  // 기존 파일 제거 핸들러
  const handleRemoveFile = () => {
    setRemoveExistingFile(true);
  };

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      alert("제목과 내용을 입력하세요!");
      return;
    }

    if (isSubmitting) {
      return; // 중복 제출 방지
    }

    try {
      setIsSubmitting(true);
      
      // 공지사항 수정 데이터 준비
      const noticeData = {
        title,
        content,
        file,
        removeAttachment: removeExistingFile
      };

      await updateNotice(id, noticeData);
      alert("공지사항이 성공적으로 수정되었습니다.");
      navigate(`/notices/${id}`);
    } catch (error) {
      console.error("공지사항 수정 중 오류:", error);
      alert("공지사항 수정 중 오류가 발생했습니다.");
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
            {file && (
              <div className="mt-2 text-muted">
                {fileType.startsWith('image/') 
                  ? `새로 선택된 이미지: ${file.name}` 
                  : `새로 선택된 파일: ${file.name}`}
              </div>
            )}
            {/* 기존 파일 표시 및 제거 버튼 */}
            {notice.attachmentName && !removeExistingFile && (
              <div className="mt-2 d-flex align-items-center">
                <span className="text-muted me-2">현재 파일: {notice.attachmentName}</span>
                <Button 
                  variant="outline-danger" 
                  size="sm" 
                  onClick={handleRemoveFile}
                >
                  제거
                </Button>
              </div>
            )}
            {removeExistingFile && (
              <div className="mt-2 text-danger">
                파일이 제거됩니다.
              </div>
            )}
          </Form.Group>

          {/* 이미지 미리보기 (있는 경우) */}
          {notice.imagePath && !removeExistingFile && (
            <Form.Group className="mb-3">
              <Form.Label>현재 이미지</Form.Label>
              <div>
                <img 
                  src={`/api/notice/image/${notice.imagePath}`}
                  alt="현재 이미지" 
                  style={{ maxWidth: "300px", maxHeight: "200px" }} 
                  className="border rounded"
                />
                <Button 
                  variant="outline-danger" 
                  size="sm" 
                  className="ml-2 d-block mt-2"
                  onClick={handleRemoveFile}
                >
                  이미지 제거
                </Button>
              </div>
            </Form.Group>
          )}

          {/* 버튼 그룹 */}
          <div className="d-flex justify-content-end">
            <Button 
              variant="secondary" 
              className="me-2" 
              onClick={() => navigate(`/notices/${id}`)}
              disabled={isSubmitting}
            >
              취소
            </Button>
            <Button 
              variant="primary" 
              onClick={handleSave}
              disabled={!title.trim() || !content.trim() || isSubmitting}
            >
              {isSubmitting ? "수정 중..." : "수정 완료"}
            </Button>
          </div>
        </Card>
      </Container>
    </>
  );
};

export default NoticeBoardEdit;