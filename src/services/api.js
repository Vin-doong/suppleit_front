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
    if (error.response.status === 401 && !originalRequest._retry) {
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
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// 회원 인증 관련 API
export const login = async (email, password) => {
  try {
    const response = await api.post("/auth/login", { email, password });
    return response.data;
  } catch (error) {
    console.error("로그인 API 오류:", error);
    throw error;
  }
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

// 공지사항 목록 조회
export const getNotices = async () => {
  return api.get("/notice");
};

// 특정 공지사항 조회
export const getNoticeById = async (id) => {
  return api.get(`/notice/${id}`);
};

// 공지사항 생성
export const createNotice = async (noticeData) => {
  const formData = new FormData();
  formData.append('notice', new Blob([JSON.stringify({
    title: noticeData.title,
    content: noticeData.content
  })], { type: 'application/json' }));
  
  if (noticeData.file) {
    formData.append('image', noticeData.file);
  }
  
  return api.post("/notice", formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

// 공지사항 수정
export const updateNotice = async (id, noticeData) => {
  const formData = new FormData();
  formData.append('notice', new Blob([JSON.stringify({
    title: noticeData.title,
    content: noticeData.content
  })], { type: 'application/json' }));
  
  if (noticeData.file) {
    formData.append('image', noticeData.file);
  }
  
  return api.put(`/notice/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

// 공지사항 삭제
export const deleteNotice = async (id) => {
  return api.delete(`/notice/${id}`);
};

// 제품 리스트 가져오기
export const getProducts = async () => {
  return api.get("/products");
};

export default api;
