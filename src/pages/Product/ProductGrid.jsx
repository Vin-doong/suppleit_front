import React from 'react';

const ProductGrid = () => {
  const products = [
    { icon: 'capsules', title: '비타민 D', description: '면역력 강화와 뼈 건강에 도움' },
    { icon: 'heart', title: '오메가 3', description: '심장 건강과 혈행 개선' },
    { icon: 'brain', title: '루테인', description: '눈 건강과 시력 보호' },
    { icon: 'bone', title: '칼슘 마그네슘', description: '뼈와 관절 건강 관리' },
    { icon: 'bed', title: '수면 영양제', description: '숙면과 스트레스 관리' },
    { icon: 'shield-virus', title: '프로바이오틱스', description: '장 건강과 면역력 증진' },
    { icon: 'running', title: '관절 건강', description: '활동성 증진과 관절 보호' },
    { icon: 'apple-alt', title: '다이어트', description: '체중 관리와 대사 촉진' },
    { icon: 'sun', title: '항산화', description: '노화 방지와 피부 건강' },
  ];

  return (
    <div className="grid grid-cols-3 gap-8 mb-12 mx-auto max-w-8xl">
      {products.map((product, index) => (
        <div
          key={index}
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
        >
          <i className={`fas fa-${product.icon} text-3xl text-teal-500 mb-4`}></i>
          <h3 className="text-lg font-medium mb-2 text-gray-800">{product.title}</h3>
          <p className="text-gray-600">{product.description}</p>
        </div>
      ))}
    </div>
  );
};

export default ProductGrid;
