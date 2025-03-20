import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const GoogleCallback = () => {
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const apiCallMade = useRef(false); // API 호출 여부를 추적하는 ref

  useEffect(() => {
    const handleGoogleCallback = async () => {
      // 이미 API 호출이 진행 중인 경우 추가 호출 방지
      if (apiCallMade.current) return;
      apiCallMade.current = true;
      
      try {
        // URL에서 인증 코드 가져오기
        const searchParams = new URLSearchParams(location.search);
        const code = searchParams.get('code');
        
        if (!code) {
          throw new Error('인증 코드를 찾을 수 없습니다');
        }

        // 백엔드를 통해 코드를 토큰으로 교환 - 응답 세부 정보 확인
        console.log("백엔드 API 요청 시작 - 코드:", code.substring(0, 10) + "...");
        const response = await axios.post('http://localhost:8000/api/social/login/google', {
          code: code
        });

        console.log('구글 로그인 응답 전체:', response);
        console.log('구글 로그인 응답 데이터:', response.data);

        // 응답 구조에 따른 조건부 처리
        if (response.data && response.data.data) {
          const responseData = response.data.data;
          console.log('응답 데이터 내부:', responseData);
          
          // accessToken이 data 객체 내부에 있는 경우
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
            
            console.log('토큰 저장 완료 (data 객체 내부)');
            window.dispatchEvent(new Event('storage'));
            navigate('/');
            return;
          }
        }
        
        // accessToken이 최상위 레벨에 있는 경우
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
          
          console.log('토큰 저장 완료 (최상위 레벨)');
          window.dispatchEvent(new Event('storage'));
          navigate('/');
          return;
        }
        
        // 모든 경우를 검사했지만 토큰이 없는 경우
        console.error('응답에 토큰이 포함되어 있지 않습니다:', response.data);
        throw new Error('서버에서 토큰을 받지 못했습니다');
        
      } catch (error) {
        console.error('구글 로그인 오류:', error);
        console.error('오류 세부 정보:', error.response?.data || error.message);
        setError(`구글 로그인 처리 중 오류가 발생했습니다: ${error.response?.data?.message || error.message}`);
        setTimeout(() => navigate('/login'), 3000);
      }
    };

    handleGoogleCallback();
  }, [location, navigate]);

  // 나머지 부분은 동일하게 유지
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