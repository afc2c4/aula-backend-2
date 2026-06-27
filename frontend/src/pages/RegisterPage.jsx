import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  function handleChange(event) {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    try {
      await register(form);
      navigate("/login");
    } catch (requestError) {
      const validationErrors = requestError.response?.data?.errors;
      if (Array.isArray(validationErrors) && validationErrors.length > 0) {
        setError(validationErrors[0].msg);
      } else {
        setError(requestError.response?.data?.error || "Falha no cadastro");
      }
    }
  }

  return (
    <section className="panel auth-panel">
      <h1>Cadastro</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Nome"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Senha"
          value={form.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Criar conta</button>
      </form>
      {error && <p className="error">{error}</p>}
    </section>
  );
}
