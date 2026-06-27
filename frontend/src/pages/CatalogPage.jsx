import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client";
import { useCart } from "../context/CartContext";

export function CatalogPage() {
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({ category: "", sort: "", q: "" });
  const [error, setError] = useState("");
  const { addToCart } = useCart();

  async function loadProducts(query = filters) {
    try {
      setError("");
      const { data } = await api.get("/products", { params: query });
      setProducts(data.products);
    } catch (requestError) {
      setError("Falha ao carregar produtos");
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  function handleFilterChange(event) {
    setFilters((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  }

  function applyFilters(event) {
    event.preventDefault();
    loadProducts(filters);
  }

  return (
    <section>
      <h1>Catalogo de Produtos</h1>

      <form className="panel filters" onSubmit={applyFilters}>
        <input
          name="q"
          placeholder="Buscar por nome"
          value={filters.q}
          onChange={handleFilterChange}
        />
        <input
          name="category"
          placeholder="Categoria"
          value={filters.category}
          onChange={handleFilterChange}
        />
        <select name="sort" value={filters.sort} onChange={handleFilterChange}>
          <option value="">Sem ordenacao</option>
          <option value="price_asc">Preco crescente</option>
          <option value="price_desc">Preco decrescente</option>
        </select>
        <button type="submit">Aplicar</button>
      </form>

      {error && <p className="error">{error}</p>}

      <div className="products-grid">
        {products.map((product) => (
          <article className="product-card" key={product.id}>
            <img
              src={product.imageUrl || "https://placehold.co/300x180"}
              alt={product.name}
            />
            <h2>{product.name}</h2>
            <p>{product.description}</p>
            <strong>R$ {product.price.toFixed(2)}</strong>
            <p>Estoque: {product.stock}</p>
            <div className="card-actions">
              <Link to={`/products/${product.id}`}>Detalhes</Link>
              <button type="button" onClick={() => addToCart(product)}>
                Adicionar
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
