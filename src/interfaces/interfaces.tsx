export interface Price {
  amount: number;
  currency: { label: string; symbol: string };
}

export interface AttributeItem {
  displayValue: string;
  value: string;
  id: string;
}

export interface Attribute {
  name: string;
  type: string;
  items: AttributeItem[];
}
export interface Product {
  id: string;
  name: string;
  inStock: boolean;
  description: string;
  brand: string;
  prices: Price[];
  attributes: Attribute[];
  gallery: string[];
}

export interface ProductGridItemProps {
  product: Product;
}

export default interface NavbarProps {
  selectedCategory: number;
  setSelectedCategory: (id: number) => void;
  cart: {
    product: { id: string; name: string; prices: { amount: number; currency: { symbol: string } }[] };
    selectedAttributes: { [key: string]: string };
  }[];
}

export interface ProductPageProps {
  onAddToCart: (product: Product, selectedAttributes: { [key: string]: string }) => void;
} 


