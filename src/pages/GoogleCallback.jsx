import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const GoogleCallback = () => {
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleGoogleCallback = async () => {
      try {
        // URL에서 인증 코드 가져오기
        const searchParams = new URLSearchParams(location.search);
        const code = searchParams.get('code');
        
        if (!code) {
          throw new Error('인증 코드를 찾을 수 없습니다');
        }

        // 백엔드를 통해 코드를 토큰으로 교환
        const response = await axios.post('http://localhost:8000/api/social/login/google', {
            code: code
        });

        console.log('구글 로그인 응답:', response.data);

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
        console.error('구글 로그인 오류:', error);
        setError('구글 로그인 처리 중 오류가 발생했습니다.');
        setTimeout(() => navigate('/login'), 3000);
      }
    };

    handleGoogleCallback();
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
      <h2>구글 로그인 처리 중</h2>
      <p>잠시만 기다려주세요...</p>
      <div className="loading-spinner" style={{ 
        width: '40px', 
        height: '40px', 
        border: '4px solid #f3f3f3',
        borderTop: '4px solid #3498db',
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

export default GoogleCallback;