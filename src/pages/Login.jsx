import React, { useState } from 'react';
import './login.css';  // CSS 파일을 import

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  const handleLogin = () => {
    if (!username || !password) {
      setIsPopupVisible(true);
    } else {
      setIsPopupVisible(false);
      console.log('로그인 시도:', username, password);
    }
  };
  

  return (
    <div className="login-container"
  style={{
    backgroundImage: "url('/images/back.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  }}
>
      <div className="login-box">
        <h2>로그인</h2>

        <div className="input-group">
          <label htmlFor="username">아이디</label>
          <input
            type="text"
            id="username"
            placeholder="아이디를 입력하세요"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label htmlFor="password">비밀번호</label>
          <input
            type="password"
            id="password"
            placeholder="비밀번호를 입력하세요"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button className="login-button" onClick={handleLogin}>로그인</button>

        <div className="signup-link">
          <p>계정이 없으신가요? <a href="#">회원가입</a></p>
        </div>

        {/* 구글, 카카오, 네이버 로그인 PNG 버튼 */}
        <div className="social-login" style={{border: 'none' }}>
          <button className="social-button google">
            <a href="https://accounts.google.com/ServiceLogin" target="_blank" rel="noopener noreferrer">
              <img src="/images/Google.png" alt="구글 로그인" className="social-icon" />
            </a>
          </button>
          <button className="social-button kakao">
            <a href="https://accounts.kakao.com/login/?continue=https%3A%2F%2Faccounts.kakao.com%2Fweblogin%2Faccount#login" target="_blank" rel="noopener noreferrer">
              <img src="/images/kakao.png" alt="카카오 로그인" className="social-icon" />
            </a>
          </button>
          <button className="social-button naver">  {/* 네이버 버튼에 개별 클래스 추가 */}
    <a href="https://nid.naver.com/nidlogin.login" target="_blank" rel="noopener noreferrer">
      <img src="/images/Naver.png" alt="네이버 로그인" className="social-icon" />
    </a>
  </button>
</div>

        {/* 팝업 모달 */}
        {isPopupVisible && (
          <div className="popup-overlay">
            <div className="popup-message">
              <p>아이디와 비밀번호를 입력해주세요.</p>
              <button onClick={() => setIsPopupVisible(false)} className="popup-close-button">
                닫기
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
