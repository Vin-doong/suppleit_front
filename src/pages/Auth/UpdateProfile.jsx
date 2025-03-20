import React, { useState, useEffect } from "react";
import { Form, Button, Container, Row, Col, ButtonGroup, ToggleButton } from "react-bootstrap";
import { getMemberInfo } from "../../services/api";
import "../Auth/Signup.css";
import Header from "../../components/include/Header";

const UpdateProfile = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    nickname: "",
    birthDate: "",
    gender: ""
  });

  // 컴포넌트가 마운트될 때 사용자 정보 가져오기
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const response = await getMemberInfo();
        
        // API 응답에서 사용자 정보 추출
        const userData = response.data;
        
        // 가져온 정보로 폼 데이터 설정 (비밀번호 필드는 빈 값으로 설정)
        setFormData({
          email: userData.email || "",
          password: "",
          confirmPassword: "",
          nickname: userData.nickname || "",
          birthDate: userData.birth || "",
          // gender 값을 '남자' 또는 '여자'로 변환
          gender: userData.gender === "MALE" ? "남자" : 
                 userData.gender === "FEMALE" ? "여자" : ""
        });
        
        setLoading(false);
      } catch (error) {
        console.error("사용자 정보 가져오기 오류:", error);
        setError("사용자 정보를 불러오는데 실패했습니다.");
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 닉네임 필수 검증
    if (!formData.nickname || !formData.birthDate || !formData.gender) {
      alert("닉네임, 생년월일, 성별은 필수 입력 항목입니다.");
      return;
    }

    // 비밀번호 변경을 원할 경우에만 비밀번호 검증
    if (formData.password || formData.confirmPassword) {
      if (formData.password !== formData.confirmPassword) {
        alert("비밀번호가 일치하지 않습니다.");
        return;
      }
    }

    try {
      // 서버에 전송할 데이터 준비 (백엔드 API 형식에 맞게)
      const updateData = {
        nickname: formData.nickname,
        gender: formData.gender === "남자" ? "MALE" : "FEMALE",
        birth: formData.birthDate
      };

      // 비밀번호가 입력된 경우에만 포함
      if (formData.password) {
        updateData.password = formData.password;
      }

      // 회원 정보 업데이트 API 호출
      // const response = await updateMemberInfo(updateData);
      
      // 실제 API 호출을 할 때는 위 주석을 해제하고 아래 console.log는 제거해주세요
      console.log("회원정보 수정 요청 데이터:", updateData);
      
      alert("회원 정보가 성공적으로 수정되었습니다.");
    } catch (error) {
      console.error("회원 정보 수정 오류:", error);
      alert("회원 정보 수정 중 오류가 발생했습니다: " + 
            (error.response?.data?.message || error.message));
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="d-flex justify-content-center align-items-center" style={{ height: "80vh" }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">로딩 중...</span>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <div className="d-flex justify-content-center align-items-center" style={{ height: "80vh" }}>
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="signup-page">
        <Container className="signup-container">
          <Row className="justify-content-md-center">
            <Col md={6}>
              <div className="signup-card">
                <h2 className="mb-3">회원정보 수정</h2>
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label className="signup-form-label">이메일</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      disabled // 이메일은 수정 불가
                      className="signup-form-control"
                    />
                    <Form.Text className="text-muted">
                      이메일은 변경할 수 없습니다.
                    </Form.Text>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="signup-form-label">새 비밀번호</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="변경할 비밀번호를 입력하세요 (선택사항)"
                      className="signup-form-control"
                    />
                    <Form.Text className="text-muted">
                      비밀번호를 변경하지 않으려면 빈칸으로 두세요.
                    </Form.Text>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="signup-form-label">비밀번호 확인</Form.Label>
                    <Form.Control
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="새 비밀번호를 다시 입력하세요"
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
                      required
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
                      required
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
                          required
                        >
                          {g}
                        </ToggleButton>
                      ))}
                    </ButtonGroup>
                  </Form.Group>

                  <div className="d-flex justify-content-center mt-4">
                    <Button 
                      variant="primary" 
                      type="submit" 
                      className="signup-btn-primary"
                      style={{ width: "120px" }}
                    >
                      정보 수정
                    </Button>
                    <Button 
                      variant="secondary" 
                      onClick={() => window.history.back()} 
                      style={{ marginLeft: "20px", width: "120px" }}
                    >
                      취소
                    </Button>
                  </div>
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