import { CartItem, Order, Product, StoreSettings, PrinterConfig, PaymentMethod } from '../types';

/**
 * Calculates cart subtotal, tax amount, and final total.
 */
export function calculateCartTotals(
  items: CartItem[],
  taxRate: number,
  discountAmount: number = 0
) {
  const subtotal = items.reduce((sum, item) => {
    const itemPrice = item.product.price;
    const discount = item.discountPercent ? (itemPrice * item.discountPercent) / 100 : 0;
    return sum + (itemPrice - discount) * item.quantity;
  }, 0);

  const subtotalAfterDiscount = Math.max(0, subtotal - discountAmount);
  const taxAmount = Number((subtotalAfterDiscount * taxRate).toFixed(2));
  const total = Number((subtotalAfterDiscount + taxAmount).toFixed(2));

  return {
    subtotal: Number(subtotal.toFixed(2)),
    taxAmount,
    total,
    itemCount: items.reduce((sum, item) => sum + item.quantity, 0)
  };
}

/**
 * Calculates change for cash payments.
 */
export function calculateChange(amountPaid: number, totalAmount: number): number {
  if (amountPaid < totalAmount) return 0;
  return Number((amountPaid - totalAmount).toFixed(2));
}

/**
 * Format currency according to settings (IDR or USD).
 */
export function formatCurrency(amount: number, currency: 'IDR' | 'USD' = 'IDR'): string {
  if (currency === 'USD') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  }

  // Indonesian Rupiah format
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

/**
 * Generates human readable invoice number e.g. TRX-20261028-0042
 */
export function generateInvoiceNumber(sequence: number = 1): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const seqStr = String(sequence).padStart(4, '0');
  return `TRX-${year}${month}${day}-${seqStr}`;
}

/**
 * Calculate detailed sales report metrics for a given date range or specific date.
 */
export function calculateReportMetrics(
  orders: Order[],
  startDate?: string,
  endDate?: string
) {
  // Filter active completed orders in the specified period
  const filteredOrders = orders.filter((order) => {
    if (order.status !== 'completed') return false;
    const orderDate = new Date(order.createdAt);

    if (startDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      if (orderDate < start) return false;
    }

    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      if (orderDate > end) return false;
    }

    return true;
  });

  const totalSales = filteredOrders.reduce((sum, order) => sum + order.total, 0);
  const totalSubtotal = filteredOrders.reduce((sum, order) => sum + order.subtotal, 0);
  const totalTax = filteredOrders.reduce((sum, order) => sum + order.taxAmount, 0);
  const totalDiscount = filteredOrders.reduce((sum, order) => sum + order.discountAmount, 0);
  const totalOrders = filteredOrders.length;
  const avgOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;

  // Calculate Cost of Goods Sold (HPP / Modal) and Gross Profit
  let totalCost = 0;
  let totalItemsSold = 0;
  const productSalesMap: Record<string, { product: Product; quantity: number; revenue: number }> = {};
  const paymentMethodMap: Record<PaymentMethod, { count: number; total: number }> = {
    cash: { count: 0, total: 0 },
    qris: { count: 0, total: 0 },
    debit: { count: 0, total: 0 },
    transfer: { count: 0, total: 0 }
  };

  // Hourly distribution (0-23 hours)
  const hourlySales = Array.from({ length: 24 }, (_, i) => ({
    hour: `${String(i).padStart(2, '0')}:00`,
    sales: 0,
    orders: 0
  }));

  filteredOrders.forEach((order) => {
    // Payment method
    if (paymentMethodMap[order.paymentMethod]) {
      paymentMethodMap[order.paymentMethod].count += 1;
      paymentMethodMap[order.paymentMethod].total += order.total;
    }

    // Hourly
    const hour = new Date(order.createdAt).getHours();
    hourlySales[hour].sales += order.total;
    hourlySales[hour].orders += 1;

    // Items
    order.items.forEach((item) => {
      totalItemsSold += item.quantity;
      const cost = (item.product.costPrice || 0) * item.quantity;
      totalCost += cost;

      if (!productSalesMap[item.product.id]) {
        productSalesMap[item.product.id] = {
          product: item.product,
          quantity: 0,
          revenue: 0
        };
      }
      productSalesMap[item.product.id].quantity += item.quantity;
      productSalesMap[item.product.id].revenue += item.product.price * item.quantity;
    });
  });

  const grossProfit = Math.max(0, totalSubtotal - totalCost);
  const profitMarginPercent = totalSubtotal > 0 ? (grossProfit / totalSubtotal) * 100 : 0;

  // Top selling products sorted by quantity
  const topProducts = Object.values(productSalesMap)
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5);

  return {
    totalSales: Number(totalSales.toFixed(2)),
    totalSubtotal: Number(totalSubtotal.toFixed(2)),
    totalTax: Number(totalTax.toFixed(2)),
    totalDiscount: Number(totalDiscount.toFixed(2)),
    totalCost: Number(totalCost.toFixed(2)),
    grossProfit: Number(grossProfit.toFixed(2)),
    profitMarginPercent: Number(profitMarginPercent.toFixed(1)),
    totalOrders,
    totalItemsSold,
    avgOrderValue: Number(avgOrderValue.toFixed(2)),
    topProducts,
    paymentMethodMap,
    hourlySales
  };
}

