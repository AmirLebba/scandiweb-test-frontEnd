import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import parse from "html-react-parser";
import DOMPurify from "dompurify";

import { GET_PRODUCT } from "@graphql/queries";
import { useAppContext } from "@hooks/useAppContext";
import { Attribute, Product } from "@interfaces/interfaces";

import Loading from "@components/SVGs/Loading";

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const { addToCart, selectedAttributes, setSelectedAttributes } =
    useAppContext();
  const { loading, error, data } = useQuery<{ product: Product }>(GET_PRODUCT, {
    variables: { id },
  });

  if (loading)
    return (
      <p className="loading">
        <Loading />
      </p>
    );
  if (error || !data?.product) return <p>Error loading product</p>;

  const product = data.product;

  const isAllAttributesSelected = product.attributes.every(
    (attribute) => selectedAttributes[attribute.name]
  );

  return (
    <div className="product-details">
      <h2>{product.name}</h2>

      {product.attributes.map((attribute: Attribute) => {
        const attributeKebabCase = attribute.name
          .toLowerCase()
          .replace(/\s+/g, "-");

        return (
          <div
            key={attribute.name}
            className="attribute-group"
            data-testid={`product-attribute-${attributeKebabCase}`}
          >
            <h4>{attribute.name}:</h4>
            <div className="attribute-options">
              {attribute.items.map((item) => {
                const isSelected =
                  selectedAttributes[attribute.name] === item.value;

                const itemTestId = item.value.startsWith("#")
                  ? item.value
                  : item.value.replace(/\s+/g, "-");

                return (
                  <button
                    key={item.id}
                    className={`attribute-option ${
                      isSelected ? "selected" : ""
                    }`}
                    style={
                      attribute.type === "swatch"
                        ? { backgroundColor: item.value }
                        : {}
                    }
                    onClick={() =>
                      setSelectedAttributes((prev) => ({
                        ...prev,
                        [attribute.name]: item.value,
                      }))
                    }
                    data-testid={`product-attribute-${attributeKebabCase}-${itemTestId}${
                      isSelected ? "-selected" : ""
                    }`}
                  >
                    {attribute.type !== "swatch" ? item.displayValue : ""}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}

      <div className="price">
        <h4>Price:</h4>
        <p>
          {product.prices[0].currency.symbol}
          {product.prices[0].amount.toFixed(2)}
        </p>
      </div>

      <button
        className="add-to-cart-button"
        data-testid="add-to-cart"
        onClick={() => addToCart(product, selectedAttributes)}
        disabled={!isAllAttributesSelected || !product.inStock}
      >
        {product.inStock ? "Add to Cart" : "Out of Stock"}
      </button>

      <div className="product-description" data-testid="product-description">
        {parse(DOMPurify.sanitize(product.description))}
      </div>
    </div>
  );
}
