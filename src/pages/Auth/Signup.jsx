import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Container, Row, Col, ButtonGroup, ToggleButton, Modal } from "react-bootstrap";
import "./Signup.css";
import { signup } from '../../services/api';

const Signup = () => {
  //회원가입 데이터 
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    nickname: "",
    birthDate: "",
    gender: "",
    termsAgreed: false,
  });

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }
    
    if (!formData.termsAgreed) {
      alert("약관에 동의해야 합니다.");
      return;
    }
    
    try {
      // 백엔드로 전송할 회원가입 데이터 준비
      const userData = {
        email: formData.email,
        password: formData.password,
        nickname: formData.nickname,
        gender: formData.gender === "남자" ? "MALE" : "FEMALE",
        birth: formData.birthDate,
        memberRole: "USER",
        socialType: "NONE"
      };
      
      // API 호출하여 회원가입 요청
      const response = await signup(userData);
      
      if (response.data && response.data.success) {
        alert("회원가입에 성공했습니다!");
        navigate('/login'); // 로그인 페이지로 이동
      } else {
        alert(response.data.message || "회원가입에 실패했습니다.");
      }
    } catch (error) {
      console.error("회원가입 오류:", error);
      alert(error.response?.data?.message || "회원가입 중 오류가 발생했습니다.");
    }
  };

  const [showModal, setShowModal] = useState(false);

  return (
    <>
    <div className="signup-page">
      <Container className="signup-container">
        <Row className="justify-content-md-center">
          <Col md={6}>
            <div className="signup-card">
              <h2 className="mb-3">회원가입</h2>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label className="signup-form-label">이메일</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
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
                    required
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
                    required
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
                    required
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
                    required
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

              <Form.Group className="mb-3 d-flex align-items-center">
                {/* 체크박스 */}
                <Form.Check
                  type="checkbox"
                  name="termsAgreed"
                  checked={formData.termsAgreed}
                  onChange={handleChange}
                  required
                  className="me-2"
                />
                {/* 모달을 열 수 있는 텍스트 */}
                <span
                  style={{ color: "#007bff", cursor: "pointer", fontSize: "14px" }}
                  onClick={() => setShowModal(true)}
                >
                  [필수] 개인정보 수집 및 이용 동의서
                </span>
              </Form.Group>

              {/* 🏆 React-Bootstrap Modal */}
              <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                  <Modal.Title>개인정보 수집 및 이용 동의서</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <p>
                  [필수] 개인정보 수집 및 이용 동의서<br /> <br />
                  1. 수집 목적: 회원가입, 서비스 제공, 고객 지원.  <br />
                  2. 수집 항목: 이메일, 비밀번호, 생년월일, 성별.  <br />
                  3. 보유 기간: 회원 탈퇴 시 즉시 삭제 (단, 법령에 따라 일정 기간 보관될 수 있음).  <br />
                  4. 제3자 제공: 법적 의무 또는 이용자 동의 없이 제공되지 않음.  <br />
                  5. 이용자 권리: 개인정보 열람·수정·삭제 가능, 동의 철회 가능.  <br /> <br />
                  ※ 동의하지 않을 경우 서비스 이용이 제한될 수 있습니다.
                  </p>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={() => setShowModal(false)}>
                    닫기
                  </Button>
                </Modal.Footer>
              </Modal>

                <Button variant="primary" type="submit" className="signup-btn-primary">
                  회원가입
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

export default Signup;
