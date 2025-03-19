import React, { useState, useMemo } from "react";
import { Container, Form, Button, Card } from "react-bootstrap";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/include/Navbar";

const NoticeBoardInsert = ({ onSubmit }) => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState(""); 
  const [author] = useState("관리자");
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      alert("제목과 내용을 입력하세요!");
      return;
    }

    const newNotice = {
      id: Date.now(),
      title,
      content,  
      author,
      views: 0,
      date: new Date().toISOString().split("T")[0],
      file: file ? URL.createObjectURL(file) : null,
    };

    onSubmit(newNotice);
    navigate("/notices");
  };

  const modules = {
    toolbar: [
      [{ header: "1" }, { header: "2" }, { font: [] }],
      [{ list: "ordered" }, { list: "bullet" }],
      ["bold", "italic", "underline", "strike"],
      ["link", "image"],
      ["clean"],
    ],
  };

  return (
    <>
      <Navbar />
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
                <Form.Label>작성자</Form.Label>
                <Form.Control type="text" value={author} readOnly />
              </Form.Group>

              <Form.Group className="mb-3">
              <Form.Label>내용</Form.Label>
              <div style={{ border: "none", borderRadius: "5px", padding: "5px", minHeight: "300px" }}>
                <ReactQuill 
                  theme="snow" 
                  value={content}  
                  modules={modules} 
                  onChange={setContent} 
                  style={{ height: "250px" }} // 내부 텍스트 입력 영역만 줄이기
                />
              </div>
            </Form.Group>

              <Form.Group className="mb-3">
                <Form.Control type="file" onChange={handleFileChange} />
              </Form.Group>

              <div className="d-flex justify-content-end">
                <Button variant="secondary" className="me-2" onClick={() => navigate("/notices")}>
                  취소
                </Button>
                <Button style={{ backgroundColor: "#2A9D8F", color: "white", border: "none" }} type="submit">
                  등록
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
