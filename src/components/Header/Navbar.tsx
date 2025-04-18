import { useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@apollo/client";

import { GET_CATEGORIES } from "@graphql/queries";
import { useAppContext } from "@hooks/useAppContext";
import { Category } from "@interfaces/interfaces";

import DropDownCart from "./DropDownCart";

import Logo from "@components/SVGs/Logo";
import Cart from "@components/SVGs/Cart";

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

  const cartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (data?.categories && categories.length === 0) {
      setCategories(data.categories);
      setSelectedCategory(data.categories[0]?.id || 1);
    }
  }, [data, categories.length, setCategories, setSelectedCategory]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        cartOpen &&
        cartRef.current &&
        !cartRef.current.contains(event.target as Node) &&
        !(event.target as HTMLElement).closest(".cart-icon")
      ) {
        toggleCart();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [cartOpen, toggleCart]);

  if (loading) return <p></p>;
  if (error) return <p>Error loading categories</p>;

  return (
    <nav className="navbar">
      <div className="navigation">
        {categories.map((cat) => (
          <a
            key={cat.id}
            href={`/${cat.name.toLowerCase()}`}
            data-testid={
              selectedCategory === cat.id
                ? "active-category-link"
                : "category-link"
            }
            onClick={(e) => {
              e.preventDefault();
              setSelectedCategory(cat.id);
              navigate(`/${cat.name.toLowerCase()}`);
            }}
            className={selectedCategory === cat.id ? "active" : ""}
          >
            {cat.name}
          </a>
        ))}
      </div>
      <Link to="/" className="logo-container">
        <Logo />
      </Link>
      <button
        data-testid="cart-btn"
        className="cart-icon"
        onClick={(event) => {
          event.stopPropagation();
          toggleCart();
        }}
      >
        <Cart />
        {cart.length > 0 && <span className="cart-count">{cart.length}</span>}
      </button>

      {cartOpen && <DropDownCart ref={cartRef} />}
    </nav>
  );
}
