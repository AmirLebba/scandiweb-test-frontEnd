import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import "@styles/ProductPage.scss";

import { GET_PRODUCT } from "@graphql/queries";
import { Attribute } from "@interfaces/interfaces";
import { useAppContext } from "@hooks/useAppContext";

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useAppContext();

  const { loading, error, data } = useQuery(GET_PRODUCT, { variables: { id } });

  const [selectedImage, setSelectedImage] = useState<string>("");
  const [selectedAttributes, setSelectedAttributes] = useState<
    Record<string, string>
  >({});

  useEffect(() => {
    if (data?.product?.gallery?.length) {
      setSelectedImage(data.product.gallery[0]);
    }
  }, [data]);

  const isAllAttributesSelected = useMemo(
    () =>
      data?.product?.attributes.every(
        (attribute: Attribute) => selectedAttributes[attribute.name]
      ) ?? false,
    [data, selectedAttributes]
  );

  const handleAttributeSelect = useCallback(
    (attributeName: string, value: string) => {
      setSelectedAttributes((prev) => ({
        ...prev,
        [attributeName]: value,
      }));
    },
    []
  );

  const handleNextImage = () => {
    const currentIndex = data.product.gallery.indexOf(selectedImage);
    setSelectedImage(
      data.product.gallery[(currentIndex + 1) % data.product.gallery.length]
    );
  };

  const handlePrevImage = () => {
    const currentIndex = data.product.gallery.indexOf(selectedImage);
    setSelectedImage(
      data.product.gallery[
        (currentIndex - 1 + data.product.gallery.length) %
          data.product.gallery.length
      ]
    );
  };

  if (loading) return <p>Loading...</p>;
  if (error || !data?.product) return <p>Error loading product</p>;

  const product = data.product;

  return (
    <div className="product-modal">
      <div className="product-gallery" data-testid="product-gallery">
        <div className="gallery-thumbnails">
          {product.gallery.map((image: string, index: number) => (
            <img
              key={index}
              src={image}
              alt={`${product.name} ${index}`}
              className={image === selectedImage ? "active" : ""}
              onClick={() => setSelectedImage(image)}
            />
          ))}
        </div>
        <div className="gallery-main">
          <button className="prev" onClick={handlePrevImage}>
            ❮
          </button>
          <img src={selectedImage} alt={product.name} />
          <button className="next" onClick={handleNextImage}>
            ❯
          </button>
        </div>
      </div>

      <div className="product-details">
        <h2>{product.name}</h2>
        {product.attributes.map((attribute: Attribute) => (
          <div
            key={attribute.name}
            className="attribute-group"
            data-testid={`product-${attribute.name}`}
          >
            <h4>{attribute.name}:</h4>
            <div className="attribute-options">
              {attribute.items.map((item) => (
                <button
                  key={item.id}
                  className={`attribute-option ${
                    selectedAttributes[attribute.name] === item.value
                      ? "selected"
                      : ""
                  }`}
                  style={
                    attribute.type === "swatch"
                      ? { backgroundColor: item.value }
                      : {}
                  }
                  onClick={() =>
                    handleAttributeSelect(attribute.name, item.value)
                  }
                >
                  {attribute.type !== "swatch" ? item.displayValue : ""}
                </button>
              ))}
            </div>
          </div>
        ))}

        <div className="price">
          <h4>Price: </h4>
          <p>
            {product.prices[0].currency.symbol}
            {product.prices[0].amount.toFixed(2)}
          </p>
        </div>

        <button
          data-testid="add-to-cart"
          className="add-to-cart-button"
          disabled={!isAllAttributesSelected || !product.inStock}
          onClick={() => addToCart(product, selectedAttributes)}
        >
          Add to Cart
        </button>

        <div className="product-description" data-testid="product-description">
          {product.description
            .split("\n")
            .map((line: string, index: number) => (
              <p key={index}>{line}</p>
            ))}
        </div>
      </div>
    </div>
  );
}
