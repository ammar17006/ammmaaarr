import { Product, User, Customer, Order, StoreSettings, CartItem } from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: 'usr-1',
    name: 'ammar',
    email: 'ammar@ammarkafe.com',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    pin: '1234',
    password: 'ammar123',
    phone: '085643094039',
    isActive: true
  },
  {
    id: 'usr-2',
    name: 'jamil',
    email: 'jamil@ammarkafe.com',
    role: 'cashier',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    pin: '0000',
    password: 'jamil123',
    phone: '0813-8899-7711',
    isActive: true
  },
  {
    id: 'usr-3',
    name: 'saeja',
    email: 'saeja@ammarkafe.com',
    role: 'cashier',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    pin: '1111',
    password: 'saeja123',
    phone: '0811-2233-4455',
    isActive: true
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-cappuccino',
    name: 'Cappuccino',
    category: 'Coffee',
    price: 25000,
    costPrice: 10000,
    stock: 85,
    minStockAlert: 15,
    sku: 'COF-CAP-01',
    barcode: '89900101',
    image: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=500&auto=format&fit=crop',
    unit: 'cup',
    description: 'Espresso dengan steamed milk foam lembut dan taburan bubuk cokelat.'
  },
  {
    id: 'prod-latte',
    name: 'Latte',
    category: 'Coffee',
    price: 26000,
    costPrice: 11000,
    stock: 92,
    minStockAlert: 15,
    sku: 'COF-LAT-02',
    barcode: '89900102',
    image: 'https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?w=500&auto=format&fit=crop',
    unit: 'cup',
    description: 'Double shot espresso dipadukan susu segar lembut berkualitas.'
  },
  {
    id: 'prod-americano',
    name: 'Americano',
    category: 'Coffee',
    price: 20000,
    costPrice: 7000,
    stock: 120,
    minStockAlert: 20,
    sku: 'COF-AME-03',
    barcode: '89900103',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500&auto=format&fit=crop',
    unit: 'cup',
    description: 'Espresso murni aromatik dicampur air panas segar.'
  },
  {
    id: 'prod-mocha',
    name: 'Mocha',
    category: 'Coffee',
    price: 28000,
    costPrice: 12000,
    stock: 64,
    minStockAlert: 10,
    sku: 'COF-MOC-04',
    barcode: '89900104',
    image: 'https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?w=500&auto=format&fit=crop',
    unit: 'cup',
    description: 'Espresso dengan cokelat Belgia pekat dan susu segar gurih.'
  },
  {
    id: 'prod-bagel',
    name: 'Bagel',
    category: 'Food',
    price: 18000,
    costPrice: 8000,
    stock: 35,
    minStockAlert: 10,
    sku: 'FD-BGL-05',
    barcode: '89900105',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&auto=format&fit=crop',
    unit: 'pcs',
    description: 'Roti bagel panggang wijen renyah dengan olesan cream cheese.'
  },
  {
    id: 'prod-sandwich',
    name: 'Sandwich',
    category: 'Food',
    price: 32000,
    costPrice: 14000,
    stock: 28,
    minStockAlert: 8,
    sku: 'FD-SDW-06',
    barcode: '89900106',
    image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=500',
    unit: 'porsi',
    description: 'Club sandwich roti gandum isi smoked chicken dan sayuran segar.'
  },
  {
    id: 'prod-caesar-salad',
    name: 'Caesar Salad',
    category: 'Food',
    price: 35000,
    costPrice: 15000,
    stock: 18,
    minStockAlert: 5,
    sku: 'FD-CSR-07',
    barcode: '89900107',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500',
    unit: 'porsi',
    description: 'Salad romaine segar dengan taburan keju parmesan dan saus caesar.'
  },
  {
    id: 'prod-muffin',
    name: 'Muffin',
    category: 'Desserts',
    price: 18000,
    costPrice: 7000,
    stock: 40,
    minStockAlert: 10,
    sku: 'DS-MUF-08',
    barcode: '89900108',
    image: 'https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=500',
    unit: 'pcs',
    description: 'Muffin lembut dengan isian blueberry segar panggang hari ini.'
  },
  {
    id: 'prod-orange-juice',
    name: 'Orange Juice',
    category: 'Drinks',
    price: 20000,
    costPrice: 8000,
    stock: 55,
    minStockAlert: 12,
    sku: 'DR-ORJ-09',
    barcode: '89900109',
    image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=500',
    unit: 'cup',
    description: 'Jus jeruk peras murni segar kaya vitamin C.'
  },
  {
    id: 'prod-smoothie',
    name: 'Smoothie',
    category: 'Drinks',
    price: 28000,
    costPrice: 11000,
    stock: 42,
    minStockAlert: 10,
    sku: 'DR-SMO-10',
    barcode: '89900110',
    image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=500',
    unit: 'cup',
    description: 'Smoothie campuran buah berry dengan yogurt segar.'
  },
  {
    id: 'prod-chocolate-cake',
    name: 'Chocolate Cake',
    category: 'Desserts',
    price: 30000,
    costPrice: 12000,
    stock: 14,
    minStockAlert: 6,
    sku: 'DS-CKC-11',
    barcode: '89900111',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500',
    unit: 'slice',
    description: 'Kue cokelat fudge lezat dengan lapisan ganache cokelat pekat.'
  },
  {
    id: 'prod-cookie',
    name: 'Cookie',
    category: 'Desserts',
    price: 15000,
    costPrice: 5000,
    stock: 6,
    minStockAlert: 10,
    sku: 'DS-COO-12',
    barcode: '89900112',
    image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=500',
    unit: 'pcs',
    description: 'Kue kering renyah dengan butiran cokelat chip manis.'
  }
];

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'cust-1',
    name: 'Pelanggan Umum (Walk-in)',
    phone: '-',
    email: '-',
    totalOrders: 82,
    totalSpent: 2850000,
    loyaltyPoints: 120,
    joinedDate: '2026-01-10'
  },
  {
    id: 'cust-2',
    name: 'Amanda Amanda',
    phone: '0812-9988-7766',
    email: 'amanda@example.com',
    totalOrders: 15,
    totalSpent: 620000,
    loyaltyPoints: 285,
    joinedDate: '2026-03-15'
  },
  {
    id: 'cust-3',
    name: 'Rian Pratama',
    phone: '0857-1122-3344',
    email: 'rian.pratama@example.com',
    totalOrders: 9,
    totalSpent: 340000,
    loyaltyPoints: 140,
    joinedDate: '2026-05-20'
  },
  {
    id: 'cust-4',
    name: 'Jessica Lee',
    phone: '0878-4455-6677',
    email: 'jessica.l@example.com',
    totalOrders: 22,
    totalSpent: 890000,
    loyaltyPoints: 410,
    joinedDate: '2026-02-01'
  }
];

