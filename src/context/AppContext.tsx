import { createContext, useReducer, ReactNode } from "react";
import { Product } from "@interfaces/interfaces";

interface CartItem {
  product: Product;
  quantity: number;
  selectedAttributes: { [key: string]: string };
}

interface AppState {
  cart: CartItem[];
  selectedCategory: number;
  cartOpen: boolean;
  categories: Category[]; 
}

interface Category {
  id: number;
  name: string;
}
interface AppContextType {
  cart: CartItem[];
  selectedCategory: number;
  cartOpen: boolean;
  categories: Category[];
  addToCart: (
    product: Product,
    selectedAttributes: { [key: string]: string }
  ) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, change: number) => void;
  setSelectedCategory: (categoryId: number) => void;
  toggleCart: () => void;
  setCategories: (categories: Category[]) => void;
}

// Initial State
const initialState: AppState = {
  cart: [],
  selectedCategory: 1,
  cartOpen: false,
  categories: [],
};

// Actions
type Action =
  | {
      type: "ADD_TO_CART";
      payload: {
        product: Product;
        selectedAttributes: { [key: string]: string };
      };
    }
  | { type: "REMOVE_FROM_CART"; payload: string }
  | { type: "UPDATE_QUANTITY"; payload: { productId: string; change: number } }
  | { type: "SET_CATEGORIES"; payload: Category[] }
  | { type: "SET_SELECTED_CATEGORY"; payload: number }
  | { type: "TOGGLE_CART" };

// Reducer Function
function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "ADD_TO_CART": {
      const { product, selectedAttributes } = action.payload;
      const existingItemIndex = state.cart.findIndex(
        (item) =>
          item.product.id === product.id &&
          JSON.stringify(item.selectedAttributes) ===
            JSON.stringify(selectedAttributes)
      );

      if (existingItemIndex !== -1) {
        const updatedCart = [...state.cart];
        updatedCart[existingItemIndex].quantity += 1;
        return { ...state, cart: updatedCart };
      }

      return {
        ...state,
        cart: [...state.cart, { product, quantity: 1, selectedAttributes }],
      };
    }

    case "REMOVE_FROM_CART":
      return {
        ...state,
        cart: state.cart.filter((item) => item.product.id !== action.payload),
      };

    case "UPDATE_QUANTITY":
      return {
        ...state,
        cart: state.cart
          .map((item) =>
            item.product.id === action.payload.productId
              ? { ...item, quantity: item.quantity + action.payload.change }
              : item
          )
          .filter((item) => item.quantity > 0),
      };

    case "SET_SELECTED_CATEGORY":
      return { ...state, selectedCategory: action.payload };

    case "TOGGLE_CART":
      return { ...state, cartOpen: !state.cartOpen };

    case "SET_CATEGORIES":
      return { ...state, categories: action.payload };

    default:
      return state;
  }
}

// Create Context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider Component
export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const addToCart = (
    product: Product,
    selectedAttributes: { [key: string]: string }
  ) => {
    dispatch({ type: "ADD_TO_CART", payload: { product, selectedAttributes } });
    dispatch({ type: "TOGGLE_CART" });
  };

  const removeFromCart = (productId: string) => {
    dispatch({ type: "REMOVE_FROM_CART", payload: productId });
  };

  const updateQuantity = (productId: string, change: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { productId, change } });
  };

  const setSelectedCategory = (categoryId: number) => {
    dispatch({ type: "SET_SELECTED_CATEGORY", payload: categoryId });
  };

  const toggleCart = () => {
    dispatch({ type: "TOGGLE_CART" });
  };
  const setCategories = (categories: Category[]) => {
    dispatch({ type: "SET_CATEGORIES", payload: categories });
  };
  

  return (
    <AppContext.Provider
      value={{
        cart: state.cart,
        selectedCategory: state.selectedCategory,
        categories: state.categories, 
        cartOpen: state.cartOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        setSelectedCategory,
        toggleCart,
        setCategories, 
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export { AppContext };
export type { AppContextType };
