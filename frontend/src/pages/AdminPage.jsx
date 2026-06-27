import { useEffect, useState } from "react";
import { api } from "../api/client";

const initialProduct = {
  name: "",
  description: "",
  category: "",
  price: "",
  stock: "",
  imageUrl: ""
};

export function AdminPage() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState(initialProduct);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function loadDashboard() {
    try {
      const [productsResponse, ordersResponse] = await Promise.all([
        api.get("/products"),
        api.get("/orders")
      ]);

      setProducts(productsResponse.data.products);
      setOrders(ordersResponse.data.orders);
    } catch (requestError) {
      setError("Nao foi possivel carregar o painel");
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  function handleChange(event) {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  }

  async function createProduct(event) {
    event.preventDefault();
    setMessage("");
    setError("");

    try {
      await api.post("/products", {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock)
      });
      setForm(initialProduct);
      setMessage("Produto criado com sucesso");
      loadDashboard();
    } catch (requestError) {
      const validationErrors = requestError.response?.data?.errors;
      if (Array.isArray(validationErrors) && validationErrors.length > 0) {
        setError(validationErrors[0].msg);
      } else {
        setError(requestError.response?.data?.error || "Falha ao criar produto");
      }
    }
  }

  async function deleteProduct(id) {
    setMessage("");
    setError("");

    try {
      await api.delete(`/products/${id}`);
      setMessage("Produto removido");
      loadDashboard();
    } catch (requestError) {
      setError(requestError.response?.data?.error || "Falha ao remover produto");
    }
  }

  async function updateOrderStatus(id, status) {
    setMessage("");
    setError("");

    try {
      await api.patch(`/orders/${id}/status`, { status });
      setMessage("Status do pedido atualizado");
      loadDashboard();
    } catch (requestError) {
      setError(requestError.response?.data?.error || "Falha ao atualizar pedido");
    }
  }

  return (
    <section>
      <h1>Painel Administrativo</h1>

      <form className="panel admin-form" onSubmit={createProduct}>
        <h2>Novo produto</h2>
        <input name="name" placeholder="Nome" value={form.name} onChange={handleChange} required />
        <input
          name="description"
          placeholder="Descricao"
          value={form.description}
          onChange={handleChange}
          required
        />
        <input
          name="category"
          placeholder="Categoria"
          value={form.category}
          onChange={handleChange}
          required
        />
        <input name="price" type="number" step="0.01" placeholder="Preco" value={form.price} onChange={handleChange} required />
        <input name="stock" type="number" placeholder="Estoque" value={form.stock} onChange={handleChange} required />
        <input
          name="imageUrl"
          placeholder="URL da imagem"
          value={form.imageUrl}
          onChange={handleChange}
        />
        <button type="submit">Criar produto</button>
      </form>

      <section className="panel admin-list">
        <h2>Produtos</h2>
        {products.map((product) => (
          <article key={product.id} className="admin-row">
            <span>
              {product.name} | R$ {product.price.toFixed(2)} | Estoque: {product.stock}
            </span>
            <button type="button" onClick={() => deleteProduct(product.id)}>
              Excluir
            </button>
          </article>
        ))}
      </section>

      <section className="panel admin-list">
        <h2>Pedidos</h2>
        {orders.map((order) => (
          <article key={order.id} className="admin-row">
            <span>
              Pedido #{order.id} | Usuario: {order.userId} | Total: R$ {order.total.toFixed(2)} | Status: {order.status}
            </span>
            <select
              value={order.status}
              onChange={(event) => updateOrderStatus(order.id, event.target.value)}
            >
              <option value="pending">pending</option>
              <option value="paid">paid</option>
              <option value="shipped">shipped</option>
              <option value="cancelled">cancelled</option>
            </select>
          </article>
        ))}
      </section>

      {message && <p className="success">{message}</p>}
      {error && <p className="error">{error}</p>}
    </section>
  );
}
