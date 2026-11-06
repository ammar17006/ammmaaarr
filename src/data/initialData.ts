import { Product, User, Customer, Order, StoreSettings, CartItem, DiscountCoupon } from '../types';

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
  // --- Kategori KOPI ---
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
    id: 'prod-kopisusu-aren',
    name: 'Kopi Susu Gula Aren Ammar',
    category: 'Coffee',
    price: 22000,
    costPrice: 9000,
    stock: 150,
    minStockAlert: 20,
    sku: 'COF-AREN-05',
    barcode: '89900115',
    image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=500&auto=format&fit=crop',
    unit: 'cup',
    description: 'Signature Ammar Kafe! Espresso harum dengan gula aren organik dan fresh milk gurih.'
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
    id: 'prod-caramel-macchiato',
    name: 'Caramel Macchiato',
    category: 'Coffee',
    price: 29000,
    costPrice: 12000,
    stock: 58,
    minStockAlert: 10,
    sku: 'COF-CAR-06',
    barcode: '89900116',
    image: 'https://images.unsplash.com/photo-1485808191679-5f86510681a2?w=500&auto=format&fit=crop',
    unit: 'cup',
    description: 'Espresso creamy dengan saus karamel lezat dan foam susu manis lembut.'
  },
  {
    id: 'prod-vanilla-latte',
    name: 'Vanilla Latte',
    category: 'Coffee',
    price: 27000,
    costPrice: 11000,
    stock: 60,
    minStockAlert: 10,
    sku: 'COF-VAN-07',
    barcode: '89900117',
    image: 'https://images.unsplash.com/photo-1561047029-3000c68339ca?w=500&auto=format&fit=crop',
    unit: 'cup',
    description: 'Kopi susu lembut dengan sirup madagascar vanilla aromatik.'
  },
  {
    id: 'prod-espresso',
    name: 'Espresso Double Shot',
    category: 'Coffee',
    price: 18000,
    costPrice: 6000,
    stock: 140,
    minStockAlert: 20,
    sku: 'COF-ESP-08',
    barcode: '89900118',
    image: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=500&auto=format&fit=crop',
    unit: 'cup',
    description: 'Ekstraksi murni biji kopi arabika pilihan dengan krema tebal emas.'
  },

  // --- Kategori MAKANAN ---
  {
    id: 'prod-bagel',
    name: 'Bagel Cream Cheese',
    category: 'Food',
    price: 18000,
    costPrice: 8000,
    stock: 35,
    minStockAlert: 10,
    sku: 'FD-BGL-05',
    barcode: '89900105',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&auto=format&fit=crop',
    unit: 'pcs',
    description: 'Roti bagel panggang wijen renyah dengan olesan cream cheese gurih.'
  },
  {
    id: 'prod-sandwich',
    name: 'Club Sandwich Smoked Chicken',
    category: 'Food',
    price: 32000,
    costPrice: 14000,
    stock: 28,
    minStockAlert: 8,
    sku: 'FD-SDW-06',
    barcode: '89900106',
    image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=500',
    unit: 'porsi',
    description: 'Club sandwich roti gandum isi smoked chicken, telur, dan selada segar.'
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
    description: 'Salad romaine segar dengan taburan keju parmesan dan saus caesar gurih.'
  },
  {
    id: 'prod-nasgor-ammar',
    name: 'Nasi Goreng Spesial Ammar',
    category: 'Food',
    price: 32000,
    costPrice: 14000,
    stock: 45,
    minStockAlert: 10,
    sku: 'FD-NAS-08',
    barcode: '89900119',
    image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=500&auto=format&fit=crop',
    unit: 'porsi',
    description: 'Nasi goreng racikan bumbu khas Ammar Kafe dengan suwiran ayam, telur mata sapi, dan kerupuk.'
  },
  {
    id: 'prod-miegor-jawa',
    name: 'Mie Goreng Jawa',
    category: 'Food',
    price: 28000,
    costPrice: 12000,
    stock: 40,
    minStockAlert: 10,
    sku: 'FD-MIE-09',
    barcode: '89900120',
    image: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?w=500&auto=format&fit=crop',
    unit: 'porsi',
    description: 'Mie telur kenyal dengan bumbu manis gurih khas Jawa, sayuran, dan bakso sapi.'
  },
  {
    id: 'prod-french-fries',
    name: 'French Fries Crispy',
    category: 'Food',
    price: 18000,
    costPrice: 7000,
    stock: 65,
    minStockAlert: 12,
    sku: 'FD-FRI-10',
    barcode: '89900121',
    image: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?w=500&auto=format&fit=crop',
    unit: 'porsi',
    description: 'Kentang goreng renyah keemasan dengan taburan bumbu gurih dan saus cocolan.'
  },
  {
    id: 'prod-roti-bakar',
    name: 'Roti Bakar Coklat Keju',
    category: 'Food',
    price: 20000,
    costPrice: 8000,
    stock: 35,
    minStockAlert: 8,
    sku: 'FD-RTB-11',
    barcode: '89900122',
    image: 'https://images.unsplash.com/photo-1584776296944-ab6fb57b0bdd?w=500&auto=format&fit=crop',
    unit: 'porsi',
    description: 'Roti panggang tebal isi pasta cokelat melimpah dan parutan keju cheddar gurih.'
  },
  {
    id: 'prod-dimsum',
    name: 'Dimsum Ayam Udang Mentai',
    category: 'Food',
    price: 25000,
    costPrice: 11000,
    stock: 30,
    minStockAlert: 8,
    sku: 'FD-DIM-12',
    barcode: '89900123',
    image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=500&auto=format&fit=crop',
    unit: 'porsi',
    description: 'Dimsum siomay ayam udang kukus lembut dengan saus mentai gurih lezat (isi 4 pcs).'
  },
  {
    id: 'prod-pisang-goreng',
    name: 'Pisang Goreng Madu Wijen',
    category: 'Food',
    price: 18000,
    costPrice: 7000,
    stock: 32,
    minStockAlert: 8,
    sku: 'FD-PSG-13',
    barcode: '89900124',
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500&auto=format&fit=crop',
    unit: 'porsi',
    description: 'Pisang raja goreng krispi dengan karamel madu alami dan taburan biji wijen.'
  },
  {
    id: 'prod-croissant',
    name: 'Croissant Butter Crispy',
    category: 'Food',
    price: 22000,
    costPrice: 9000,
    stock: 24,
    minStockAlert: 6,
    sku: 'FD-CRO-14',
    barcode: '89900125',
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=500&auto=format&fit=crop',
    unit: 'pcs',
    description: 'Pastry khas Perancis berlapis-lapis renyah dengan aroma mentega murni harum.'
  },

  // --- Kategori MINUMAN ---
  {
    id: 'prod-orange-juice',
    name: 'Orange Juice Fresh',
    category: 'Drinks',
    price: 20000,
    costPrice: 8000,
    stock: 55,
    minStockAlert: 12,
    sku: 'DR-ORJ-09',
    barcode: '89900109',
    image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=500',
    unit: 'cup',
    description: 'Jus jeruk peras murni segar kaya vitamin C tanpa pengawet.'
  },
  {
    id: 'prod-smoothie',
    name: 'Strawberry Berry Smoothie',
    category: 'Drinks',
    price: 28000,
    costPrice: 11000,
    stock: 42,
    minStockAlert: 10,
    sku: 'DR-SMO-10',
    barcode: '89900110',
    image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=500',
    unit: 'cup',
    description: 'Smoothie campuran buah stroberi segar, blueberry, dan yogurt kental.'
  },
  {
    id: 'prod-matcha-latte',
    name: 'Matcha Green Tea Latte',
    category: 'Drinks',
    price: 26000,
    costPrice: 11000,
    stock: 48,
    minStockAlert: 10,
    sku: 'DR-MAT-15',
    barcode: '89900126',
    image: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=500&auto=format&fit=crop',
    unit: 'cup',
    description: 'Bubuk matcha murni Uji Jepang diseduh dengan susu hangat segar lembut.'
  },
  {
    id: 'prod-thai-tea',
    name: 'Thai Tea Original',
    category: 'Drinks',
    price: 18000,
    costPrice: 7000,
    stock: 65,
    minStockAlert: 15,
    sku: 'DR-THA-16',
    barcode: '89900127',
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=500&auto=format&fit=crop',
    unit: 'cup',
    description: 'Teh Thailand aromatik pekat dipadukan susu evaporasi manis gurih.'
  },
  {
    id: 'prod-lemon-tea',
    name: 'Ice Lemon Tea Segar',
    category: 'Drinks',
    price: 16000,
    costPrice: 5000,
    stock: 80,
    minStockAlert: 15,
    sku: 'DR-LMN-17',
    barcode: '89900128',
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500&auto=format&fit=crop',
    unit: 'cup',
    description: 'Seduhan teh melati wangi dengan perasan sari buah lemon segar dan es batu.'
  },
  {
    id: 'prod-lychee-tea',
    name: 'Lychee Tea Special',
    category: 'Drinks',
    price: 20000,
    costPrice: 8000,
    stock: 50,
    minStockAlert: 10,
    sku: 'DR-LYC-18',
    barcode: '89900129',
    image: 'https://images.unsplash.com/photo-1595981267035-7b04ca84a82d?w=500&auto=format&fit=crop',
    unit: 'cup',
    description: 'Teh leci segar dengan buah leci utuh manis menyegarkan.'
  },
  {
    id: 'prod-taro-latte',
    name: 'Taro Milk Tea',
    category: 'Drinks',
    price: 22000,
    costPrice: 9000,
    stock: 45,
    minStockAlert: 10,
    sku: 'DR-TAR-19',
    barcode: '89900130',
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500&auto=format&fit=crop',
    unit: 'cup',
    description: 'Minuman rasa talas ungu manis creamy dipadukan fresh milk.'
  },

  // --- Kategori DESSERTS ---
  {
    id: 'prod-chocolate-cake',
    name: 'Chocolate Fudge Cake',
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
    name: 'Cookie Choco Chip',
    category: 'Desserts',
    price: 15000,
    costPrice: 5000,
    stock: 12,
    minStockAlert: 10,
    sku: 'DS-COO-12',
    barcode: '89900112',
    image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=500',
    unit: 'pcs',
    description: 'Kue kering renyah dengan butiran cokelat chip manis.'
  },
  {
    id: 'prod-muffin',
    name: 'Blueberry Muffin',
    category: 'Desserts',
    price: 18000,
    costPrice: 7000,
    stock: 40,
    minStockAlert: 10,
    sku: 'DS-MUF-08',
    barcode: '89900108',
    image: 'https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=500',
    unit: 'pcs',
    description: 'Muffin lembut dengan isian buah blueberry segar panggang hari ini.'
  },
  {
    id: 'prod-tiramisu',
    name: 'Tiramisu Cup Premium',
    category: 'Desserts',
    price: 28000,
    costPrice: 12000,
    stock: 22,
    minStockAlert: 6,
    sku: 'DS-TIR-20',
    barcode: '89900131',
    image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=500&auto=format&fit=crop',
    unit: 'cup',
    description: 'Dessert khas Italia dengan ladyfingers rendaman espresso dan krim mascarpone lembut.'
  },
  {
    id: 'prod-red-velvet',
    name: 'Red Velvet Cake',
    category: 'Desserts',
    price: 30000,
    costPrice: 12000,
    stock: 18,
    minStockAlert: 5,
    sku: 'DS-RED-21',
    barcode: '89900132',
    image: 'https://images.unsplash.com/photo-1616541823729-00fe0aacd32c?w=500&auto=format&fit=crop',
    unit: 'slice',
    description: 'Bolu red velvet klasik dengan lapisan cream cheese frosting lembut dan lezat.'
  }
];

