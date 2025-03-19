import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const response = await api.get(`/products/${id}`);
        setProduct(response.data);
      } catch (error) {
        console.error("제품 정보를 불러오는 중 오류 발생:", error);
      }
    }
    fetchProduct();
  }, [id]);

  if (!product) return <p>로딩 중...</p>;

  return (
    <div>
      <h2>{product.name}</h2>
      <p>{product.description}</p>
      <p>가격: {product.price}원</p>
    </div>
  );
}

export default ProductDetail;
