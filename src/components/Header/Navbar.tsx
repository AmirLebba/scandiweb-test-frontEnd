import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@apollo/client";

import { GET_CATEGORIES } from "@graphql/queries";
import { useAppContext } from "@hooks/useAppContext";
import { Category } from "@interfaces/interfaces";

import DropDownCart from "./DropDownCart";

import Logo from "@SVGs/Logo";
import Cart from "@SVGs/Cart";

import "@styles/Navbar.scss";

export default function Navbar() {
  const {
    cart,
    cartOpen,
    toggleCart,
    selectedCategory,
    setSelectedCategory,
    setCategories,
    categories,
  } = useAppContext();
  const navigate = useNavigate();

  const { loading, error, data } = useQuery<{ categories: Category[] }>(
    GET_CATEGORIES
  );

  useEffect(() => {
    if (data?.categories && categories.length === 0) {
      setCategories(data.categories);
      setSelectedCategory(data.categories[0]?.id || 1);
    }
  }, [data, categories.length, setCategories, setSelectedCategory]);

  if (loading) return <p></p>;
  if (error) return <p>Error loading categories</p>;

  return (
    <nav className="navbar">
      <div className="navigation">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => {
              setSelectedCategory(cat.id);
              navigate("/");
            }}
            className={selectedCategory === cat.id ? "active" : ""}
          >
            {cat.name}
          </button>
        ))}
      </div>
      <Link to="/" className="logo-container">
        <Logo />
      </Link>
      <button data-testid="cart-btn" className="cart-icon" onClick={toggleCart}>
        <Cart />
        {cart.length > 0 && <span className="cart-count">{cart.length}</span>}
      </button>

      {cartOpen && <DropDownCart />}
    </nav>
  );
}
