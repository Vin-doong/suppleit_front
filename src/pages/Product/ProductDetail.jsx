import React, { useState } from "react";
import "./ProductDetail.css";
import Header from "../../components/include/Header";
import Footer from "../../components/include/Footer";

const ProductDetail = () => {
  const [showDetail, setShowDetail] = useState(false);

  return (
    <div className="font-NotoSans bg-gray-50">
     <Header/>
      {/* 메인 컨텐츠 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col min-h-screen">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-custom mb-6">프리미엄 종합 비타민</h1>
          <p className="text-lg text-gray-900 max-w-3xl mx-auto mb-8">
            균형 잡힌 영양 섭취를 위한 고품질 종합 비타민입니다.
          </p>
          <button
            className="btn-showmore"
            onClick={() => setShowDetail(!showDetail)}
          >
            더보기 <i className={`fas ${showDetail ? "fa-chevron-up" : "fa-chevron-down"} ml-2`}></i>
          </button>
        </div>

        {/* 상세 설명 */}
        <div
          className="detail-content"
          style={{
            maxHeight: showDetail ? "1000px" : "0px", // 기본적으로 0px로 설정하여 숨김
            opacity: showDetail ? "1" : "0", // showDetail이 true일 때만 보이도록
            overflow: "hidden", // 내용이 넘칠 경우 숨김
            transition: "max-height 0.3s ease-out, opacity 0.3s ease-out", // 애니메이션 효과
            backgroundColor: showDetail ? "white" : "transparent", // 버튼 클릭 전에는 배경이 투명하게
          }}
        >
          <h2 className="text-2xl font-bold mb-4 text-gray-900">상세 설명</h2>
          <p className="mb-4 text-gray-900">
            현대인의 불규칙한 식습관으로 인한 영양 불균형을 해소하기 위해 carefully selected된 비타민과 미네랄을 배합하였습니다.
          </p>
          <h3 className="text-xl font-bold mb-3 text-gray-900">주요 영양성분</h3>
          <ul className="list-disc pl-5 mb-4 text-gray-900">
            <li>비타민 A, C, D, E: 항산화 작용 및 면역력 강화</li>
            <li>비타민 B군: 에너지 대사 및 신경계 기능 유지</li>
            <li>아연: 면역 기능 향상</li>
            <li>마그네슘: 근육과 신경 기능 지원</li>
            <li>셀레늄: 항산화 작용</li>
          </ul>
          <h3 className="text-xl font-bold mb-3 text-gray-900">섭취방법</h3>
          <p className="mb-4 text-gray-900">1일 1회, 1정씩 충분한 물과 함께 섭취하세요.</p>
        </div>

        {/* 추천 제품 */}
        <section>
          <h2 className="text-2xl font-bold mb-8 text-center text-gray-900">추천 제품</h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-gray-900">
            {[
              { name: "비타민 B12", desc: "에너지 대사 촉진", price: "45,000원" },
              { name: "아연", desc: "면역력 강화", price: "52,000원" },
              { name: "마그네슘", desc: "근육 이완 효과", price: "38,000원" },
              { name: "셀레늄", desc: "항산화 효과", price: "32,000원" },
              { name: "칼슘", desc: "뼈 건강 관리", price: "48,000원" },
            ].map((item, index) => (
              <div key={index} className="product-card">
                <div className="p-4">
                  <h3 className="font-medium mb-2">{item.name}</h3>
                  <p className="text-sm text-gray-900 mb-2">{item.desc}</p>
                  <p className="font-bold">{item.price}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer/>
    </div>
  );
};

export default ProductDetail;
