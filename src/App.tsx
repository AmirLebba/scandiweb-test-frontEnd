import { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useQuery } from "@apollo/client";

import Navbar from "@components/Header/Navbar";
import { ProductGridItem } from "@components/Body/ProductGridItem";
import ProductPage from "@components/Body/ProductPage";
import { GET_PRODUCTS } from "@graphql/queries";
import { Product } from "@interfaces/interfaces";

import "@styles/App.scss";

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState<number>(0);
  const [cart, setCart] = useState<
    {
      product: Product;
      selectedAttributes: { [key: string]: string };
      quantity: number;
    }[]
  >([]);

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
        // If item exists, increase quantity
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex].quantity += 1;
        return updatedCart;
      }

      // Otherwise, add new item
      return [...prevCart, { product, selectedAttributes, quantity: 1 }];
    });
  };

  // ✅ Update Cart Attributes
  const updateCart = (
    index: number,
    newAttributes: { [key: string]: string }
  ) => {
    setCart((prevCart) => {
      const updatedCart = [...prevCart];
      updatedCart[index] = {
        ...updatedCart[index],
        selectedAttributes: newAttributes,
      };
      return updatedCart;
    });
  };

  // ✅ Update Quantity
  const updateQuantity = (index: number, change: number) => {
    setCart((prevCart) => {
      const updatedCart = [...prevCart];
      updatedCart[index].quantity = Math.max(
        1,
        updatedCart[index].quantity + change
      ); // Ensure min quantity = 1
      return updatedCart;
    });
  };

  // Fetch Products
  const { loading, error, data } = useQuery(GET_PRODUCTS, {
    variables: selectedCategory === 0 ? {} : { categoryId: selectedCategory },
  });

  return (
    <Router>
      <div className="app">
        <Navbar
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          cart={cart}
          updateCart={updateCart}
          updateQuantity={updateQuantity} // ✅ Pass updateQuantity function
        />

        <Routes>
          {/* Home Page - Product Grid */}
          <Route
            path="/"
            element={
              <div className="products-grid">
                {loading && <p>Loading products...</p>}
                {error && <p>Error loading products</p>}
                {data?.products?.map((product: Product) => (
                  <ProductGridItem key={product.id} product={product} />
                ))}
              </div>
            }
          />

          {/* Product Details Page */}
          <Route
            path="/product/:id"
            element={<ProductPage onAddToCart={handleAddToCart} />}
          />
        </Routes>
      </div>
    </Router>
  );
}
