import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import "@styles/ProductPage.scss";
import { GET_PRODUCT } from "@graphql/queries";
import {  Attribute,ProductPageProps } from "@interfaces/interfaces";



export default function ProductPage({ onAddToCart, setCartOpen }: ProductPageProps ) {
  const { id } = useParams<{ id: string }>();

  // Fetch product data
  const { loading, error, data } = useQuery(GET_PRODUCT, { variables: { id } });

  // State for selected image and attributes
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [selectedAttributes, setSelectedAttributes] = useState<
    Record<string, string>
  >({});

  // Set the initial selected image when data is loaded
  if (data?.product && !selectedImage) {
    setSelectedImage(data.product.gallery[0]);
  }

  // Handle attribute selection
  const handleAttributeSelect = (attributeName: string, value: string) => {
    setSelectedAttributes((prev) => ({
      ...prev,
      [attributeName]: value,
    }));
  };

  // Check if all attributes are selected
  const isAllAttributesSelected =
    data?.product?.attributes.every(
      (attribute: Attribute) => selectedAttributes[attribute.name]
    ) ?? false;

  // Loading and error states
  if (loading) return <p>Loading...</p>;
  if (error || !data?.product) return <p>Error loading product</p>;

  const product = data.product;

  return (
    <div className="product-modal">
      {/*  Product Gallery */}
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
          <button
            className="prev"
            onClick={() => {
              const currentIndex = product.gallery.indexOf(selectedImage);
              setSelectedImage(
                product.gallery[
                  (currentIndex - 1 + product.gallery.length) %
                    product.gallery.length
                ]
              );
            }}
          >
            ❮
          </button>
          <img src={selectedImage} alt={product.name} />
          <button
            className="next"
            onClick={() => {
              const currentIndex = product.gallery.indexOf(selectedImage);
              setSelectedImage(
                product.gallery[(currentIndex + 1) % product.gallery.length]
              );
            }}
          >
            ❯
          </button>
        </div>
      </div>

      {/*  Product Details */}
      <div className="product-details">
        <h2>{product.name}</h2>
        {product.attributes.map((attribute: Attribute) => (
          <div
            key={attribute.name}
            data-testid={`product-${attribute.name}`}
            className="attribute-group"
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
                      ? {
                          backgroundColor: item.value,
                        }
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
          onClick={() => {
            onAddToCart(product, selectedAttributes);
            setCartOpen(true); //  Open the cart after adding an item
          }}
        >
          Add to Cart
        </button>

        {/*  Product Description */}
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
