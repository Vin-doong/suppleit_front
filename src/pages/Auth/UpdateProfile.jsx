import React, { useState } from "react";
import { Form, Button, Container, Row, Col, ButtonGroup, ToggleButton } from "react-bootstrap";
import "../Auth/Signup.css";
import Header from "../../components/include/Header";

const UpdateProfile = () => {
  // 사용자 정보 미리 불러오는 예시 (이 값은 실제 서버에서 받아온 값으로 대체해야 함.)
  const userData = {
    email: "user@example.com", 
    password: "1234", 
    nickname: "키위",
    birthDate: "1990-01-01",
    gender: "남자",
  };

  const [formData, setFormData] = useState({
    email: userData.email,
    password: userData.password,
    confirmPassword: "",
    nickname: userData.nickname,
    birthDate: userData.birthDate,
    gender: userData.gender,
  });

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // 필수 입력값이 비어 있는지 확인
    const { password, confirmPassword, nickname, birthDate, gender } = formData;

    if (!password || !confirmPassword || !nickname || !birthDate || !gender) {
      alert("모든 필드를 채워주세요.");
      return;
    }

    if (password !== confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    // 서버에 데이터 업데이트 요청 보내기
    console.log("회원정보 수정 정보:", formData);
    alert("정보 수정 완료!");
  };

  return (
    <>
      <Header />
      <div className="signup-page">
        <Container className="signup-container">
          <Row className="justify-content-md-center">
            <Col md={6}>
              <div className="signup-card">
                <h2 className="mb-3">회원정보 수정</h2> {/* 수정된 제목 */}
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label className="signup-form-label">이메일</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled // 이메일은 수정 불가하다고 가정
                      className="signup-form-control"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="signup-form-label">비밀번호</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="비밀번호를 입력하세요"
                      className="signup-form-control"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="signup-form-label">비밀번호 확인</Form.Label>
                    <Form.Control
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="비밀번호를 다시 입력하세요"
                      className="signup-form-control"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="signup-form-label">닉네임</Form.Label>
                    <Form.Control
                      type="text"
                      name="nickname"
                      value={formData.nickname}
                      onChange={handleChange}
                      className="signup-form-control"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="signup-form-label">생년월일</Form.Label>
                    <Form.Control
                      type="date"
                      name="birthDate"
                      value={formData.birthDate}
                      onChange={handleChange}
                      className="signup-form-control"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>성별</Form.Label>
                    <ButtonGroup className="gender-button-group">
                      {["남자", "여자"].map((g, idx) => (
                        <ToggleButton
                          key={idx}
                          id={`gender-${g}`}
                          type="radio"
                          name="gender"
                          value={g}
                          variant="outline-primary"
                          checked={formData.gender === g}
                          onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                          className={`gender-button ${formData.gender === g ? "isActive" : ""}`}
                        >
                          {g}
                        </ToggleButton>
                      ))}
                    </ButtonGroup>
                  </Form.Group>

                  <Button variant="primary" type="submit" className="signup-btn-primary">
                    정보 수정
                  </Button>
                </Form>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default UpdateProfile;
