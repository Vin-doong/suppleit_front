import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Card, Button, Row, Col } from "react-bootstrap";
import { getNoticeById, deleteNotice } from '../../services/api';

const NoticeBoardDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [notice, setNotice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchNotice = async () => {
      try {
        setLoading(true);
        const response = await getNoticeById(id);
        setNotice(response.data);
        setLoading(false);
      } catch (error) {
        console.error("공지사항 조회 중 오류:", error);
        setError("공지사항을 불러오는 중 오류가 발생했습니다.");
        setLoading(false);
      }
    };

    const checkUserRole = () => {
      const userRole = localStorage.getItem("role");
      setIsAdmin(userRole === "ADMIN");
    };

    fetchNotice();
    checkUserRole();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm("정말로 이 공지사항을 삭제하시겠습니까?")) {
      try {
        await deleteNotice(id);
        alert("공지사항이 성공적으로 삭제되었습니다.");
        navigate("/notices");
      } catch (error) {
        console.error("공지사항 삭제 중 오류:", error);
        alert("공지사항 삭제 중 오류가 발생했습니다.");
      }
    }
  };

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>{error}</div>;
  if (!notice) return <div>공지사항을 찾을 수 없습니다.</div>;

  return (
    <>
      <Container style={{ marginTop: "100px", maxWidth: "1100px" }}>
        <Card className="p-5 shadow-lg d-flex flex-column" style={{ height: "auto" }}>
          <h2 className="mb-4" style={{ fontSize: "1.5rem", fontWeight: "bold" }}>{notice.title}</h2>

          <p className="text-muted">
            <strong>작성자:</strong> {notice.author} | <strong>조회수:</strong> {notice.views} | <strong>날짜:</strong> {notice.date}
          </p>
          <hr />

          <div 
            className="flex-grow-1 mb-4 fs-5" 
            style={{ overflowY: "auto", maxHeight: "450px" }} 
            dangerouslySetInnerHTML={{ __html: notice.content }} 
          />

          {notice.file && (
            <div className="mt-4 p-3 border rounded bg-light d-flex align-items-center">
              <strong className="me-2">첨부 파일:</strong>
              <a 
                href={notice.file} 
                download 
                style={{ textDecoration: "underline", color: "blue", cursor: "pointer" }}
              >
                {decodeURIComponent(notice.file.split("/").pop())}
              </a>
            </div>
          )}

          <Row className="mt-4">
            <Col>
              <Button variant="secondary" onClick={() => navigate("/notices")}>
                목록으로 돌아가기
              </Button>
            </Col>
            {isAdmin && (
              <Col className="text-end">
                <Button 
                  variant="warning" 
                  className="me-2" 
                  onClick={() => navigate(`/notices/edit/${id}`)}
                >
                  수정
                </Button>
                <Button variant="danger" onClick={handleDelete}>
                  삭제
                </Button>
              </Col>
            )}
          </Row>
        </Card>
      </Container>
    </>
  );
};

export default NoticeBoardDetail;