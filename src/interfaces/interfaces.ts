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
  selectedCategory: number;
  setCartOpen: (state: boolean) => void;

  isInCart: (productId: string) => boolean;
  onAddToCart: (
    product: Product,
    selectedAttributes: { [key: string]: string }
  ) => void;
}

export default interface NavbarProps {
  selectedCategory: number;
  setSelectedCategory: (id: number) => void;
  cart: {
    product: Product;
    selectedAttributes: { [key: string]: string };
    quantity: number;
  }[];
  setCart: React.Dispatch<
    React.SetStateAction<
      {
        product: Product;
        selectedAttributes: { [key: string]: string };
        quantity: number;
      }[]
    >
  >;
  updateQuantity: (index: number, change: number) => void;
  setCartOpen: (state: boolean) => void;
  cartOpen: boolean;
  categories: { id: number; name: string }[];
}

export interface ProductPageProps {
  onAddToCart: (
    product: Product,
    selectedAttributes: { [key: string]: string }
  ) => void;
  setCartOpen: (state: boolean) => void;
}

export interface Category {
  id: number;
  name: string;
  products: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedAttributes: { [key: string]: string };
}

export interface AppState {
  cart: CartItem[];
  selectedCategory: number;
  cartOpen: boolean;
  categories: Category[];
}

export interface Category {
  id: number;
  name: string;
}

export interface AppContextType {
  cart: CartItem[];
  selectedCategory: number;
  cartOpen: boolean;
  categories: Category[];
  addToCart: (
    product: Product,
    selectedAttributes: Record<string, string>
  ) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, change: number) => void;
  setSelectedCategory: (categoryId: number) => void;
  toggleCart: () => void;
  setCategories: (categories: Category[]) => void;

  selectedImage: string;
  setSelectedImage: (image: string) => void;
  selectedAttributes: Record<string, string>;
  setSelectedAttributes: React.Dispatch<
    React.SetStateAction<Record<string, string>>
  >;
}

export interface CartItemListProps {
  cart: CartItem[];
  updateQuantity: (productId: string, change: number) => void;
}