import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "@components/Header/Navbar";
import { ProductGridItem } from "@components/Body/ProductGridItem";
import ProductPage from "@components/Body/ProductPage";
import { useAppContext } from "@hooks/useAppContext";

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
            <Route path="/" element={<ProductGridItem />} /> 
            <Route path="/product/:id" element={<ProductPage />} />
          </Routes>
        </main>
        {cartOpen && <div className="overlay" />}
      </div>
    </Router>
  );
}