export const INITIAL_DISCOUNTS: DiscountCoupon[] = [
  {
    id: 'disc-1',
    code: 'HAPPYHOURS',
    title: 'Happy Hours Coffee Promo',
    type: 'nominal',
    discountValue: 15000,
    minSpend: 50000,
    expiryDate: '2026-12-31',
    description: 'Potongan langsung Rp 15.000 untuk pembelian di jam santai kafe',
    isActive: true,
    usageCount: 42
  },
  {
    id: 'disc-2',
    code: 'NEWCUSTOMER',
    title: 'Voucher Pelanggan Baru',
    type: 'nominal',
    discountValue: 10000,
    minSpend: 35000,
    expiryDate: '2026-12-31',
    description: 'Diskon selamat datang Rp 10.000 untuk member baru ammar kafe',
    isActive: true,
    usageCount: 28
  },
  {
    id: 'disc-3',
    code: 'BAKERYDAY',
    title: 'Bakery & Dessert Special',
    type: 'nominal',
    discountValue: 8000,
    minSpend: 25000,
    expiryDate: '2026-12-31',
    description: 'Diskon bundling Rp 8.000 untuk aneka kue, roti bakar, dan pastry',
    isActive: true,
    usageCount: 19
  },
  {
    id: 'disc-4',
    code: 'DISKON10',
    title: 'Diskon Spesial Member 10%',
    type: 'percentage',
    discountValue: 10,
    minSpend: 40000,
    expiryDate: '2026-12-31',
    description: 'Potongan 10% untuk total transaksi minimal Rp 40.000',
    isActive: true,
    usageCount: 35
  },
  {
    id: 'disc-5',
    code: 'AMMARKAFE',
    title: 'Voucher Sultan Ammar Kafe',
    type: 'nominal',
    discountValue: 20000,
    minSpend: 75000,
    expiryDate: '2026-12-31',
    description: 'Potongan spesial Rp 20.000 untuk pesanan makan & nongkrong bersama',
    isActive: true,
    usageCount: 14
  },
  {
    id: 'disc-6',
    code: 'NGOPIHEMAT',
    title: 'Promo Ngopi Pagi Hemat',
    type: 'nominal',
    discountValue: 5000,
    minSpend: 20000,
    expiryDate: '2026-12-31',
    description: 'Potongan hemat Rp 5.000 untuk menu kopi',
    isActive: true,
    usageCount: 50
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
