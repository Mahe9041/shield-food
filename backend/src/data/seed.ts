// ============================================
// INTERFACES — define the shape of our data
// ============================================

export type Role = 'admin' | 'manager' | 'member';
export type Country = 'India' | 'America';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Role;
  country: Country | null;
  avatar: string;
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

export interface PaymentMethod {
  id: string;
  userId: string;
  type: string;
  last4: string;
  brand: string;
  expiry: string;
  updatedAt?: string;
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
  status: 'pending' | 'confirmed' | 'delivered' | 'cancelled';
  paymentMethodId: string | null;
  createdAt: string;
  placedAt?: string;
  cancelledAt?: string;
}

// ============================================
// DATA — the hashed password for "password"
// ============================================

const HASHED = '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi';

export const USERS: User[] = [
  {
    id: 'user-1',
    name: 'Nick Fury',
    email: 'nick@shield.com',
    password: HASHED,
    role: 'admin',
    country: null,
    avatar: 'NF',
  },
  {
    id: 'user-2',
    name: 'Captain Marvel',
    email: 'marvel@shield.com',
    password: HASHED,
    role: 'manager',
    country: 'India',
    avatar: 'CM',
  },
  {
    id: 'user-3',
    name: 'Captain America',
    email: 'america@shield.com',
    password: HASHED,
    role: 'manager',
    country: 'America',
    avatar: 'CA',
  },
  {
    id: 'user-4',
    name: 'Thanos',
    email: 'thanos@shield.com',
    password: HASHED,
    role: 'member',
    country: 'India',
    avatar: 'TH',
  },
  {
    id: 'user-5',
    name: 'Thor',
    email: 'thor@shield.com',
    password: HASHED,
    role: 'member',
    country: 'India',
    avatar: 'TR',
  },
  {
    id: 'user-6',
    name: 'Travis',
    email: 'travis@shield.com',
    password: HASHED,
    role: 'member',
    country: 'America',
    avatar: 'TV',
  },
];

export const RESTAURANTS: Restaurant[] = [
  {
    id: 'rest-1',
    name: 'Spice Garden',
    cuisine: 'Indian',
    country: 'India',
    city: 'Mumbai',
    rating: 4.5,
    deliveryTime: '30-45 min',
    minOrder: 200,
    image: '🍛',
    description: 'Authentic Indian cuisine with rich spices',
  },
  {
    id: 'rest-2',
    name: 'Tandoor Palace',
    cuisine: 'North Indian',
    country: 'India',
    city: 'Delhi',
    rating: 4.3,
    deliveryTime: '25-40 min',
    minOrder: 250,
    image: '🫓',
    description: 'Famous for clay oven kebabs and fresh naan',
  },
  {
    id: 'rest-3',
    name: 'Dosa Express',
    cuisine: 'South Indian',
    country: 'India',
    city: 'Bangalore',
    rating: 4.6,
    deliveryTime: '20-35 min',
    minOrder: 150,
    image: '🥞',
    description: 'Crispy dosas from the heart of South India',
  },
  {
    id: 'rest-4',
    name: 'The Burger Joint',
    cuisine: 'American',
    country: 'America',
    city: 'New York',
    rating: 4.4,
    deliveryTime: '20-30 min',
    minOrder: 15,
    image: '🍔',
    description: 'Gourmet burgers with premium Angus beef',
  },
  {
    id: 'rest-5',
    name: 'Pizza Republic',
    cuisine: 'Italian-American',
    country: 'America',
    city: 'Chicago',
    rating: 4.7,
    deliveryTime: '25-40 min',
    minOrder: 20,
    image: '🍕',
    description: 'Chicago deep dish and NY style pizza',
  },
  {
    id: 'rest-6',
    name: 'BBQ Nation',
    cuisine: 'American BBQ',
    country: 'America',
    city: 'Texas',
    rating: 4.8,
    deliveryTime: '35-50 min',
    minOrder: 25,
    image: '🥩',
    description: '18-hour hickory wood smoked BBQ meats',
  },
];

