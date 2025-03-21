import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Container, Row, Col, ButtonGroup, ToggleButton, Alert } from "react-bootstrap";
import { getMemberInfo, updateMemberInfo, checkNickname, deleteMember } from "../../services/api";
import "../Auth/Signup.css";
import Header from "../../components/include/Header";

const UpdateProfile = () => {
  const navigate = useNavigate();
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
  const [originalNickname, setOriginalNickname] = useState("");
  const [nicknameValidation, setNicknameValidation] = useState({
    checked: false,
    available: false
  });
  const [isSocialAccount, setIsSocialAccount] = useState(false);
  const [socialType, setSocialType] = useState("");

  // 컴포넌트가 마운트될 때 사용자 정보 가져오기
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const response = await getMemberInfo();
        
        // API 응답에서 사용자 정보 추출
        const userData = response.data;
        
        console.log("사용자 정보:", userData);
        
        // 소셜 계정 여부 확인 (socialType이 'NONE'이 아니면 소셜 계정)
        const isSocial = userData.socialType !== 'NONE';
        setIsSocialAccount(isSocial);
        setSocialType(userData.socialType || 'NONE');
        
        // 원본 닉네임 저장 (중복 검사 시 필요)
        setOriginalNickname(userData.nickname || "");
        
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

  // 닉네임 변경 시 유효성 검사 결과 초기화
  const handleNicknameChange = (e) => {
    if (isSocialAccount) return; // 소셜 계정인 경우 변경 불가
    
    setFormData({
      ...formData,
      nickname: e.target.value
    });
    
    // 원래 닉네임과 같으면 검사 완료 및 사용 가능 표시
    if (e.target.value === originalNickname) {
      setNicknameValidation({
        checked: true,
        available: true
      });
    } else {
      // 다른 닉네임이면 검사 필요
      setNicknameValidation({
        checked: false,
        available: false
      });
    }
  };

  // 일반 필드 변경 핸들러
  const handleChange = (e) => {
    if (isSocialAccount) return; // 소셜 계정인 경우 변경 불가
    
    const { name, value, checked, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // 닉네임 중복 검사
  const handleNicknameCheck = async () => {
    if (isSocialAccount) {
      alert("소셜 계정은 닉네임을 변경할 수 없습니다.");
      return;
    }
    
    // 원래 닉네임과 같으면 중복 검사 없이 통과
    if (formData.nickname === originalNickname) {
      setNicknameValidation({
        checked: true,
        available: true
      });
      alert("현재 사용 중인 닉네임입니다.");
      return;
    }
    
    if (!formData.nickname) {
      alert("닉네임을 입력해주세요.");
      return;
    }

    // 닉네임 길이 검사
    if (formData.nickname.length < 3 || formData.nickname.length > 20) {
      alert("닉네임은 3~20자 사이여야 합니다.");
      return;
    }

    // 닉네임 형식 검사 (영문, 숫자, 한글만)
    const nicknameRegex = /^[a-zA-Z0-9가-힣]+$/;
    if (!nicknameRegex.test(formData.nickname)) {
      alert("닉네임은 영문, 숫자, 한글만 사용할 수 있습니다.");
      return;
    }

    try {
      const response = await checkNickname(formData.nickname);
      console.log("닉네임 중복 확인 응답:", response.data);
      
      if (response.data.isAvailable) {
        setNicknameValidation({
          checked: true,
          available: true
        });
        alert("사용 가능한 닉네임입니다.");
      } else {
        setNicknameValidation({
          checked: true,
          available: false
        });
        alert("이미 사용 중인 닉네임입니다.");
      }
    } catch (error) {
      console.error("닉네임 중복 확인 오류:", error);
      alert("닉네임 중복 확인 중 오류가 발생했습니다.");
    }
  };

  // 소셜 타입에 따른 한글 이름 반환
  const getSocialTypeName = (type) => {
    switch(type) {
      case 'GOOGLE': return '구글';
      case 'NAVER': return '네이버';
      case 'KAKAO': return '카카오';
      default: return '소셜';
    }
  };

  // 회원 탈퇴 처리 함수
  const handleDeleteAccount = async () => {
    // 소셜 계정과 로컬 계정에 따라 다른 확인 메시지 표시
    const message = isSocialAccount
      ? `${getSocialTypeName(socialType)} 계정 연동이 해제되고 회원정보가 삭제됩니다. 계속하시겠습니까?`
      : "회원 탈퇴 시 모든 정보가 삭제되며 복구할 수 없습니다. 정말로 탈퇴하시겠습니까?";

    if (window.confirm(message)) {
      try {
        // 회원 탈퇴 API 호출
        await deleteMember();
        
        // 로컬 스토리지의 인증 정보 삭제 (로그아웃)
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("role");
        
        alert("회원 탈퇴가 완료되었습니다.");
        
        // 로그인 페이지로 이동
        navigate("/login");
      } catch (error) {
        console.error("회원 탈퇴 오류:", error);
        alert("회원 탈퇴 중 오류가 발생했습니다: " + 
              (error.response?.data?.message || error.message));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 소셜 계정인 경우 정보 수정 불가
    if (isSocialAccount) {
      alert("소셜 로그인 계정은 정보를 수정할 수 없습니다.");
      return;
    }

    // 닉네임 필수 검증
    if (!formData.nickname || !formData.birthDate || !formData.gender) {
      alert("닉네임, 생년월일, 성별은 필수 입력 항목입니다.");
      return;
    }

    // 닉네임이 변경되었고 중복 검사를 하지 않았거나 사용할 수 없는 경우
    if (formData.nickname !== originalNickname && (!nicknameValidation.checked || !nicknameValidation.available)) {
      alert("닉네임 중복 확인이 필요합니다.");
      return;
    }

    // 비밀번호 변경을 원할 경우에만 비밀번호 검증
    if (formData.password || formData.confirmPassword) {
      if (formData.password !== formData.confirmPassword) {
        alert("비밀번호가 일치하지 않습니다.");
        return;
      }
      
      // 비밀번호 형식 검증 (8자 이상, 숫자와 특수문자 포함)
      const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
      if (!passwordRegex.test(formData.password)) {
        alert("비밀번호는 8자 이상이며, 숫자와 특수문자를 포함해야 합니다.");
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
      const response = await updateMemberInfo(updateData);
      
      console.log("회원정보 수정 응답:", response.data);
      
      alert("회원 정보가 성공적으로 수정되었습니다.");
      
      // 원본 닉네임 업데이트
      setOriginalNickname(formData.nickname);
      
      // 비밀번호 필드 초기화
      setFormData({
        ...formData,
        password: "",
        confirmPassword: ""
      });
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
                
                {/* 소셜 계정인 경우 안내 메시지 표시 */}
                {isSocialAccount && (
                  <Alert variant="info" className="mb-3">
                    <Alert.Heading>{getSocialTypeName(socialType)} 소셜 로그인 계정</Alert.Heading>
                    <p>
                      소셜 계정은 회원정보를 변경할 수 없습니다. 회원정보 수정이 필요한 경우 {getSocialTypeName(socialType)} 계정에서 관리하세요.
                    </p>
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  {/* 이메일 필드 - 소셜/로컬 계정 모두 수정 불가 */}
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

                  {/* 비밀번호 변경 필드 - 로컬 계정만 표시 */}
                  {!isSocialAccount && (
                    <>
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
                    </>
                  )}

                  {/* 닉네임 필드 - 소셜 계정은 변경 불가 */}
                  <Form.Group className="mb-3">
                    <Form.Label className="signup-form-label">닉네임</Form.Label>
                    <div className="d-flex">
                      <Form.Control
                        type="text"
                        name="nickname"
                        value={formData.nickname}
                        onChange={handleNicknameChange}
                        className="signup-form-control"
                        style={{ flex: "1", minWidth: "0" }}
                        disabled={isSocialAccount}
                        required
                      />
                      <Button 
                        variant="outline-primary" 
                        onClick={handleNicknameCheck}
                        style={{ width: "80px", marginLeft: "8px", whiteSpace: "nowrap" }}
                        disabled={isSocialAccount}
                      >
                        중복확인
                      </Button>
                    </div>
                    {isSocialAccount ? (
                      <Form.Text className="text-muted">
                        소셜 계정은 닉네임을 변경할 수 없습니다.
                      </Form.Text>
                    ) : (
                      <Form.Text className="text-muted">
                        닉네임은 3~20자의 영문, 숫자, 한글만 사용 가능합니다.
                      </Form.Text>
                    )}
                    {!isSocialAccount && nicknameValidation.checked && (
                      <div className={`mt-1 ${nicknameValidation.available ? 'text-success' : 'text-danger'}`}>
                        {nicknameValidation.available ? '✅ 사용 가능한 닉네임입니다.' : '❌ 이미 사용 중인 닉네임입니다.'}
                      </div>
                    )}
                  </Form.Group>

                  {/* 생년월일 필드 - 소셜 계정은 변경 불가 */}
                  <Form.Group className="mb-3">
                    <Form.Label className="signup-form-label">생년월일</Form.Label>
                    <Form.Control
                      type="date"
                      name="birthDate"
                      value={formData.birthDate}
                      onChange={handleChange}
                      className="signup-form-control"
                      disabled={isSocialAccount}
                      required
                    />
                    {isSocialAccount && (
                      <Form.Text className="text-muted">
                        소셜 계정은 생년월일을 변경할 수 없습니다.
                      </Form.Text>
                    )}
                  </Form.Group>

                  {/* 성별 필드 - 소셜 계정은 변경 불가 */}
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
                          disabled={isSocialAccount}
                          required
                        >
                          {g}
                        </ToggleButton>
                      ))}
                    </ButtonGroup>
                    {isSocialAccount && (
                      <Form.Text className="text-muted d-block mt-2">
                        소셜 계정은 성별을 변경할 수 없습니다.
                      </Form.Text>
                    )}
                  </Form.Group>

                  {/* 버튼 그룹 - 소셜 계정은 정보 수정 버튼 비활성화, 탈퇴 버튼은 활성화 */}
                  <div className="d-flex justify-content-between mt-4">
                    <Button 
                      variant="primary" 
                      type="submit" 
                      className="btn-primary"
                      style={{ width: "45%" }}
                      disabled={isSocialAccount || (formData.nickname !== originalNickname && (!nicknameValidation.checked || !nicknameValidation.available))}
                    >
                      정보 수정
                    </Button>
                    
                    <Button 
                      variant="danger" 
                      onClick={handleDeleteAccount}
                      style={{ width: "45%" }}
                    >
                      회원 탈퇴
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