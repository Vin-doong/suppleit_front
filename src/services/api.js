import axios from 'axios';

const API_BASE_URL = "http://localhost:8080/api"; // 백엔드 주소

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 로그인 요청
export const login = async (email, password) => {
  return api.post("/auth/login", { email, password });
};

// 회원가입 요청
export const signup = async (userData) => {
  return api.post("/auth/signup", userData);
};

// 제품 리스트 가져오기
export const getProducts = async () => {
  return api.get("/products");
};

export default api;
