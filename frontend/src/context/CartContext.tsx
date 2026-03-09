import { createContext, useContext, useState, type ReactNode } from 'react';
import type { MenuItem, Restaurant, CartItem } from '../types';

interface CartContextType {
  cart: {
    restaurantId: string | null;
    restaurant: Restaurant | null;
    items: CartItem[];
  };
  addItem: (restaurant: Restaurant, item: MenuItem) => void;
  removeItem: (itemId: string) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | null>(null);

const EMPTY_CART = {
  restaurantId: null,
  restaurant: null,
  items: [],
};

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartContextType['cart']>(EMPTY_CART);

  const addItem = (restaurant: Restaurant, item: MenuItem) => {
    setCart((prev) => {
      // If adding from a DIFFERENT restaurant — reset cart
      // You can't order from two restaurants at once
      if (prev.restaurantId && prev.restaurantId !== restaurant.id) {
        return {
          restaurantId: restaurant.id,
          restaurant,
          items: [{ ...item, quantity: 1 }],
        };
      }

      // Check if item already exists in cart
      const existing = prev.items.find((i) => i.id === item.id);

      if (existing) {
        // Item exists — just increase quantity
        return {
          ...prev,
          items: prev.items.map((i) =>
            i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
          ),
        };
      }

      // New item — add to cart with quantity 1
      return {
        restaurantId: restaurant.id,
        restaurant,
        items: [...prev.items, { ...item, quantity: 1 }],
      };
    });
  };

  const removeItem = (itemId: string) => {
    setCart((prev) => {
      const items = prev.items
        .map((i) => i.id === itemId ? { ...i, quantity: i.quantity - 1 } : i)
        .filter((i) => i.quantity > 0); // Remove if quantity hits 0

      // If cart is now empty, reset everything
      return items.length === 0
        ? EMPTY_CART
        : { ...prev, items };
    });
  };

  const clearCart = () => setCart(EMPTY_CART);

  // Derived values — calculated from cart state
  // No need to store these separately, they update automatically
  const total = cart.items.reduce(
    (sum, item) => sum + item.price * item.quantity, 0
  );

  const itemCount = cart.items.reduce(
    (sum, item) => sum + item.quantity, 0
  );

  return (
    <CartContext.Provider value={{ cart, addItem, removeItem, clearCart, total, itemCount }}>
      {children}
    </CartContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCart(): CartContextType {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used inside CartProvider');
  return context;
}