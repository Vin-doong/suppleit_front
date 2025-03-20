import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const NaverCallback = () => {
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleNaverCallback = async () => {
      try {
        // URL에서 인증 코드만 가져오기
        const searchParams = new URLSearchParams(location.search);
        const code = searchParams.get('code');
        
        if (!code) {
          throw new Error('인증 코드를 찾을 수 없습니다');
        }

        // 백엔드로 코드만 전송
        const response = await axios.post('http://localhost:8000/api/social/login/naver', {
          code: code
        });

        console.log('네이버 로그인 응답:', response.data);

        // 응답 데이터 구조에 따라 토큰 저장 로직 구현
        if (response.data && response.data.data) {
          // 응답 구조가 { data: { accessToken, refreshToken } } 인 경우
          const responseData = response.data.data;
          
          if (responseData.accessToken) {
            localStorage.setItem('accessToken', responseData.accessToken);
            localStorage.setItem('refreshToken', responseData.refreshToken);
            
            // 역할 정보 저장 (추가)
            if (responseData.member && responseData.member.memberRole) {
              localStorage.setItem('role', responseData.member.memberRole);
              console.log("역할 정보 저장:", responseData.member.memberRole);
            } else {
              localStorage.setItem('role', 'USER');
              console.log("기본 역할 'USER' 저장");
            }
            
            // 이벤트 발생 및 홈페이지 이동
            window.dispatchEvent(new Event('storage'));
            navigate('/');
            return;
          }
        }
        
        // 응답 구조가 { accessToken, refreshToken } 인 경우
        if (response.data && response.data.accessToken) {
          localStorage.setItem('accessToken', response.data.accessToken);
          localStorage.setItem('refreshToken', response.data.refreshToken);
          
          // 역할 정보 저장 (추가)
          if (response.data.member && response.data.member.memberRole) {
            localStorage.setItem('role', response.data.member.memberRole);
            console.log("역할 정보 저장:", response.data.member.memberRole);
          } else {
            localStorage.setItem('role', 'USER');
            console.log("기본 역할 'USER' 저장");
          }
          
          window.dispatchEvent(new Event('storage'));
          navigate('/');
          return;
        }
        
        throw new Error('서버에서 토큰을 받지 못했습니다');
      } catch (error) {
        console.error('네이버 로그인 오류:', error);
        setError('네이버 로그인 처리 중 오류가 발생했습니다.');
        setTimeout(() => navigate('/login'), 3000);
      }
    };

    handleNaverCallback();
  }, [location, navigate]);

  // 나머지 컴포넌트 코드는 그대로 유지
  if (error) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        backgroundColor: '#f8f9fa'
      }}>
        <h2>로그인 오류</h2>
        <p>{error}</p>
        <p>잠시 후 로그인 페이지로 이동합니다...</p>
      </div>
    );
  }

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column',
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      backgroundColor: '#f8f9fa'
    }}>
      <h2>네이버 로그인 처리 중</h2>
      <p>잠시만 기다려주세요...</p>
      <div className="loading-spinner" style={{ 
        width: '40px', 
        height: '40px', 
        border: '4px solid #f3f3f3',
        borderTop: '4px solid #1ec800',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }}></div>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default NaverCallback;