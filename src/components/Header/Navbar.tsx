import { Link } from "react-router-dom";
import { useState } from "react";
import Logo from "@components/Header/Logo";
import { Product } from "@interfaces/interfaces";

import "@styles/Navbar.scss";

interface NavbarProps {
  selectedCategory: number;
  setSelectedCategory: (id: number) => void;
  cart: {
    product: Product;
    selectedAttributes: { [key: string]: string };
    quantity: number;
  }[];
  updateCart: (index: number, newAttributes: { [key: string]: string }) => void;
  updateQuantity: (index: number, change: number) => void;
}

const categories = [
  { id: 1, name: "All" },
  { id: 2, name: "Clothes" },
  { id: 3, name: "Tech" },
];

export default function Navbar({
  selectedCategory,
  setSelectedCategory,
  cart,
  updateCart,
  updateQuantity,
}: NavbarProps) {
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="navigation">
        {categories.map((cat) => (
          <button
            key={cat.id}
            className={selectedCategory === cat.id ? "active" : ""}
            onClick={() => setSelectedCategory(cat.id)}
          >
            {cat.name}
          </button>
        ))}
      </div>
      <div className="logo-container">
        <Link to="/" className="logo">
          <Logo />
        </Link>
      </div>
      <div className="cart-container">
        <button className="cart-icon" onClick={() => setCartOpen(!cartOpen)}>
          🛒 <span className="cart-count">{cart.length}</span>
        </button>
        {cartOpen && (
          <div className="cart-dropdown">
            <h3>
              <span id="cart-title">My Bag ,</span>
              <span id="cart-count">{cart.length} items</span>
            </h3>
            {cart.length === 0 ? (
              <p className="empty-cart">Cart is empty</p>
            ) : (
              cart.map((item, index) => (
                <div key={index} className="cart-item">
                  <div className=".attributes" id="attributes">
                    <h3>{item.product.name}</h3>
                    <p>
                      {item.product.prices[0].currency.symbol}
                      {item.product.prices[0].amount.toFixed(2)}
                    </p>

                    {/* ✅ Allow users to update selected attributes */}
                    {item.product.attributes.map((attr) => (
                      <div key={attr.name} className="attribute-group">
                        <p className="attribute-label">
                          {attr.name}:
                        </p>
                        <div className="attribute-options">
                          {attr.items.map((option) => (
                            <button
                              key={option.id}
                              className={`attribute-option ${
                                item.selectedAttributes[attr.name] ===
                                option.value
                                  ? "selected"
                                  : ""
                              }`}
                              style={
                                attr.type === "swatch"
                                  ? { backgroundColor: option.value }
                                  : {}
                              }
                              onClick={() => {
                                const newAttributes = {
                                  ...item.selectedAttributes,
                                  [attr.name]: option.value,
                                };
                                updateCart(index, newAttributes);
                              }}
                            >
                              {attr.type === "swatch"
                                ? ""
                                : option.displayValue}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* ✅ Quantity Controls */}
                  <div className="cart-item-quantity">
                    <button onClick={() => updateQuantity(index, 1)}>+</button>
                    {item.quantity}
                    <button onClick={() => updateQuantity(index, -1)}>-</button>
                  </div>

                  <div>
                    <img
                      src={item.product.gallery[0]}
                      alt={item.product.name}
                    />
                  </div>
                </div>
              ))
            )}

            {/* ✅ Display Total Price */}
            <div className="total">
              <span>Total </span>
              <span id="amount" className="amount">
                $
                {cart
                  .reduce(
                    (total, item) =>
                      total + item.product.prices[0].amount * item.quantity,
                    0
                  )
                  .toFixed(2)}
              </span>
            </div>
            <button className="place-order">Place Order</button>
          </div>
        )}
      </div>
    </nav>
  );
}
