
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  weight: string;
  imageUrl: string;
  categoryId: string;
}

export interface Category {
  id: string;
  name:string;
  imageUrl: string;
}

export interface Retailer {
  id: string;
  name: string;
  rating: number;
  imageUrl: string;
  products: Product[];
  mobileNo?: string;
  email?: string;
  operatingHours?: string;
  description?: string;
  status: 'pending' | 'active';
  accountNo?: string;
  ifscCode?: string;
  bankName?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type OrderStatus = 'placed' | 'processing' | 'out_for_delivery' | 'delivered';

export interface Order {
  id: string;
  items: CartItem[];
  totalPrice: number;
  status: OrderStatus;
  orderDate: Date;
  estimatedDelivery: string;
}

export type UserType = 'customer' | 'retailer' | 'delivery';

export interface User {
  phone?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  userType: UserType;
  storeName?: string;
  // A user can also be a full retailer profile
  retailerProfile?: Retailer;
}