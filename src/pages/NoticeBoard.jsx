import { Button, Card, Form, Table, Pagination } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Navbar from "../components/include/Navbar";
import "./NoticeBoard.css";

const NoticeBoard = ({ notices }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 상태
  const itemsPerPage = 10; // 페이지 당 보여줄 공지사항 수

  // 검색어에 맞는 공지사항 필터링
  const filteredNotices = notices.filter((notice) =>
    notice.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 페이지네이션을 위한 페이지 데이터 계산
  const indexOfLastNotice = currentPage * itemsPerPage;
  const indexOfFirstNotice = indexOfLastNotice - itemsPerPage;
  const currentNotices = filteredNotices.slice(indexOfFirstNotice, indexOfLastNotice);

  // 페이지 변경 핸들러
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // 페이지네이션 버튼 생성
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(filteredNotices.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  const moveInsert = () => {
    navigate("/newnotice");
  };

  return (
    <>
      <Navbar />
      <div className="notice-container">
        <Card className="notice-card shadow-lg p-4">
          <Card.Body className="d-flex flex-column flex-grow-1">
            <h2 className="notice-title text-center mb-4" style={{ color: "#0d9488", fontWeight: "bold" }}>
              공지사항
            </h2>

            {/* 검색창 */}
            <div className="notice-search d-flex justify-content-center mb-4">
              <Form.Control
                type="text"
                placeholder="  검색어를 입력하세요"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: "60%",
                  marginRight: "10px",
                  borderColor: "#0d9488",
                  borderRadius: "30px",
                  boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
                }}
              />
              <Button
                className="search-button"
                style={{
                  backgroundColor: "#0d9488",
                  borderColor: "#0d9488",
                  borderRadius: "30px",
                  padding: "0.5rem 2rem",
                  fontSize: "1rem",
                }}
              >
                검색
              </Button>
            </div>

            {/* 공지사항 테이블 */}
            <div className="notice-table-container">
              <Table striped bordered hover responsive className="notice-table text-center">
                <colgroup>
                  <col style={{ width: "15%" }} /> {/* 번호 */}
                  <col style={{ width: "50%" }} /> {/* 제목 (가장 넓게) */}
                  <col style={{ width: "10%" }} /> {/* 작성자 */}
                  <col style={{ width: "10%" }} /> {/* 조회수 */}
                  <col style={{ width: "15%" }} /> {/* 작성일 */}
                </colgroup>
                <thead style={{ backgroundColor: "#0d9488", color: "white" }}>
                  <tr>
                    <th>번호</th>
                    <th>제목</th>
                    <th>작성자</th>
                    <th>조회수</th>
                    <th>작성일</th>
                  </tr>
                </thead>
                <tbody>
                  {currentNotices.length > 0 ? (
                    currentNotices.map((notice, index) => (
                      <tr key={index}>
                        <td>{notice.id}</td>
                        <td
                          onClick={() => navigate(`/notice/${notice.id}`)}
                          className="notice-title-link"
                          style={{ cursor: "pointer", color: "#0d9488" }}
                        >
                          {notice.title}
                        </td>
                        <td>{notice.author}</td>
                        <td>{notice.views}</td>
                        <td>{notice.date}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center text-muted">
                        검색 결과가 없습니다.
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>

          {/* 페이지네이션 */}
            <div className="pagination-container d-flex justify-content-center">
              <Pagination>
                <Pagination.Prev
                  onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                />
                {pageNumbers.map((number) => (
                  <Pagination.Item
                    key={number}
                    active={number === currentPage}
                    onClick={() => handlePageChange(number)}
                  >
                    {number}
                  </Pagination.Item>
                ))}
                <Pagination.Next
                  onClick={() => currentPage < pageNumbers.length && handlePageChange(currentPage + 1)}
                />
              </Pagination>
            </div>

            {/* 글쓰기 버튼 */}
            <div className="notice-button-container text-center">
              <Button
                className="notice-write-button"
                onClick={moveInsert}
                style={{
                  backgroundColor: "#0d9488",
                  borderColor: "#0d9488",
                  borderRadius: "30px",
                  padding: "0.5rem 2rem",
                  fontSize: "1.1rem",
                }}
              >
                글쓰기
              </Button>
            </div>
          </Card.Body>
        </Card>
      </div>
    </>
  );
};

export default NoticeBoard;
