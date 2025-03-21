// src/services/api.js
import axios from 'axios';

// 백엔드 API 기본 URL 설정
const API_BASE_URL = "http://localhost:8000/api";

// axios 인스턴스 생성
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 요청 인터셉터 - 모든 요청에 인증 토큰 추가
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 - 인증 오류(401) 처리
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // 401 오류이고 재시도하지 않은 경우 리프레시 토큰으로 시도
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          throw new Error('리프레시 토큰이 없습니다');
        }
        
        // 리프레시 토큰으로 새 액세스 토큰 요청
        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refreshToken
        });
        
        // 새 액세스 토큰 저장
        localStorage.setItem('accessToken', response.data.accessToken);
        
        // 원래 요청의 헤더 업데이트
        originalRequest.headers['Authorization'] = `Bearer ${response.data.accessToken}`;
        
        // 원래 요청 재시도
        return axios(originalRequest);
      } catch (refreshError) {
        // 리프레시 토큰도 만료된 경우 로그아웃 처리
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('role');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// 회원 인증 관련 API
export const login = async (email, password) => {
  return api.post("/auth/login", { email, password });
};

export const logout = async () => {
  return api.post("/auth/logout");
};

export const signup = async (userData) => {
  return api.post("/member/join", userData);
};

export const getMemberInfo = async () => {
  return api.get("/member/info");
};

export const updateMemberInfo = async (userData) => {
  return api.put("/member/update", userData);
};

// 회원 탈퇴 API
export const deleteMember = async () => {
  return api.delete("/member/delete");
};

export const checkEmail = async (email) => {
  return api.get(`/member/validation/email/${email}`);
};

export const checkNickname = async (nickname) => {
  return api.get(`/member/validation/nickname/${nickname}`);
};

// 소셜 로그인 API
export const googleLogin = async (code) => {
  return api.post("/social/login/google", { code });
};

export const naverLogin = async (code, state) => {
  return api.post("/social/login/naver", { code, state });
};

// 공지사항 관련 API
export const getNotices = async () => {
  return api.get("/notice");
};

export const getNoticeById = async (id) => {
  console.log(`공지사항 상세 요청 시작: /notice/${id}`);
  try {
    const response = await api.get(`/notice/${id}`);
    console.log("공지사항 상세 응답 성공:", response.status);
    return response;
  } catch (error) {
    console.error("공지사항 상세 조회 오류:", error);
    throw error;
  }
};

// 공지사항 생성 - FormData 처리 개선
export const createNotice = async (noticeData) => {
  try {
    console.log("공지사항 등록 시작", noticeData);
    
    const formData = new FormData();
    
    // notice 데이터를 JSON 문자열로 변환하여 Blob으로 추가
    const noticeJson = JSON.stringify({
      title: noticeData.title,
      content: noticeData.content
    });
    
    formData.append('notice', new Blob([noticeJson], { type: 'application/json' }));
    
    // 파일 처리
    if (noticeData.file) {
      // 이미지 파일인지 확인 - MIME 타입으로 판단
      if (noticeData.file.type.startsWith('image/')) {
        formData.append('image', noticeData.file);
        console.log("이미지 파일 업로드:", noticeData.file.name, noticeData.file.type);
      } else {
        formData.append('attachment', noticeData.file);
        console.log("일반 첨부파일 업로드:", noticeData.file.name, noticeData.file.type);
      }
    }
    
    const response = await api.post("/notice", formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    console.log("공지사항 등록 성공:", response);
    return response;
  } catch (error) {
    console.error("공지사항 등록 실패:", error);
    throw error;
  }
};

// 공지사항 수정 - FormData 처리 개선
export const updateNotice = async (id, noticeData) => {
  try {
    console.log("공지사항 수정 시작", id, noticeData);
    
    const formData = new FormData();
    
    // notice 데이터를 JSON 문자열로 변환하여 Blob으로 추가
    const noticeJson = JSON.stringify({
      title: noticeData.title,
      content: noticeData.content,
      removeAttachment: noticeData.removeAttachment || false,
      removeImage: noticeData.removeImage || false
    });
    
    formData.append('notice', new Blob([noticeJson], { type: 'application/json' }));
    
    // 파일 처리
    if (noticeData.file) {
      // 이미지 파일인지 확인 - MIME 타입으로 판단
      if (noticeData.file.type.startsWith('image/')) {
        formData.append('image', noticeData.file);
        console.log("이미지 파일 업로드:", noticeData.file.name, noticeData.file.type);
      } else {
        formData.append('attachment', noticeData.file);
        console.log("일반 첨부파일 업로드:", noticeData.file.name, noticeData.file.type);
      }
    }
    
    const response = await api.put(`/notice/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    console.log("공지사항 수정 성공:", response);
    return response;
  } catch (error) {
    console.error("공지사항 수정 실패:", error);
    throw error;
  }
};

export const deleteNotice = async (id) => {
  return api.delete(`/notice/${id}`);
};

// 파일 다운로드 헬퍼 함수
export const getFileDownloadUrl = (noticeId, fileName) => {
  return `${API_BASE_URL}/notice/attachment/${noticeId}/${encodeURIComponent(fileName)}`;
};

export const getImageUrl = (imagePath) => {
  return `${API_BASE_URL}/notice/image/${imagePath}`;
};

// 제품 관련 API
export const getProducts = async () => {
  return api.get("/products");
};

export default api;