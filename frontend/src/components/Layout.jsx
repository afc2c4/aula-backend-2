import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export function Layout({ children }) {
  const { user, logout } = useAuth();
  const { items } = useCart();

  return (
    <div className="app-shell">
      <header className="topbar">
        <Link className="brand" to="/">
          Aurora Shop
        </Link>

        <nav className="menu">
          <NavLink to="/">Catalogo</NavLink>
          <NavLink to="/cart">Carrinho ({items.length})</NavLink>
          {user && <NavLink to="/admin">Admin</NavLink>}
        </nav>

        <div className="auth-actions">
          {!user ? (
            <>
              <NavLink to="/login">Login</NavLink>
              <NavLink to="/register">Cadastro</NavLink>
            </>
          ) : (
            <>
              <span className="user-badge">{user.name}</span>
              <button type="button" onClick={logout}>
                Sair
              </button>
            </>
          )}
        </div>
      </header>

      <main className="main-content">{children}</main>
    </div>
  );
}
