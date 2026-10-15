import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";

const CartContext = createContext(null);
const STORAGE_KEY = "quickbite-cart";

const loadCart = () => {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    const cartData = stored ? JSON.parse(stored) : [];
    
    // Check if cart contains old string IDs and clear if so
    const hasStringIds = cartData.some(item => typeof item.id === 'string' && item.id.startsWith('food-'));
    if (hasStringIds) {
      console.log('Clearing cart with old string IDs');
      window.localStorage.removeItem(STORAGE_KEY);
      return [];
    }
    
    return cartData;
  } catch {
    return [];
  }
};

const reducer = (state, action) => {
  switch (action.type) {
    case "ADD_ITEM": {
      const existing = state.find((item) => item.id === action.payload.id);

      if (existing) {
        return state.map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item,
        );
      }

      return [...state, action.payload];
    }
    case "INCREMENT_ITEM":
      return state.map((item) =>
        item.id === action.payload
          ? { ...item, quantity: item.quantity + 1 }
          : item,
      );
    case "DECREMENT_ITEM":
      return state
        .map((item) =>
          item.id === action.payload
            ? { ...item, quantity: Math.max(1, item.quantity - 1) }
            : item,
        )
        .filter((item) => item.quantity > 0);
    case "REMOVE_ITEM":
      return state.filter((item) => item.id !== action.payload);
    case "CLEAR_CART":
      return [];
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [cartItems, dispatch] = useReducer(reducer, [], loadCart);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  const value = useMemo(() => {
    const itemCount = cartItems.reduce(
      (total, item) => total + item.quantity,
      0,
    );
    const subtotal = cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );

    return {
      cartItems,
      itemCount,
      subtotal,
      addItem: (item) => dispatch({ type: "ADD_ITEM", payload: item }),
      incrementItem: (id) => dispatch({ type: "INCREMENT_ITEM", payload: id }),
      decrementItem: (id) => dispatch({ type: "DECREMENT_ITEM", payload: id }),
      removeItem: (id) => dispatch({ type: "REMOVE_ITEM", payload: id }),
      clearCart: () => dispatch({ type: "CLEAR_CART" }),
    };
  }, [cartItems]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }

  return context;
};