/**
 * Generates ESC/POS thermal printer byte array commands.
 * Compatible with standard 58mm and 80mm Bluetooth/USB thermal receipt printers.
 */
export function generateThermalESCCommands(
  order: Order,
  settings: StoreSettings
): Uint8Array {
  const encoder = new TextEncoder();
  const chunks: Uint8Array[] = [];

  // ESC/POS Commands
  const ESC = 0x1b;
  const GS = 0x1d;

  // Initialize printer
  chunks.push(new Uint8Array([ESC, 0x40]));

  // Align Center
  chunks.push(new Uint8Array([ESC, 0x61, 0x01]));

  // Double height & width for store title
  chunks.push(new Uint8Array([GS, 0x21, 0x11]));
  chunks.push(encoder.encode(`${settings.storeName}\n`));

  // Normal font
  chunks.push(new Uint8Array([GS, 0x21, 0x00]));
  if (settings.tagline) {
    chunks.push(encoder.encode(`${settings.tagline}\n`));
  }
  chunks.push(encoder.encode(`${settings.address}\n`));
  chunks.push(encoder.encode(`Telp: ${settings.phone}\n`));

  const separator = settings.printer.paperWidth === '80mm'
    ? '================================================\n'
    : '--------------------------------\n';
  chunks.push(encoder.encode(separator));

  // Align Left
  chunks.push(new Uint8Array([ESC, 0x61, 0x00]));
  chunks.push(encoder.encode(`No. Struk : ${order.invoiceNumber}\n`));
  chunks.push(encoder.encode(`Tanggal   : ${new Date(order.createdAt).toLocaleString('id-ID')}\n`));
  chunks.push(encoder.encode(`Kasir     : ${order.cashierName}\n`));
  if (order.customerName) {
    chunks.push(encoder.encode(`Pelanggan : ${order.customerName}\n`));
  }
  chunks.push(encoder.encode(separator));

  // Items table
  order.items.forEach((item) => {
    const itemTotal = (item.product.price * item.quantity);
    chunks.push(encoder.encode(`${item.product.name}\n`));
    const qtyPrice = `  ${item.quantity} x ${formatCurrency(item.product.price, settings.currency)}`;
    const totalStr = formatCurrency(itemTotal, settings.currency);
    const lineLen = settings.printer.paperWidth === '80mm' ? 48 : 32;
    const spaces = Math.max(1, lineLen - qtyPrice.length - totalStr.length);
    chunks.push(encoder.encode(qtyPrice + ' '.repeat(spaces) + totalStr + '\n'));
  });

  chunks.push(encoder.encode(separator));

  // Totals
  const printRow = (label: string, value: string) => {
    const lineLen = settings.printer.paperWidth === '80mm' ? 48 : 32;
    const spaces = Math.max(1, lineLen - label.length - value.length);
    chunks.push(encoder.encode(label + ' '.repeat(spaces) + value + '\n'));
  };

  printRow('Subtotal', formatCurrency(order.subtotal, settings.currency));
  if (order.taxAmount > 0) {
    printRow(`Pajak (${(order.taxRate * 100).toFixed(0)}%)`, formatCurrency(order.taxAmount, settings.currency));
  }
  if (order.discountAmount > 0) {
    printRow('Diskon', `-${formatCurrency(order.discountAmount, settings.currency)}`);
  }

  // Bold Total
  chunks.push(new Uint8Array([ESC, 0x45, 0x01])); // Bold ON
  printRow('TOTAL', formatCurrency(order.total, settings.currency));
  chunks.push(new Uint8Array([ESC, 0x45, 0x00])); // Bold OFF

  printRow(`Bayar (${order.paymentMethod.toUpperCase()})`, formatCurrency(order.amountPaid, settings.currency));
  printRow('Kembalian', formatCurrency(order.change, settings.currency));

  chunks.push(encoder.encode(separator));

  // Align Center
  chunks.push(new Uint8Array([ESC, 0x61, 0x01]));
  chunks.push(encoder.encode(`${settings.receiptFooter || 'Terima kasih atas kunjungan Anda!'}\n`));
  chunks.push(encoder.encode('Simpan struk ini sebagai bukti pembayaran\n\n\n'));

  // Paper cut command (GS V 66 0)
  chunks.push(new Uint8Array([GS, 0x56, 0x42, 0x00]));

  // Combine chunks into single Uint8Array
  const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;
  for (const chunk of chunks) {
    result.set(chunk, offset);
    offset += chunk.length;
  }

  return result;
}

