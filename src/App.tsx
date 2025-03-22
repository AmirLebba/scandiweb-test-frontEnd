import { useState, useMemo } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useQuery } from "@apollo/client";

import Navbar from "@components/Header/Navbar";
import { ProductGridItem } from "@components/Body/ProductGridItem";
import ProductPage from "@components/Body/ProductPage";
import { GET_CATEGORIES } from "@graphql/queries";
import { Category, Product } from "@interfaces/interfaces";

import "@styles/App.scss";

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState<number>(1);
  const [cart, setCart] = useState<
    {
      product: Product;
      selectedAttributes: { [key: string]: string };
      quantity: number;
    }[]
  >([]);
  const [cartOpen, setCartOpen] = useState(false);

  // Fetch Categories (Only Once)
  const {
    loading: categoriesLoading,
    error: categoriesError,
    data: categoriesData,
  } = useQuery(GET_CATEGORIES);

  // Memoize categories to prevent unnecessary re-renders
  const categories: Category[] = useMemo(
    () => categoriesData?.categories || [],
    [categoriesData]
  );

  // Memoize active category name
  const activeCategoryName = useMemo(
    () => categories.find((cat) => cat.id === selectedCategory)?.name || "All",
    [categories, selectedCategory]
  );

  // Handle Add to Cart
  const handleAddToCart = (
    product: Product,
    selectedAttributes: { [key: string]: string }
  ) => {
    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex(
        (item) =>
          item.product.id === product.id &&
          JSON.stringify(item.selectedAttributes) ===
            JSON.stringify(selectedAttributes)
      );

      if (existingItemIndex !== -1) {
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex].quantity += 1;
        return updatedCart;
      }

      return [...prevCart, { product, selectedAttributes, quantity: 1 }];
    });
  };

  // Update Quantity
  const updateQuantity = (index: number, change: number) => {
    setCart((prevCart) => {
      const updatedCart = [...prevCart];

      //  Decrease quantity
      updatedCart[index].quantity += change;

      //  Remove item if quantity is 0
      if (updatedCart[index].quantity <= 0) {
        updatedCart.splice(index, 1); // Remove the item from cart
      }

      return updatedCart;
    });
  };

  // Handle Loading & Errors for Categories
  if (categoriesLoading)
    return (
      <p className="loading">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="48"
          height="48"
          viewBox="0 0 24 24"
        >
          <g
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          >
            <path
              strokeDasharray="16"
              strokeDashoffset="16"
              d="M12 3c4.97 0 9 4.03 9 9"
            >
              <animate
                fill="freeze"
                attributeName="stroke-dashoffset"
                dur="0.3s"
                values="16;0"
              />
              <animateTransform
                attributeName="transform"
                dur="1.5s"
                repeatCount="indefinite"
                type="rotate"
                values="0 12 12;360 12 12"
              />
            </path>
            <path
              strokeDasharray="64"
              strokeDashoffset="64"
              strokeOpacity="0.3"
              d="M12 3c4.97 0 9 4.03 9 9c0 4.97 -4.03 9 -9 9c-4.97 0 -9 -4.03 -9 -9c0 -4.97 4.03 -9 9 -9Z"
            >
              <animate
                fill="freeze"
                attributeName="stroke-dashoffset"
                dur="1.2s"
                values="64;0"
              />
            </path>
          </g>
        </svg>
      </p>
    );
  if (categoriesError)
    return (
      <p>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="48"
          height="48"
          viewBox="0 0 24 24"
        >
          <g
            fill="currentColor"
            fillOpacity="0"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          >
            <path
              strokeDasharray="64"
              strokeDashoffset="64"
              d="M12 3l9 17h-18l9 -17Z"
            >
              <animate
                fill="freeze"
                attributeName="stroke-dashoffset"
                dur="0.6s"
                values="64;0"
              />
            </path>
            <path strokeDasharray="6" strokeDashoffset="6" d="M12 10v4">
              <animate
                fill="freeze"
                attributeName="stroke-dashoffset"
                begin="0.6s"
                dur="0.2s"
                values="6;0"
              />
              <animate
                attributeName="stroke-width"
                begin="1.95s"
                dur="3s"
                keyTimes="0;0.1;0.2;0.3;1"
                repeatCount="indefinite"
                values="2;3;3;2;2"
              />
            </path>
            <path strokeDasharray="2" strokeDashoffset="2" d="M12 17v0.01">
              <animate
                fill="freeze"
                attributeName="stroke-dashoffset"
                begin="0.8s"
                dur="0.2s"
                values="2;0"
              />
              <animate
                attributeName="stroke-width"
                begin="2.25s"
                dur="3s"
                keyTimes="0;0.1;0.2;0.3;1"
                repeatCount="indefinite"
                values="2;3;3;2;2"
              />
            </path>
            <animate
              fill="freeze"
              attributeName="fill-opacity"
              begin="1.1s"
              dur="0.15s"
              values="0;0.3"
            />
          </g>
        </svg>
        {categoriesError.message}
      </p>
    );

  return (
    <Router>
      <div className="app">
        <header onClick={() => setCartOpen(false)}>
          <Navbar
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            cart={cart}
            setCart={setCart}
            updateQuantity={updateQuantity}
            setCartOpen={setCartOpen}
            cartOpen={cartOpen}
            categories={categories}
          />
        </header>
        <main>
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <h1>{activeCategoryName}</h1>
                  <div className="products-grid">
                    <ProductGridItem
                      selectedCategory={selectedCategory}
                      isInCart={(productId: string) =>
                        cart.some((item) => item.product.id === productId)
                      }
                      onAddToCart={handleAddToCart}
                      setCartOpen={setCartOpen}
                    />
                  </div>
                </>
              }
            />
            <Route
              path="/product/:id"
              element={
                <ProductPage
                  onAddToCart={handleAddToCart}
                  setCartOpen={setCartOpen}
                  
                />
              }
            />
          </Routes>
        </main>
        {cartOpen && (
          <div className="overlay" onClick={() => setCartOpen(false)}></div>
        )}
      </div>
    </Router>
  );
}
