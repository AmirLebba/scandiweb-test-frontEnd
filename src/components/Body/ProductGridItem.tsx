import { Link } from "react-router-dom";
import "@styles/ProductGridItem.scss";
import { ProductGridItemProps } from "@interfaces/interfaces";

export const ProductGridItem: React.FC<ProductGridItemProps> = ({
  product,
}) => {
  return (
    <Link to={`/product/${product.id}`} className="product-card">
      <img
        src={product.gallery[0]}
        alt={product.name}
        className="product-image"
      />
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-price">
          {product.prices[0].currency.symbol}
          {product.prices[0].amount.toFixed(2)}
        </p>
      </div>
    </Link>
  );
};