export const MENU_ITEMS: MenuItem[] = [
  // Spice Garden
  {
    id: 'item-1',
    restaurantId: 'rest-1',
    name: 'Butter Chicken',
    price: 320,
    category: 'Main Course',
    veg: false,
    popular: true,
    description: 'Creamy tomato curry with tender chicken',
  },
  {
    id: 'item-2',
    restaurantId: 'rest-1',
    name: 'Paneer Tikka Masala',
    price: 280,
    category: 'Main Course',
    veg: true,
    popular: true,
    description: 'Grilled cottage cheese in spiced gravy',
  },
  {
    id: 'item-3',
    restaurantId: 'rest-1',
    name: 'Dal Makhani',
    price: 220,
    category: 'Main Course',
    veg: true,
    popular: false,
    description: 'Black lentils slow-cooked overnight',
  },
  {
    id: 'item-4',
    restaurantId: 'rest-1',
    name: 'Garlic Naan',
    price: 60,
    category: 'Breads',
    veg: true,
    popular: false,
    description: 'Soft bread with garlic and butter',
  },
  {
    id: 'item-5',
    restaurantId: 'rest-1',
    name: 'Mango Lassi',
    price: 80,
    category: 'Beverages',
    veg: true,
    popular: true,
    description: 'Chilled yogurt drink with fresh mango',
  },
  // Tandoor Palace
  {
    id: 'item-6',
    restaurantId: 'rest-2',
    name: 'Chicken Tikka',
    price: 350,
    category: 'Starters',
    veg: false,
    popular: true,
    description: 'Marinated chicken grilled in tandoor',
  },
  {
    id: 'item-7',
    restaurantId: 'rest-2',
    name: 'Seekh Kebab',
    price: 380,
    category: 'Starters',
    veg: false,
    popular: false,
    description: 'Minced lamb kebab with fresh herbs',
  },
  {
    id: 'item-8',
    restaurantId: 'rest-2',
    name: 'Rogan Josh',
    price: 420,
    category: 'Main Course',
    veg: false,
    popular: true,
    description: 'Aromatic lamb curry from Kashmir',
  },
  // Dosa Express
  {
    id: 'item-9',
    restaurantId: 'rest-3',
    name: 'Masala Dosa',
    price: 120,
    category: 'Main Course',
    veg: true,
    popular: true,
    description: 'Crispy crepe filled with spiced potato',
  },
  {
    id: 'item-10',
    restaurantId: 'rest-3',
    name: 'Idli Sambar',
    price: 90,
    category: 'Breakfast',
    veg: true,
    popular: true,
    description: 'Steamed rice cakes with lentil soup',
  },
  {
    id: 'item-11',
    restaurantId: 'rest-3',
    name: 'Filter Coffee',
    price: 50,
    category: 'Beverages',
    veg: true,
    popular: true,
    description: 'South Indian style strong filter coffee',
  },
  // The Burger Joint
  {
    id: 'item-12',
    restaurantId: 'rest-4',
    name: 'Classic Smash Burger',
    price: 12.99,
    category: 'Burgers',
    veg: false,
    popular: true,
    description: 'Double smash patty with american cheese',
  },
  {
    id: 'item-13',
    restaurantId: 'rest-4',
    name: 'BBQ Bacon Burger',
    price: 15.99,
    category: 'Burgers',
    veg: false,
    popular: true,
    description: 'Crispy bacon, BBQ sauce, caramelized onions',
  },
  {
    id: 'item-14',
    restaurantId: 'rest-4',
    name: 'Loaded Fries',
    price: 6.99,
    category: 'Sides',
    veg: true,
    popular: true,
    description: 'Crispy fries with cheese sauce and jalapeños',
  },
  // Pizza Republic
  {
    id: 'item-15',
    restaurantId: 'rest-5',
    name: 'Pepperoni Deep Dish',
    price: 22.99,
    category: 'Pizza',
    veg: false,
    popular: true,
    description: 'Chicago style with layers of cheese',
  },
  {
    id: 'item-16',
    restaurantId: 'rest-5',
    name: 'Margherita NY Style',
    price: 18.99,
    category: 'Pizza',
    veg: true,
    popular: true,
    description: 'Classic fresh mozzarella and basil',
  },
  {
    id: 'item-17',
    restaurantId: 'rest-5',
    name: 'Caesar Salad',
    price: 8.99,
    category: 'Salads',
    veg: true,
    popular: false,
    description: 'Romaine, croutons, parmesan dressing',
  },
  // BBQ Nation
  {
    id: 'item-18',
    restaurantId: 'rest-6',
    name: 'Brisket Platter',
    price: 24.99,
    category: 'BBQ',
    veg: false,
    popular: true,
    description: '18-hour smoked beef brisket sliced',
  },
  {
    id: 'item-19',
    restaurantId: 'rest-6',
    name: 'Pulled Pork Sandwich',
    price: 13.99,
    category: 'Sandwiches',
    veg: false,
    popular: true,
    description: 'Slow-smoked pulled pork with coleslaw',
  },
  {
    id: 'item-20',
    restaurantId: 'rest-6',
    name: 'Baby Back Ribs',
    price: 29.99,
    category: 'BBQ',
    veg: false,
    popular: true,
    description: 'Full rack with hickory smoke and dry rub',
  },
];

export const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: 'pay-1',
    userId: 'user-1',
    type: 'card',
    last4: '4242',
    brand: 'Visa',
    expiry: '12/26',
  },
  {
    id: 'pay-2',
    userId: 'user-2',
    type: 'card',
    last4: '5555',
    brand: 'Mastercard',
    expiry: '08/25',
  },
  {
    id: 'pay-3',
    userId: 'user-3',
    type: 'card',
    last4: '1234',
    brand: 'Amex',
    expiry: '03/27',
  },
  {
    id: 'pay-4',
    userId: 'user-4',
    type: 'card',
    last4: '9876',
    brand: 'Visa',
    expiry: '11/25',
  },
  {
    id: 'pay-5',
    userId: 'user-5',
    type: 'card',
    last4: '3456',
    brand: 'Mastercard',
    expiry: '06/26',
  },
  {
    id: 'pay-6',
    userId: 'user-6',
    type: 'card',
    last4: '7890',
    brand: 'Visa',
    expiry: '09/26',
  },
];

// We use `let` not `const` because orders will grow as users place new ones
export const ORDERS: Order[] = [
  {
    id: 'order-1',
    userId: 'user-4',
    restaurantId: 'rest-1',
    country: 'India',
    items: [
      { itemId: 'item-1', name: 'Butter Chicken', price: 320, quantity: 2 },
      { itemId: 'item-4', name: 'Garlic Naan', price: 60, quantity: 3 },
    ],
    total: 820,
    status: 'delivered',
    paymentMethodId: 'pay-4',
    createdAt: '2024-01-15T10:30:00Z',
  },
  {
    id: 'order-2',
    userId: 'user-6',
    restaurantId: 'rest-4',
    country: 'America',
    items: [
      {
        itemId: 'item-12',
        name: 'Classic Smash Burger',
        price: 12.99,
        quantity: 2,
      },
      { itemId: 'item-14', name: 'Loaded Fries', price: 6.99, quantity: 1 },
    ],
    total: 32.97,
    status: 'confirmed',
    paymentMethodId: 'pay-6',
    createdAt: '2024-01-16T14:20:00Z',
  },
];
