import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";

import ProductDetails from "./ProductDetails";
import "@styles/ProductPage.scss";

import { GET_PRODUCT } from "@graphql/queries";
import { useAppContext } from "@hooks/useAppContext";

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const { selectedImage, setSelectedImage, setSelectedAttributes } = useAppContext();
  const { loading, error, data } = useQuery(GET_PRODUCT, { variables: { id } });

  useEffect(() => {
    if (data?.product?.gallery?.length) {
      setSelectedImage(data.product.gallery[0] ?? undefined); 
      setSelectedAttributes({});
    }
  }, [data, setSelectedImage, setSelectedAttributes]);

  if (loading) return <p>Loading...</p>;
  if (error || !data?.product) return <p>Error loading product</p>;

  return (
    <div className="product-modal">
     
      <div className="product-gallery" data-testid="product-gallery">
        <div className="gallery-thumbnails">
          {data.product.gallery?.map((image: string, index: number) => (
            <img
              key={index}
              src={image || undefined} 
              alt={`Product Image ${index}`}
              className={image === selectedImage ? "active" : ""}
              onClick={() => setSelectedImage(image)}
            />
          ))}
        </div>
        <div className="gallery-main">
          <button className="prev" onClick={() => handleImageChange(-1)}>❮</button>
          {selectedImage ? (
            <img src={selectedImage} alt="Selected Product" />
          ) : (
            <p>No Image Available</p> 
          )}
          <button className="next" onClick={() => handleImageChange(1)}>❯</button>
        </div>
      </div>
      <ProductDetails />
    </div>
  );

  function handleImageChange(direction: number) {
    if (!data?.product?.gallery?.length || !selectedImage) return; 

    const gallery = data.product.gallery;
    const currentIndex = gallery.indexOf(selectedImage);
    const newIndex = (currentIndex + direction + gallery.length) % gallery.length;

    setSelectedImage(gallery[newIndex]);
  }
}
