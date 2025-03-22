import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useMutation } from "@apollo/client";
import { Product } from "@interfaces/interfaces";
import Logo from "@components/Header/Logo";
import { PLACE_ORDER } from "@graphql/mutations";
import { useAppContext } from "@hooks/useAppContext";
import "@styles/Navbar.scss";

export default function Navbar() {
  const { cart, cartOpen, toggleCart, setSelectedCategory } = useAppContext();
  const [placeOrder, { loading, error }] = useMutation(PLACE_ORDER);
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.toggle("no-scroll", cartOpen);
    return () => document.body.classList.remove("no-scroll");
  }, [cartOpen]);

  const handlePlaceOrder = async () => {
    if (cart.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    try {
      const { data } = await placeOrder({
        variables: {
          items: cart.map((item: { product: Product }) => item.product.id),
        },
      });

      if (data?.placeOrder?.success) {
        alert("Order placed successfully!");
      }
    } catch {
      alert("Error placing order. Please try again.");
    }
  };

  return (
    <nav className="navbar">
      <div className="navigation">
        <button
          onClick={() => {
            setSelectedCategory(1);
            navigate("/");
          }}
        >
          All
        </button>
        <button
          onClick={() => {
            setSelectedCategory(2);
            navigate("/");
          }}
        >
          Clothes
        </button>
        <button
          onClick={() => {
            setSelectedCategory(3);
            navigate("/");
          }}
        >
          Tech
        </button>
      </div>
      <Link to="/" className="logo">
        <Logo />
      </Link>
      <button className="cart-icon" onClick={toggleCart}>
        🛒{" "}
        {cart.length > 0 && <span className="cart-count">{cart.length}</span>}
      </button>

      {cartOpen && (
        <button onClick={handlePlaceOrder} disabled={loading}>
          {loading ? "Placing..." : "Place Order"}
        </button>
      )}

      {error && <p className="error">Error: {error.message}</p>}
    </nav>
  );
}
