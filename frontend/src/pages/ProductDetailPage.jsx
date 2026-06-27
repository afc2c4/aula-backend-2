import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api/client";
import { useCart } from "../context/CartContext";

export function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");
  const { addToCart } = useCart();

  useEffect(() => {
    async function loadProduct() {
      try {
        const { data } = await api.get(`/products/${id}`);
        setProduct(data.product);
      } catch (requestError) {
        setError("Produto nao encontrado");
      }
    }

    loadProduct();
  }, [id]);

  if (error) {
    return <p className="error">{error}</p>;
  }

  if (!product) {
    return <p>Carregando...</p>;
  }

  return (
    <section className="panel product-detail">
      <img src={product.imageUrl || "https://placehold.co/600x340"} alt={product.name} />
      <div>
        <h1>{product.name}</h1>
        <p>{product.description}</p>
        <p>Categoria: {product.category}</p>
        <p>Estoque: {product.stock}</p>
        <strong>R$ {product.price.toFixed(2)}</strong>
        <button type="button" onClick={() => addToCart(product)}>
          Adicionar ao carrinho
        </button>
      </div>
    </section>
  );
}
