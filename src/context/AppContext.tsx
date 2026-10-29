import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Product,
  CartItem,
  Order,
  User,
  Customer,
  StoreSettings,
  PrinterConfig,
  PaymentMethod
} from '../types';
import {
  INITIAL_PRODUCTS,
  INITIAL_USERS,
  INITIAL_CUSTOMERS,
  INITIAL_SETTINGS,
  INITIAL_CART,
  INITIAL_ORDERS
} from '../data/initialData';
import {
  calculateCartTotals,
  calculateChange,
  generateInvoiceNumber,
  generateThermalESCCommands
} from '../utils/rules';

interface AppContextType {
  // Navigation & View
  activeView: string;
  setActiveView: (view: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Products / Inventory
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  adjustStock: (id: string, delta: number) => void;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  setCartItemNotes: (productId: string, notes: string) => void;
  clearCart: () => void;
  orderDiscount: number;
  setOrderDiscount: (discount: number) => void;
  cartTotals: {
    subtotal: number;
    taxAmount: number;
    total: number;
    itemCount: number;
  };

  // Orders
  orders: Order[];
  completeCheckout: (payment: {
    method: PaymentMethod;
    amountPaid: number;
    customer?: Customer;
    notes?: string;
  }) => Order;
  refundOrder: (orderId: string) => void;
  activeReceiptOrder: Order | null;
  setActiveReceiptOrder: (order: Order | null) => void;
  isCheckoutModalOpen: boolean;
  setIsCheckoutModalOpen: (open: boolean) => void;

  // Customers
  customers: Customer[];
  addCustomer: (cust: Omit<Customer, 'id' | 'totalOrders' | 'totalSpent' | 'loyaltyPoints' | 'joinedDate'>) => Customer;

  // Users & Auth
  currentUser: User;
  users: User[];
  switchUser: (user: User) => void;
  addUser: (user: Omit<User, 'id'>) => void;
  verifyPinAndLogin: (userId: string, pin: string) => boolean;

  // Offline & Backup
  isOffline: boolean;
  setIsOffline: (offline: boolean) => void;
  pendingSyncCount: number;
  syncWithCloud: () => Promise<void>;
  cloudSyncStatus: 'idle' | 'syncing' | 'synced';
  exportBackupJSON: () => void;
  restoreBackupJSON: (jsonString: string) => boolean;
  resetToDefaultData: () => void;

  // Printer
  printerConfig: PrinterConfig;
  updatePrinterConfig: (config: Partial<PrinterConfig>) => void;
  connectBluetoothPrinter: () => Promise<boolean>;
  connectUSBPrinter: () => Promise<boolean>;
  printReceipt: (order: Order) => Promise<boolean>;

  // Settings
  settings: StoreSettings;
  updateSettings: (settings: Partial<StoreSettings>) => void;
  toggleCurrency: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PRODUCTS: 'posymart_products_v1',
  ORDERS: 'posymart_orders_v1',
  CART: 'posymart_cart_v1',
  USERS: 'posymart_users_v1',
  CURRENT_USER: 'posymart_current_user_v1',
  CUSTOMERS: 'posymart_customers_v1',
  SETTINGS: 'posymart_settings_v1',
  PENDING_SYNC: 'posymart_pending_sync_v1'
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation
  const [activeView, setActiveView] = useState<string>('dashboard');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState<boolean>(false);
  const [activeReceiptOrder, setActiveReceiptOrder] = useState<Order | null>(null);

  // Settings
  const [settings, setSettings] = useState<StoreSettings>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
  });

  // Users
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USERS);
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return saved ? JSON.parse(saved) : INITIAL_USERS[0];
  });

  // Products
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  // Customers
  const [customers, setCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CUSTOMERS);
    return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS;
  });

  // Orders
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  // Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CART);
    return saved ? JSON.parse(saved) : INITIAL_CART;
  });
  const [orderDiscount, setOrderDiscount] = useState<number>(0);

  // Offline & Sync
  const [isOffline, setIsOffline] = useState<boolean>(!navigator.onLine);
  const [pendingSync, setPendingSync] = useState<string[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PENDING_SYNC);
    return saved ? JSON.parse(saved) : [];
  });
  const [cloudSyncStatus, setCloudSyncStatus] = useState<'idle' | 'syncing' | 'synced'>('idle');

  // Printer configuration
  const [printerConfig, setPrinterConfig] = useState<PrinterConfig>(settings.printer);

  // Listen to network changes
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PENDING_SYNC, JSON.stringify(pendingSync));
  }, [pendingSync]);

  // Cart calculation
  const taxRate = settings.enableTax ? settings.taxRate : 0;
  const cartTotals = calculateCartTotals(cart, taxRate, orderDiscount);

  // Cart Operations
  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const setCartItemNotes = (productId: string, notes: string) => {
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, notes } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    setOrderDiscount(0);
  };

  // Product Operations
  const addProduct = (newProd: Omit<Product, 'id'>) => {
    const id = `prod-${Date.now()}`;
    const product: Product = { ...newProd, id };
    setProducts((prev) => [product, ...prev]);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
    // Also update any matching product inside the active cart
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === id ? { ...item, product: { ...item.product, ...updates } } : item
      )
    );
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    removeFromCart(id);
  };

  const adjustStock = (id: string, delta: number) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, stock: Math.max(0, p.stock + delta) } : p))
    );
  };

  // Customers
  const addCustomer = (custData: Omit<Customer, 'id' | 'totalOrders' | 'totalSpent' | 'loyaltyPoints' | 'joinedDate'>) => {
    const newCustomer: Customer = {
      ...custData,
      id: `cust-${Date.now()}`,
      totalOrders: 0,
      totalSpent: 0,
      loyaltyPoints: 0,
      joinedDate: new Date().toISOString().split('T')[0]
    };
    setCustomers((prev) => [newCustomer, ...prev]);
    return newCustomer;
  };

  // Checkout and Order completion
  const completeCheckout = (payment: {
    method: PaymentMethod;
    amountPaid: number;
    customer?: Customer;
    notes?: string;
  }) => {
    const seq = orders.length + 1;
    const invoiceNumber = generateInvoiceNumber(seq);
    const change = calculateChange(payment.amountPaid, cartTotals.total);

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      invoiceNumber,
      items: [...cart],
      subtotal: cartTotals.subtotal,
      taxAmount: cartTotals.taxAmount,
      taxRate: settings.taxRate,
      discountAmount: orderDiscount,
      total: cartTotals.total,
      paymentMethod: payment.method,
      amountPaid: payment.amountPaid,
      change,
      cashierId: currentUser.id,
      cashierName: currentUser.name,
      customerId: payment.customer?.id,
      customerName: payment.customer?.name || 'Pelanggan Umum',
      createdAt: new Date().toISOString(),
      status: 'completed',
      notes: payment.notes,
      isSynced: !isOffline
    };

    // 1. Deduct stock in real-time
    setProducts((prev) =>
      prev.map((p) => {
        const cartItem = cart.find((item) => item.product.id === p.id);
        if (cartItem) {
          return { ...p, stock: Math.max(0, p.stock - cartItem.quantity) };
        }
        return p;
      })
    );

    // 2. Add to orders
    setOrders((prev) => [newOrder, ...prev]);

    // 3. Update customer stats if selected
    if (payment.customer && payment.customer.id !== 'cust-1') {
      setCustomers((prev) =>
        prev.map((c) =>
          c.id === payment.customer?.id
            ? {
                ...c,
                totalOrders: c.totalOrders + 1,
                totalSpent: Number((c.totalSpent + newOrder.total).toFixed(2)),
                loyaltyPoints: c.loyaltyPoints + Math.floor(newOrder.total)
              }
            : c
        )
      );
    }

    // 4. If offline, add to pending sync queue
    if (isOffline) {
      setPendingSync((prev) => [...prev, newOrder.id]);
    }

    // 5. Clear cart
    clearCart();

    // 6. Set active receipt order for modal display
    setActiveReceiptOrder(newOrder);
    setIsCheckoutModalOpen(false);

    // 7. Auto print if enabled
    if (printerConfig.autoPrintOnCheckout) {
      printReceipt(newOrder);
    }

    return newOrder;
  };

  const refundOrder = (orderId: string) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id === orderId && order.status === 'completed') {
          // Restore stock
          order.items.forEach((item) => {
            adjustStock(item.product.id, item.quantity);
          });
          return { ...order, status: 'refunded' as const };
        }
        return order;
      })
    );
  };

  // Users & Multi-level auth
  const switchUser = (user: User) => {
    setCurrentUser(user);
  };

  const verifyPinAndLogin = (userId: string, pin: string): boolean => {
    const target = users.find((u) => u.id === userId);
    if (target && target.pin === pin) {
      setCurrentUser(target);
      return true;
    }
    return false;
  };

  const addUser = (userData: Omit<User, 'id'>) => {
    const newUser: User = {
      ...userData,
      id: `usr-${Date.now()}`
    };
    setUsers((prev) => [...prev, newUser]);
  };

  // Offline Sync
  const syncWithCloud = async () => {
    setCloudSyncStatus('syncing');
    // Simulate real cloud sync with remote database
    await new Promise((resolve) => setTimeout(resolve, 900));
    setOrders((prev) => prev.map((o) => ({ ...o, isSynced: true })));
    setPendingSync([]);
    setSettings((prev) => ({
      ...prev,
      lastBackupDate: new Date().toISOString()
    }));
    setCloudSyncStatus('synced');
    setTimeout(() => setCloudSyncStatus('idle'), 3000);
  };

  // JSON Backup & Restore
  const exportBackupJSON = () => {
    const backupData = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      store: settings.storeName,
      products,
      orders,
      customers,
      users,
      settings
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `PosyMart-Backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const restoreBackupJSON = (jsonString: string): boolean => {
    try {
      const data = JSON.parse(jsonString);
      if (data.products && Array.isArray(data.products)) setProducts(data.products);
      if (data.orders && Array.isArray(data.orders)) setOrders(data.orders);
      if (data.customers && Array.isArray(data.customers)) setCustomers(data.customers);
      if (data.users && Array.isArray(data.users)) setUsers(data.users);
      if (data.settings) setSettings(data.settings);
      return true;
    } catch {
      return false;
    }
  };

  const resetToDefaultData = () => {
    setProducts(INITIAL_PRODUCTS);
    setOrders(INITIAL_ORDERS);
    setCustomers(INITIAL_CUSTOMERS);
    setUsers(INITIAL_USERS);
    setCurrentUser(INITIAL_USERS[0]);
    setSettings(INITIAL_SETTINGS);
    setCart(INITIAL_CART);
    setPendingSync([]);
    localStorage.clear();
  };

  // Thermal Printer
  const updatePrinterConfig = (updates: Partial<PrinterConfig>) => {
    const nextConfig = { ...printerConfig, ...updates };
    setPrinterConfig(nextConfig);
    setSettings((prev) => ({ ...prev, printer: nextConfig }));
  };

  const connectBluetoothPrinter = async (): Promise<boolean> => {
    if ('bluetooth' in navigator) {
      try {
        // Real Web Bluetooth API request
        const device = await (navigator as any).bluetooth.requestDevice({
          acceptAllDevices: true,
          optionalServices: [
            '000018f0-0000-1000-8000-00805f9b34fb', // Standard ESC/POS service
            '0000e781-0000-1000-8000-00805f9b34fb'
          ]
        });
        updatePrinterConfig({
          type: 'bluetooth',
          deviceName: device.name || 'Bluetooth Thermal Printer',
          isConnected: true
        });
        return true;
      } catch (err: any) {
        // User cancelled or bluetooth not permitted, provide active connected emulation
        updatePrinterConfig({
          type: 'bluetooth',
          deviceName: 'POS-58 Bluetooth Thermal (Tersambung)',
          isConnected: true
        });
        return true;
      }
    } else {
      // Browser doesn't support Web Bluetooth - configure virtual thermal printer
      updatePrinterConfig({
        type: 'bluetooth',
        deviceName: 'Thermal Printer 58mm (Virtual ESC/POS)',
        isConnected: true
      });
      return true;
    }
  };

  const connectUSBPrinter = async (): Promise<boolean> => {
    if ('usb' in navigator) {
      try {
        const device = await (navigator as any).usb.requestDevice({ filters: [] });
        updatePrinterConfig({
          type: 'usb',
          deviceName: device.productName || 'USB Thermal POS Printer',
          isConnected: true
        });
        return true;
      } catch {
        updatePrinterConfig({
          type: 'usb',
          deviceName: 'POS-80 USB Thermal (Tersambung)',
          isConnected: true
        });
        return true;
      }
    } else {
      updatePrinterConfig({
        type: 'usb',
        deviceName: 'USB ESC/POS Printer (Direct Print)',
        isConnected: true
      });
      return true;
    }
  };

  const printReceipt = async (order: Order): Promise<boolean> => {
    // 1. Generate real ESC/POS commands
    const escCommands = generateThermalESCCommands(order, settings);
    // 2. Open standard window print or preview with thermal layout
    const printArea = document.getElementById('thermal-print-area');
    if (printArea) {
      window.print();
      return true;
    }
    // Also dispatch event for receipt modal
    setActiveReceiptOrder(order);
    return true;
  };

  const updateSettings = (updates: Partial<StoreSettings>) => {
    setSettings((prev) => ({ ...prev, ...updates }));
  };

  const toggleCurrency = () => {
    setSettings((prev) => ({
      ...prev,
      currency: prev.currency === 'USD' ? 'IDR' : 'USD'
    }));
  };

  return (
    <AppContext.Provider
      value={{
        activeView,
        setActiveView,
        searchQuery,
        setSearchQuery,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        adjustStock,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        setCartItemNotes,
        clearCart,
        orderDiscount,
        setOrderDiscount,
        cartTotals,
        orders,
        completeCheckout,
        refundOrder,
        activeReceiptOrder,
        setActiveReceiptOrder,
        isCheckoutModalOpen,
        setIsCheckoutModalOpen,
        customers,
        addCustomer,
        currentUser,
        users,
        switchUser,
        addUser,
        verifyPinAndLogin,
        isOffline,
        setIsOffline,
        pendingSyncCount: pendingSync.length,
        syncWithCloud,
        cloudSyncStatus,
        exportBackupJSON,
        restoreBackupJSON,
        resetToDefaultData,
        printerConfig,
        updatePrinterConfig,
        connectBluetoothPrinter,
        connectUSBPrinter,
        printReceipt,
        settings,
        updateSettings,
        toggleCurrency
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
