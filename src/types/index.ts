export type Category = 'all' | 'clothing' | 'shoes' | 'outerwear';
export type Gender = 'all' | 'unisex' | 'men' | 'women';

export interface ProductVariant {
  sku: string;
  size: string;
  color: string;
  colorHex: string;
  stock: number;
  reserved: number; // held by shoppers in active checkout carts
}

export interface Product {
  id: string;
  name: string;
  category: 'clothing' | 'shoes' | 'outerwear';
  subcategory: string;
  gender: 'unisex' | 'men' | 'women';
  price: number;
  originalPrice?: number;
  description: string;
  details: string[];
  materials: string;
  care: string;
  fit: string;
  image: string;
  galleryImages: string[];
  badge?: string;
  rating: number;
  reviewsCount: number;
  variants: ProductVariant[];
}

export interface CartItem {
  cartItemId: string;
  productId: string;
  productName: string;
  image: string;
  size: string;
  color: string;
  colorHex: string;
  sku: string;
  price: number;
  quantity: number;
  reservedUntil: number; // Unix timestamp ms
}

export interface InventoryActivity {
  id: string;
  timestamp: number;
  type: 'sale' | 'reservation' | 'release' | 'restock' | 'adjustment';
  productName: string;
  sku: string;
  size: string;
  change: number;
  resultingStock: number;
  note: string;
}

export interface CustomerShipping {
  fullName: string;
  email: string;
  phone: string; // Safaricom number for M-PESA & Parcel Grid SMS notification
  countyOrCity: string;
  pickupStation: string; // Nearest Parcel Grid station / locker
  shippingMethod: 'parcel_grid_station';
}

export interface PaymentDetails {
  method: 'mpesa_stk' | 'mpesa_till' | 'card' | 'airtel_money';
  mpesaPhoneNumber?: string;
  mpesaTransactionCode?: string;
  tillNumber?: string;
  paybillNumber?: string;
  accountReference?: string;
  cardNumber?: string;
  cardBrand?: 'visa' | 'mastercard' | 'generic';
  last4?: string;
  transactionId: string;
  isTokenized: boolean;
  securityHash: string;
  receiptMessage?: string;
}

export interface Order {
  id: string;
  date: string;
  timestamp: number;
  items: CartItem[];
  shipping: CustomerShipping;
  payment: PaymentDetails;
  subtotal: number;
  shippingCost: number;
  discount: number;
  tax: number;
  total: number;
  trackingNumber: string;
  status: 'Confirmed' | 'Processing' | 'Dispatched' | 'Delivered';
  estimatedDelivery: string;
}
