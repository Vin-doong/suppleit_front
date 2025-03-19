import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Card, Button, Row, Col } from "react-bootstrap";
import Navbar from "../components/include/Navbar";

const NoticeBoardDetail = ({ notices }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(true);

  const notice = notices.find((n) => n.id === parseInt(id));

  if (!notice) {
    return (
      <Container style={{ marginTop: "100px" }}>
        <Card className="p-5 shadow-lg text-center" style={{ maxWidth: "800px", margin: "auto", height: "400px" }}>
          <h3>해당 공지사항을 찾을 수 없습니다.</h3>
          <Button variant="primary" className="mt-3" onClick={() => navigate("/notices")}>
            공지사항 목록으로 돌아가기
          </Button>
        </Card>
      </Container>
    );
  }

  return (
    <>
      <Navbar />
      <Container style={{ marginTop: "100px", maxWidth: "1100px" }}>
        <Card className="p-5 shadow-lg d-flex flex-column" style={{ height: "auto" }}>
          <h2 className="mb-4" style={{ fontSize: "1.5rem", fontWeight: "bold" }}>{notice.title}</h2>

          <p className="text-muted">
            <strong>작성자:</strong> {notice.author} | <strong>조회수:</strong> {notice.views} | <strong>날짜:</strong> {notice.date}
          </p>
          <hr />

          {/* ✅ 내용 표시 */}
          <div className="flex-grow-1 mb-4 fs-5" style={{ overflowY: "auto", maxHeight: "450px" }} 
              dangerouslySetInnerHTML={{ __html: notice.content }} />

          {/* ✅ 첨부 파일 표시 (파일명 클릭 시 다운로드) */}
          {notice.file && (
            <div className="mt-4 p-3 border rounded bg-light d-flex align-items-center">
              <strong className="me-2">첨부 파일:</strong>
              <a href={notice.file} download style={{ textDecoration: "underline", color: "blue", cursor: "pointer" }}>
                {decodeURIComponent(notice.file.split("/").pop())} {/* ✅ 파일명 + 확장자 표시 */}
              </a>
            </div>
          )}

          {/* ✅ 버튼 간격 조정 */}
          <Row className="mt-4">
            <Col>
              <Button variant="secondary" onClick={() => navigate("/notices")}>
                목록으로 돌아가기
              </Button>
            </Col>
            {isAdmin && (
              <Col className="text-end">
                <Button variant="warning" className="me-2" onClick={() => navigate(`/notices/edit/${id}`)}>
                  수정
                </Button>
                <Button variant="danger" onClick={() => alert("삭제 기능은 나중에 추가될 예정입니다!")}>
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
