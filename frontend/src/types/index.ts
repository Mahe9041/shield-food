export type Role = "admin" | "manager" | "member";
export type Country = "India" | "America";
export type OrderStatus = "pending" | "confirmed" | "delivered" | "cancelled";

export interface PaymentMethod {
  id: string;
  userId: string;
  type: string;
  last4: string;
  brand: string;
  expiry: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  country: Country | null;
  avatar: string;
  paymentMethod: PaymentMethod | null;
}

export interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  country: Country;
  city: string;
  rating: number;
  deliveryTime: string;
  minOrder: number;
  image: string;
  description: string;
}

export interface MenuItem {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  price: number;
  category: string;
  veg: boolean;
  popular: boolean;
}

export interface OrderItem {
  itemId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  restaurantId: string;
  country: Country;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  paymentMethodId: string | null;
  createdAt: string;
}

// Cart item extends MenuItem with a quantity field
export interface CartItem extends MenuItem {
  quantity: number;
}
