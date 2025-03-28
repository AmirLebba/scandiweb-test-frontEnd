import { createContext, useReducer, useState, ReactNode } from "react";
import {
  Product,
  Category,
  AppState,
  AppContextType,
} from "@interfaces/interfaces";

const initialState: AppState = {
  cart: [],
  selectedCategory: 1,
  cartOpen: false,
  categories: [],
};

export type Action =
  | {
      type: "ADD_TO_CART";
      payload: { product: Product; selectedAttributes: Record<string, string> };
    }
  | { type: "REMOVE_FROM_CART"; payload: string }
  | { type: "UPDATE_QUANTITY"; payload: { productId: string; change: number } }
  | { type: "SET_CATEGORIES"; payload: Category[] }
  | { type: "SET_SELECTED_CATEGORY"; payload: number }
  | { type: "TOGGLE_CART" }
  | { type: "CLEAR_CART" };

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
        return { ...state, cart: updatedCart, cartOpen: true };
      }

      return {
        ...state,
        cart: [...state.cart, { product, quantity: 1, selectedAttributes }],
        cartOpen: true,
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

    case "CLEAR_CART":
      return {
        ...state,
        cart: [],
      };
    default:
      return state;
  }
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const [selectedAttributes, setSelectedAttributes] = useState<
    Record<string, string>
  >({});
  const [selectedImage, setSelectedImage] = useState<string>("");

  const addToCart = (
    product: Product,
    selectedAttributes: Record<string, string>
  ) => {
    dispatch({ type: "ADD_TO_CART", payload: { product, selectedAttributes } });
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
    console.log("Cart state after toggle:", state.cartOpen);
  };

  const setCategories = (categories: Category[]) => {
    dispatch({ type: "SET_CATEGORIES", payload: categories });
  };

  return (
    <AppContext.Provider
      value={{
        ...state,
        addToCart,
        dispatch,
        removeFromCart,
        updateQuantity,
        setSelectedCategory,
        toggleCart,
        setCategories,
        selectedAttributes,
        setSelectedAttributes,
        selectedImage,
        setSelectedImage,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export { AppContext };
export type { AppContextType };
