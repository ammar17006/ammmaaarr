export type Role = 'admin' | 'cashier';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar: string;
  pin: string; // 4-digit PIN for quick cashier login
  phone?: string;
  isActive: boolean;
}

export type ProductCategory = 'All' | 'Coffee' | 'Food' | 'Drinks' | 'Desserts';

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  price: number; // Harga Jual
  costPrice: number; // Harga Modal (HPP)
  stock: number;
  minStockAlert: number;
  sku: string;
  barcode: string;
  image: string;
  description?: string;
  unit: string; // 'pcs', 'cup', 'porsi'
}

export interface CartItem {
  product: Product;
  quantity: number;
  notes?: string;
  discountPercent?: number;
}

export type PaymentMethod = 'cash' | 'qris' | 'debit' | 'transfer';

export interface Order {
  id: string;
  invoiceNumber: string;
  items: CartItem[];
  subtotal: number;
  taxAmount: number;
  taxRate: number; // e.g. 0.08 or 0.11
  discountAmount: number;
  total: number;
  paymentMethod: PaymentMethod;
  amountPaid: number;
  change: number;
  cashierId: string;
  cashierName: string;
  customerId?: string;
  customerName?: string;
  createdAt: string; // ISO string
  status: 'completed' | 'refunded';
  notes?: string;
  isSynced: boolean; // For offline sync tracking
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  totalOrders: number;
  totalSpent: number;
  loyaltyPoints: number;
  joinedDate: string;
}

export interface PrinterConfig {
  type: 'bluetooth' | 'usb' | 'system';
  paperWidth: '58mm' | '80mm';
  autoPrintOnCheckout: boolean;
  deviceName?: string;
  isConnected: boolean;
}

export interface StoreSettings {
  storeName: string;
  tagline: string;
  address: string;
  phone: string;
  email: string;
  currency: 'IDR' | 'USD';
  taxRate: number; // 0.08 for 8%, 0.11 for 11%
  enableTax: boolean;
  receiptHeader: string;
  receiptFooter: string;
  printer: PrinterConfig;
  autoCloudBackup: boolean;
  lastBackupDate?: string;
}

export interface ShiftSession {
  id: string;
  cashierId: string;
  cashierName: string;
  startTime: string;
  endTime?: string;
  startingCash: number;
  totalCashSales: number;
  totalNonCashSales: number;
  totalTransactions: number;
  actualClosingCash?: number;
  cashDifference?: number;
  status: 'open' | 'closed';
}