export const INITIAL_SETTINGS: StoreSettings = {
  storeName: 'ammar kafe',
  tagline: 'Nikmati Kopi Pilihan & Santapan Hangat',
  address: 'Jln Bakung, Rejodadi',
  phone: '085643094039',
  email: 'ammarkafe@gmail.com',
  currency: 'IDR', // Default Rupiah sesuai permintaan
  language: 'id', // Default Bahasa Indonesia
  taxRate: 0.10, // 10% PB1 Resto/Kafe
  enableTax: true,
  receiptHeader: 'Terima Kasih atas Kunjungan Anda!',
  receiptFooter: 'Terima kasih atas kunjungan Anda di ammar kafe!',
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

// Initial Cart Items with updated IDR prices
export const INITIAL_CART: CartItem[] = [
  {
    product: INITIAL_PRODUCTS[0], // Cappuccino Rp 25.000
    quantity: 1
  },
  {
    product: INITIAL_PRODUCTS[4], // Bagel Rp 18.000 x 2 = Rp 36.000
    quantity: 2
  },
  {
    product: INITIAL_PRODUCTS[6], // Caesar Salad Rp 35.000
    quantity: 1
  },
  {
    product: INITIAL_PRODUCTS[8], // Orange Juice Rp 20.000
    quantity: 1
  }
];

// Seed recent completed orders to generate rich analytics, charts and reporting
export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-101',
    invoiceNumber: 'TRX-20261104-0125',
    items: [
      { product: INITIAL_PRODUCTS[1], quantity: 2 },
      { product: INITIAL_PRODUCTS[5], quantity: 1 }
    ],
    subtotal: 84000,
    taxAmount: 8400,
    taxRate: 0.10,
    discountAmount: 0,
    total: 92400,
    paymentMethod: 'qris',
    amountPaid: 92400,
    change: 0,
    cashierId: 'usr-1',
    cashierName: 'ammar',
    customerName: 'Pelanggan Umum',
    createdAt: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
    status: 'completed',
    isSynced: true
  },
  {
    id: 'ord-102',
    invoiceNumber: 'TRX-20261104-0126',
    items: [
      { product: INITIAL_PRODUCTS[0], quantity: 3 },
      { product: INITIAL_PRODUCTS[10], quantity: 2 }
    ],
    subtotal: 135000,
    taxAmount: 13500,
    taxRate: 0.10,
    discountAmount: 0,
    total: 148500,
    paymentMethod: 'cash',
    amountPaid: 150000,
    change: 1500,
    cashierId: 'usr-2',
    cashierName: 'jamil',
    customerName: 'Amanda Amanda',
    createdAt: new Date(Date.now() - 1000 * 60 * 75).toISOString(),
    status: 'completed',
    isSynced: true
  },
  {
    id: 'ord-103',
    invoiceNumber: 'TRX-20261104-0127',
    items: [
      { product: INITIAL_PRODUCTS[6], quantity: 2 },
      { product: INITIAL_PRODUCTS[9], quantity: 2 }
    ],
    subtotal: 126000,
    taxAmount: 12600,
    taxRate: 0.10,
    discountAmount: 0,
    total: 138600,
    paymentMethod: 'debit',
    amountPaid: 138600,
    change: 0,
    cashierId: 'usr-3',
    cashierName: 'saeja',
    customerName: 'Jessica Lee',
    createdAt: new Date(Date.now() - 1000 * 60 * 140).toISOString(),
    status: 'completed',
    isSynced: true
  },
  {
    id: 'ord-104',
    invoiceNumber: 'TRX-20261104-0128',
    items: [
      { product: INITIAL_PRODUCTS[3], quantity: 2 },
      { product: INITIAL_PRODUCTS[7], quantity: 3 }
    ],
    subtotal: 110000,
    taxAmount: 11000,
    taxRate: 0.10,
    discountAmount: 5000,
    total: 116000,
    paymentMethod: 'cash',
    amountPaid: 120000,
    change: 4000,
    cashierId: 'usr-1',
    cashierName: 'ammar',
    customerName: 'Rian Pratama',
    createdAt: new Date(Date.now() - 1000 * 60 * 210).toISOString(),
    status: 'completed',
    isSynced: true
  }
];
