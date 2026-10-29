import { Product, User, Customer, Order, StoreSettings, CartItem } from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: 'usr-1',
    name: 'John Doe',
    email: 'john.doe@posymart.com',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    pin: '1234',
    phone: '0812-3456-7890',
    isActive: true
  },
  {
    id: 'usr-2',
    name: 'Sarah Jenkins',
    email: 'sarah.j@posymart.com',
    role: 'cashier',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    pin: '0000',
    phone: '0813-8899-7711',
    isActive: true
  },
  {
    id: 'usr-3',
    name: 'Budi Santoso',
    email: 'budi.s@posymart.com',
    role: 'cashier',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    pin: '1111',
    phone: '0811-2233-4455',
    isActive: true
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-cappuccino',
    name: 'Cappuccino',
    category: 'Coffee',
    price: 3.50,
    costPrice: 1.40,
    stock: 85,
    minStockAlert: 15,
    sku: 'COF-CAP-01',
    barcode: '89900101',
    image: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=500&auto=format&fit=crop',
    unit: 'cup',
    description: 'Espresso with steamed milk foam and light cocoa powder dust.'
  },
  {
    id: 'prod-latte',
    name: 'Latte',
    category: 'Coffee',
    price: 3.80,
    costPrice: 1.50,
    stock: 92,
    minStockAlert: 15,
    sku: 'COF-LAT-02',
    barcode: '89900102',
    image: 'https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?w=500&auto=format&fit=crop',
    unit: 'cup',
    description: 'Smooth double shot espresso with silky microfoam.'
  },
  {
    id: 'prod-americano',
    name: 'Americano',
    category: 'Coffee',
    price: 2.90,
    costPrice: 0.90,
    stock: 120,
    minStockAlert: 20,
    sku: 'COF-AME-03',
    barcode: '89900103',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500&auto=format&fit=crop',
    unit: 'cup',
    description: 'Rich espresso diluted with hot mineral water.'
  },
  {
    id: 'prod-mocha',
    name: 'Mocha',
    category: 'Coffee',
    price: 4.20,
    costPrice: 1.80,
    stock: 64,
    minStockAlert: 10,
    sku: 'COF-MOC-04',
    barcode: '89900104',
    image: 'https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?w=500&auto=format&fit=crop',
    unit: 'cup',
    description: 'Espresso mixed with premium melted dark chocolate and milk.'
  },
  {
    id: 'prod-bagel',
    name: 'Bagel',
    category: 'Food',
    price: 2.80,
    costPrice: 1.10,
    stock: 35,
    minStockAlert: 10,
    sku: 'FD-BGL-05',
    barcode: '89900105',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&auto=format&fit=crop',
    unit: 'pcs',
    description: 'Fresh toasted golden sesame bagel with cream cheese spread.'
  },
  {
    id: 'prod-sandwich',
    name: 'Sandwich',
    category: 'Food',
    price: 5.50,
    costPrice: 2.20,
    stock: 28,
    minStockAlert: 8,
    sku: 'FD-SDW-06',
    barcode: '89900106',
    image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=500',
    unit: 'porsi',
    description: 'Artisan sourdough club sandwich with smoked chicken and fresh greens.'
  },
  {
    id: 'prod-caesar-salad',
    name: 'Caesar Salad',
    category: 'Food',
    price: 6.50,
    costPrice: 2.60,
    stock: 18,
    minStockAlert: 5,
    sku: 'FD-CSR-07',
    barcode: '89900107',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500',
    unit: 'porsi',
    description: 'Crisp romaine lettuce, garlic croutons, parmesan, and Caesar dressing.'
  },
  {
    id: 'prod-muffin',
    name: 'Muffin',
    category: 'Desserts',
    price: 2.60,
    costPrice: 0.95,
    stock: 40,
    minStockAlert: 10,
    sku: 'DS-MUF-08',
    barcode: '89900108',
    image: 'https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=500',
    unit: 'pcs',
    description: 'Fluffy blueberry crumble muffin baked fresh this morning.'
  },
  {
    id: 'prod-orange-juice',
    name: 'Orange Juice',
    category: 'Drinks',
    price: 2.90,
    costPrice: 1.00,
    stock: 55,
    minStockAlert: 12,
    sku: 'DR-ORJ-09',
    barcode: '89900109',
    image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=500',
    unit: 'cup',
    description: '100% freshly squeezed Valencia oranges with ice.'
  },
  {
    id: 'prod-smoothie',
    name: 'Smoothie',
    category: 'Drinks',
    price: 3.90,
    costPrice: 1.50,
    stock: 42,
    minStockAlert: 10,
    sku: 'DR-SMO-10',
    barcode: '89900110',
    image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=500',
    unit: 'cup',
    description: 'Berry burst smoothie with Greek yogurt and raw honey.'
  },
  {
    id: 'prod-chocolate-cake',
    name: 'Chocolate Cake',
    category: 'Desserts',
    price: 4.50,
    costPrice: 1.80,
    stock: 14,
    minStockAlert: 6,
    sku: 'DS-CKC-11',
    barcode: '89900111',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500',
    unit: 'slice',
    description: 'Decadent 3-layer Belgian dark chocolate fudge cake.'
  },
  {
    id: 'prod-cookie',
    name: 'Cookie',
    category: 'Desserts',
    price: 1.80,
    costPrice: 0.60,
    stock: 6, // Low stock warning test!
    minStockAlert: 10,
    sku: 'DS-COO-12',
    barcode: '89900112',
    image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=500',
    unit: 'pcs',
    description: 'Chewy chocolate chip cookie with brown butter and sea salt.'
  }
];

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'cust-1',
    name: 'Pelanggan Umum (Walk-in)',
    phone: '-',
    email: '-',
    totalOrders: 82,
    totalSpent: 1240.50,
    loyaltyPoints: 120,
    joinedDate: '2026-01-10'
  },
  {
    id: 'cust-2',
    name: 'Amanda Amanda',
    phone: '0812-9988-7766',
    email: 'amanda@example.com',
    totalOrders: 15,
    totalSpent: 285.40,
    loyaltyPoints: 285,
    joinedDate: '2026-03-15'
  },
  {
    id: 'cust-3',
    name: 'Rian Pratama',
    phone: '0857-1122-3344',
    email: 'rian.pratama@example.com',
    totalOrders: 9,
    totalSpent: 142.00,
    loyaltyPoints: 140,
    joinedDate: '2026-05-20'
  },
  {
    id: 'cust-4',
    name: 'Jessica Lee',
    phone: '0878-4455-6677',
    email: 'jessica.l@example.com',
    totalOrders: 22,
    totalSpent: 410.80,
    loyaltyPoints: 410,
    joinedDate: '2026-02-01'
  }
];

