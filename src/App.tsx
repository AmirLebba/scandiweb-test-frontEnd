import { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useQuery } from "@apollo/client";

import Navbar from "@components/Header/Navbar";
import { ProductGridItem } from "@components/Body/ProductGridItem";
import ProductPage from "@components/Body/ProductPage";
import { GET_PRODUCTS } from "@graphql/queries";
import { Product } from "@interfaces/interfaces";

import "@styles/App.scss";


const categories = [
  { id: 1, name: "All" },
  { id: 2, name: "Clothes" },
  { id: 3, name: "Tech" },
];

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState<number>(1); // ✅ First category active by default
  const [cart, setCart] = useState<
    {
      product: Product;
      selectedAttributes: { [key: string]: string };
      quantity: number;
    }[]
  >([]);
  const [cartOpen, setCartOpen] = useState(false);

  // ✅ Handle Add to Cart
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

  // ✅ Update Cart Attributes

  // ✅ Update Quantity
  const updateQuantity = (index: number, change: number) => {
    setCart((prevCart) => {
      const updatedCart = [...prevCart];
      updatedCart[index].quantity = Math.max(
        1,
        updatedCart[index].quantity + change
      );
      return updatedCart;
    });
  };

  // Fetch Products
  const { loading, error, data } = useQuery(GET_PRODUCTS, {
    variables: selectedCategory === 1 ? {} : { categoryId: selectedCategory },
  });

  return (
    <Router>
      <div className="app">
        {/* ✅ Clicking anywhere on header closes cart */}
        <header onClick={() => setCartOpen(false)}>
          <Navbar
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            cart={cart}
            updateQuantity={updateQuantity}
            setCartOpen={setCartOpen}
            cartOpen={cartOpen}
          />
        </header>

        <h1>
          {categories.find((cat) => cat.id === selectedCategory)?.name || "All"}
        </h1>

        {/* ✅ Routes */}
        <Routes>
          <Route
            path="/"
            element={
              <div className="products-grid">
                {loading && <p>Loading products...</p>}
                {error && <p>Error loading products</p>}
                {data?.products?.map((product: Product) => (
                  <ProductGridItem
                    key={product.id}
                    product={product}
                    isInCart={cart.some(
                      (item) => item.product.id === product.id
                    )}
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </div>
            }
          />
          <Route
            path="/product/:id"
            element={<ProductPage onAddToCart={handleAddToCart} />}
          />
        </Routes>

        {/* ✅ Overlay that grays out background */}
        {cartOpen && (
          <div className="overlay" onClick={() => setCartOpen(false)}></div>
        )}
      </div>
    </Router>
  );
}