/**
 * Exports data table to Excel CSV Blob with UTF-8 BOM for clean Indonesian / currency display.
 */
export function exportOrdersToExcel(orders: Order[], currency: 'IDR' | 'USD' = 'IDR'): Blob {
  const headers = [
    'Nomor Invoice',
    'Tanggal & Waktu',
    'Kasir',
    'Pelanggan',
    'Item Terjual',
    'Metode Pembayaran',
    'Subtotal',
    'Pajak',
    'Diskon',
    'Total Transaksi',
    'Nominal Bayar',
    'Kembalian',
    'Status'
  ];

  const rows = orders.map((o) => [
    `"${o.invoiceNumber}"`,
    `"${new Date(o.createdAt).toLocaleString('id-ID')}"`,
    `"${o.cashierName}"`,
    `"${o.customerName || 'Pelanggan Umum'}"`,
    `"${o.items.map((i) => `${i.product.name} (x${i.quantity})`).join(', ')}"`,
    `"${o.paymentMethod.toUpperCase()}"`,
    o.subtotal,
    o.taxAmount,
    o.discountAmount,
    o.total,
    o.amountPaid,
    o.change,
    `"${o.status}"`
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
  return new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
}

/**
 * Exports inventory products list to Excel CSV Blob.
 */
export function exportInventoryToExcel(products: Product[]): Blob {
  const headers = [
    'SKU',
    'Barcode',
    'Nama Produk',
    'Kategori',
    'Satuan',
    'Harga Modal (HPP)',
    'Harga Jual',
    'Stok Saat Ini',
    'Batas Minimum Alert',
    'Status Stok'
  ];

  const rows = products.map((p) => {
    const status = p.stock === 0 ? 'Habis' : p.stock <= p.minStockAlert ? 'Menipis' : 'Aman';
    return [
      `"${p.sku}"`,
      `"${p.barcode}"`,
      `"${p.name}"`,
      `"${p.category}"`,
      `"${p.unit}"`,
      p.costPrice,
      p.price,
      p.stock,
      p.minStockAlert,
      `"${status}"`
    ];
  });

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
  return new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
}