export const INITIAL_SETTINGS: StoreSettings = {
  storeName: 'PosyMart',
  tagline: 'Modern Coffee & Daily Treats',
  address: 'Jl. Boulevard Raya Blok A-12, Jakarta',
  phone: '0812-3456-7890',
  email: 'contact@posymart.com',
  currency: 'USD', // Allows user switch to 'IDR' instantly
  taxRate: 0.08, // 8% matching screenshot Tax (8%)
  enableTax: true,
  receiptHeader: 'Terima Kasih atas Kunjungan Anda!',
  receiptFooter: 'Barang yang sudah dibeli tidak dapat ditukar kecuali ada perjanjian.',
  printer: {
    type: 'bluetooth',
    paperWidth: '58mm',
    autoPrintOnCheckout: false,
    deviceName: 'Thermal-Printer-58',
    isConnected: true
  },
  autoCloudBackup: true,
  lastBackupDate: new Date().toISOString()
};

// Initial Cart Items matching the screenshot!
export const INITIAL_CART: CartItem[] = [
  {
    product: INITIAL_PRODUCTS[0], // Cappuccino $3.50
    quantity: 1
  },
  {
    product: INITIAL_PRODUCTS[4], // Bagel $2.80 x 2 = $5.60
    quantity: 2
  },
  {
    product: INITIAL_PRODUCTS[6], // Caesar Salad $6.50
    quantity: 1
  },
  {
    product: INITIAL_PRODUCTS[8], // Orange Juice $2.90
    quantity: 1
  }
];

// Seed recent completed orders to generate rich analytics, charts and reporting
export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-101',
    invoiceNumber: 'TRX-20261028-0125',
    items: [
      { product: INITIAL_PRODUCTS[1], quantity: 2 },
      { product: INITIAL_PRODUCTS[5], quantity: 1 }
    ],
    subtotal: 13.10,
    taxAmount: 1.05,
    taxRate: 0.08,
    discountAmount: 0,
    total: 14.15,
    paymentMethod: 'qris',
    amountPaid: 14.15,
    change: 0,
    cashierId: 'usr-1',
    cashierName: 'John Doe',
    customerName: 'Pelanggan Umum',
    createdAt: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
    status: 'completed',
    isSynced: true
  },
  {
    id: 'ord-102',
    invoiceNumber: 'TRX-20261028-0126',
    items: [
      { product: INITIAL_PRODUCTS[0], quantity: 3 },
      { product: INITIAL_PRODUCTS[10], quantity: 2 }
    ],
    subtotal: 19.50,
    taxAmount: 1.56,
    taxRate: 0.08,
    discountAmount: 0,
    total: 21.06,
    paymentMethod: 'cash',
    amountPaid: 25.00,
    change: 3.94,
    cashierId: 'usr-1',
    cashierName: 'John Doe',
    customerName: 'Amanda Amanda',
    createdAt: new Date(Date.now() - 1000 * 60 * 75).toISOString(),
    status: 'completed',
    isSynced: true
  },
  {
    id: 'ord-103',
    invoiceNumber: 'TRX-20261028-0127',
    items: [
      { product: INITIAL_PRODUCTS[6], quantity: 2 },
      { product: INITIAL_PRODUCTS[9], quantity: 2 }
    ],
    subtotal: 20.80,
    taxAmount: 1.66,
    taxRate: 0.08,
    discountAmount: 0,
    total: 22.46,
    paymentMethod: 'debit',
    amountPaid: 22.46,
    change: 0,
    cashierId: 'usr-2',
    cashierName: 'Sarah Jenkins',
    customerName: 'Jessica Lee',
    createdAt: new Date(Date.now() - 1000 * 60 * 140).toISOString(),
    status: 'completed',
    isSynced: true
  },
  {
    id: 'ord-104',
    invoiceNumber: 'TRX-20261028-0128',
    items: [
      { product: INITIAL_PRODUCTS[3], quantity: 2 },
      { product: INITIAL_PRODUCTS[7], quantity: 3 }
    ],
    subtotal: 16.20,
    taxAmount: 1.30,
    taxRate: 0.08,
    discountAmount: 1.00,
    total: 16.50,
    paymentMethod: 'cash',
    amountPaid: 20.00,
    change: 3.50,
    cashierId: 'usr-1',
    cashierName: 'John Doe',
    customerName: 'Rian Pratama',
    createdAt: new Date(Date.now() - 1000 * 60 * 210).toISOString(),
    status: 'completed',
    isSynced: true
  }
];
