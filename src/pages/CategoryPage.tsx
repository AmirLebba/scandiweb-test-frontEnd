import { useEffect } from "react";
import { useAppContext } from "@hooks/useAppContext";

import { ProductGridItem } from "@components/Body/ProductGridItem";

const categoryNameToId: Record<string, number> = {
  all: 1,
  clothes: 2,
  tech: 3,
};

export default function CategoryPage({ categoryName }: { categoryName: string }) {
  const { selectedCategory, setSelectedCategory } = useAppContext();

  useEffect(() => {
    const categoryId = categoryNameToId[categoryName] || 1;

    if (selectedCategory !== categoryId) {
      setSelectedCategory(categoryId);
    }
  }, [categoryName, selectedCategory, setSelectedCategory]);

  return <ProductGridItem />;
}
