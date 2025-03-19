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
        // URL에서 인증 코드와 state 파라미터 가져오기
        const searchParams = new URLSearchParams(location.search);
        const code = searchParams.get('code');
        const state = searchParams.get('state');
        
        if (!code) {
          throw new Error('인증 코드를 찾을 수 없습니다');
        }

        // CSRF 공격 방지를 위한 state 검증
        const savedState = localStorage.getItem('naverState');
        if (state !== savedState) {
          throw new Error('유효하지 않은 state 파라미터입니다');
        }

        // 저장된 state 제거
        localStorage.removeItem('naverState');

        // 백엔드를 통해 코드를 토큰으로 교환
        const response = await axios.post('http://localhost:8000/api/social/login/naver', {
            code: code, // 인증 코드를 요청 본문에 포함
            state: state // state 값도 포함
          });

        console.log('네이버 로그인 응답:', response.data);

        if (response.data.accessToken) {
          // 토큰 저장
          localStorage.setItem('accessToken', response.data.accessToken);
          localStorage.setItem('refreshToken', response.data.refreshToken);
          
          // 로그인 상태 업데이트를 위한 이벤트 발생
          window.dispatchEvent(new Event('storage'));
          
          // 홈페이지로 이동
          navigate('/');
        } else {
          throw new Error('서버에서 토큰을 받지 못했습니다');
        }
      } catch (error) {
        console.error('네이버 로그인 오류:', error);
        setError('네이버 로그인 처리 중 오류가 발생했습니다.');
        setTimeout(() => navigate('/login'), 3000);
      }
    };

    handleNaverCallback();
  }, [location, navigate]);

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