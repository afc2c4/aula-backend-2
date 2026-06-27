import { useState } from "react";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export function CartPage() {
  const { user } = useAuth();
  const { items, total, updateQuantity, removeFromCart, clearCart } = useCart();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function checkout() {
    setError("");
    setMessage("");

    if (!user) {
      setError("Faça login para finalizar a compra");
      return;
    }

    try {
      const payload = {
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity
        }))
      };

      const { data } = await api.post("/orders", payload);
      setMessage(`Pedido #${data.order.id} criado com sucesso`);
      clearCart();
    } catch (requestError) {
      setError(requestError.response?.data?.error || "Falha ao finalizar pedido");
    }
  }

  return (
    <section>
      <h1>Carrinho</h1>

      {items.length === 0 ? (
        <p>Seu carrinho esta vazio.</p>
      ) : (
        <div className="panel cart-list">
          {items.map((item) => (
            <article key={item.productId} className="cart-item">
              <div>
                <h3>{item.name}</h3>
                <p>R$ {item.price.toFixed(2)}</p>
              </div>
              <div className="cart-controls">
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(event) =>
                    updateQuantity(item.productId, Number(event.target.value))
                  }
                />
                <button type="button" onClick={() => removeFromCart(item.productId)}>
                  Remover
                </button>
              </div>
            </article>
          ))}

          <div className="checkout-line">
            <strong>Total: R$ {total.toFixed(2)}</strong>
            <button type="button" onClick={checkout}>
              Finalizar compra
            </button>
          </div>
        </div>
      )}

      {message && <p className="success">{message}</p>}
      {error && <p className="error">{error}</p>}
    </section>
  );
}
