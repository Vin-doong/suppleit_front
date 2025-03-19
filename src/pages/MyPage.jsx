import React from 'react';
import { Link } from 'react-router-dom'; // Link 컴포넌트 import

const MyPage = () => {
  return (
    <div className="bg-gray-50 font-['Noto_Sans_KR']">
      {/* 네비게이션 바 */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                {/* 로고 클릭 시 홈 화면으로 이동 */}
                <Link to="/">
                  <img className="h-8 w-auto" src="https://ai-public.creatie.ai/gen_page/logo_placeholder.png" alt="로고" />
                </Link>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <a href="#" className="border-teal-600 text-teal-600 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">대시보드</a>
                <a href="#" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">영양제 검색</a>
                <a href="#" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">건강정보</a>
              </div>
            </div>
            <div className="flex items-center">
              <button type="button" className="p-2 rounded-full text-gray-400 hover:text-gray-500 relative">
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center text-xs text-white">3</span>
                <i className="fas fa-bell text-xl"></i>
              </button>
              <div className="ml-4 flex items-center">
                <img className="h-8 w-8 rounded-full" src="https://creatie.ai/ai/api/search-image?query=A professional headshot of a young Asian person with a friendly smile, wearing casual business attire, against a clean white background&width=200&height=200&orientation=squarish&flag=ca1e71d7-9a7e-46d2-befd-1dc7d7c5b691" alt="프로필" />
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* 사이드바 */}
      <div className="flex h-[calc(100vh-4rem)]">
        <aside className="w-64 bg-white shadow-sm">
          <div className="p-4">
            <div className="flex items-center space-x-3 mb-6">
              <img className="h-12 w-12 rounded-full" src="https://creatie.ai/ai/api/search-image?query=A professional headshot of a young Asian person with a friendly smile, wearing casual business attire, against a clean white background&width=200&height=200&orientation=squarish&flag=9301ff17-3afc-4d2b-99f9-333ec988ddbc" alt="프로필" />
              <div>
                <h3 className="font-medium">김영양</h3>
                <p className="text-sm text-gray-500">건강관리 중</p>
              </div>
            </div>
            <nav className="space-y-1">
              <a href="#" className="bg-teal-600 text-white group flex items-center px-3 py-2 text-sm font-medium rounded-md">
                <i className="fas fa-home w-6"></i> 대시보드
              </a>
              <a href="#" className="text-gray-600 hover:bg-gray-50 group flex items-center px-3 py-2 text-sm font-medium rounded-md">
                <i className="fas fa-calendar w-6"></i> 복용 일정
              </a>
              <a href="#" className="text-gray-600 hover:bg-gray-50 group flex items-center px-3 py-2 text-sm font-medium rounded-md">
                <i className="fas fa-pills w-6"></i> 내 영양제
              </a>
              <a href="#" className="text-gray-600 hover:bg-gray-50 group flex items-center px-3 py-2 text-sm font-medium rounded-md">
                <i className="fas fa-chart-line w-6"></i> 건강 분석
              </a>
              <a href="#" className="text-gray-600 hover:bg-gray-50 group flex items-center px-3 py-2 text-sm font-medium rounded-md">
                <i className="fas fa-cog w-6"></i> 설정
              </a>
              <div className="mt-6 p-3 bg-gray-50 rounded-md">
                <h4 className="text-sm font-medium text-gray-600 mb-2">미니 달력</h4>
                <div className="grid grid-cols-7 gap-1 text-center text-xs">
                  <div className="text-gray-500">일</div>
                  <div className="text-gray-500">월</div>
                  <div className="text-gray-500">화</div>
                  <div className="text-gray-500">수</div>
                  <div className="text-gray-500">목</div>
                  <div className="text-gray-500">금</div>
                  <div className="text-gray-500">토</div>
                  <div className="text-gray-300">30</div>
                  <div className="text-gray-300">31</div>
                  <div>1</div>
                  <div>2</div>
                  <div>3</div>
                  <div>4</div>
                  <div>5</div>
                  <div>6</div>
                  <div>7</div>
                  <div>8</div>
                  <div>9</div>
                  <div className="bg-green-100 text-green-800 rounded-full">10</div>
                  <div className="bg-red-100 text-red-800 rounded-full">11</div>
                  <div className="bg-green-100 text-green-800 rounded-full">12</div>
                  <div className="bg-gray-100 text-gray-400 rounded-full">13</div>
                  <div className="bg-gray-100 text-gray-400 rounded-full">14</div>
                  <div>15</div>
                  <div>16</div>
                  <div>17</div>
                  <div>18</div>
                  <div>19</div>
                  <div>20</div>
                  <div>21</div>
                  <div>22</div>
                  <div>23</div>
                  <div>24</div>
                  <div>25</div>
                  <div>26</div>
                  <div>27</div>
                  <div>28</div>
                  <div>29</div>
                  <div>30</div>
                </div>
              </div>
            </nav>
          </div>
        </aside>

        {/* 메인 콘텐츠 */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="sm:flex sm:items-center sm:justify-between">
                    <div>
                      <h3 className="text-lg font-medium leading-6 text-gray-900">영양제 섭취 설명</h3>
                      <div className="mt-2 text-sm text-gray-500">
                        <p>각 영양제는 식사 시간과 연계하여 섭취해주세요.</p>
                        <p>복용 시간을 지켜 규칙적으로 섭취하는 것이 중요합니다.</p>
                      </div>
                    </div>
                    <div className="mt-4 sm:mt-0">
                      <a href="#" className="inline-flex items-center text-sm font-medium text-teal-600 hover:text-teal-700">
                        자세히 보기<i className="fas fa-arrow-right ml-2"></i>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <h1 className="text-2xl font-semibold text-gray-900">오늘의 영양제</h1>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <i className="fas fa-sun text-yellow-400 text-2xl"></i>
                    </div>
                    <div className="ml-3">
                      <h4 className="text-lg font-medium">아침</h4>
                      <p className="text-sm text-gray-500">비타민 C, 오메가-3</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <i className="fas fa-moon text-blue-500 text-2xl"></i>
                    </div>
                    <div className="ml-3">
                      <h4 className="text-lg font-medium">저녁</h4>
                      <p className="text-sm text-gray-500">마그네슘, 칼슘</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MyPage;
