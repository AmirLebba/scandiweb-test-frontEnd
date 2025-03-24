import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { useAppContext } from "@hooks/useAppContext";

import ProductPage from "@pages/ProductPage";
import Navbar from "@components/Header/Navbar";
import CategoryPage from "@pages/CategoryPage";

import "@styles/App.scss";

export default function App() {
  const { cartOpen } = useAppContext();
  return (
    <Router>
      <div className="app">
        <header>
          <Navbar />
        </header>
        <main>
          <Routes>
            <Route path="/" element={<CategoryPage />} />
            <Route path="/all" element={<CategoryPage />} />
            <Route path="/clothes" element={<CategoryPage />} />
            <Route path="/tech" element={<CategoryPage />} />
            <Route path="/product/:id" element={<ProductPage />} />
          </Routes>
        </main>
        {cartOpen && <div className="overlay" data-testid="cart-overlay" />}
      </div>
    </Router>
  );
}
