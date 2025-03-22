import { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { GET_PRODUCTS } from "@graphql/queries";
import { Product } from "@interfaces/interfaces";
import { useAppContext } from "@hooks/useAppContext";
import "@styles/ProductGridItem.scss";

export const ProductGridItem = ({
  selectedCategory,
}: {
  selectedCategory: number;
}) => {
  const { addToCart } = useAppContext();
  const [hoveredProductId, setHoveredProductId] = useState<string | null>(null);

  const handleAddToCart = useCallback(
    (event: React.MouseEvent, product: Product) => {
      event.preventDefault();
      event.stopPropagation();
      if (product.inStock) {
        const defaultAttributes: { [key: string]: string } = {};
        product.attributes.forEach((attr) => {
          if (attr.items.length > 0) {
            defaultAttributes[attr.name] = attr.items[0].value;
          }
        });
        addToCart(product, defaultAttributes);
      }
    },
    [addToCart]
  );

  const { loading, error, data } = useQuery(GET_PRODUCTS, {
    variables: selectedCategory === 1 ? {} : { categoryId: selectedCategory },
  });

  if (loading) return <p className="loading">Loading...</p>;
  if (error) return <p>Error fetching products: {error.message}</p>;

  const products: Product[] = data?.products || [];

  return (
    <>
      {products.map((product) => (
        <Link
          key={product.id}
          to={`/product/${product.id}`}
          className="product-card"
          onMouseEnter={() => setHoveredProductId(product.id)}
          onMouseLeave={() => setHoveredProductId(null)}
        >
          <div className="image-container">
            <img
              src={product.gallery[0]}
              alt={product.name}
              className={!product.inStock ? "out-of-stock" : ""}
            />
            {!product.inStock && (
              <div className="stock-overlay">Out of Stock</div>
            )}

            {hoveredProductId === product.id && product.inStock && (
              <button
                className="cart-checkmark"
                aria-label="Add to Cart"
                onClick={(event) => handleAddToCart(event, product)}
              >
                🛒
              </button>
            )}
          </div>

          <div className="product-info">
            <h3>{product.name}</h3>
            <p>
              {product.prices[0].currency.symbol}
              {product.prices[0].amount.toFixed(2)}
            </p>
          </div>
        </Link>
      ))}
    </>
  );
};
