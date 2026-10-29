import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateCartTotals,
  calculateChange,
  formatCurrency,
  generateInvoiceNumber,
  calculateReportMetrics,
  generateThermalESCCommands
} from './rules';
import { CartItem, Order, Product, StoreSettings } from '../types';

const sampleProductA: Product = {
  id: 'p1',
  name: 'Cappuccino',
  category: 'Coffee',
  price: 25000,
  costPrice: 12000,
  stock: 50,
  minStockAlert: 10,
  sku: 'COF-CAP-01',
  barcode: '899123456001',
  image: 'https://images.unsplash.com/photo-1572442388796-11668ba67e53?w=500',
  unit: 'cup'
};

const sampleProductB: Product = {
  id: 'p2',
  name: 'Bagel',
  category: 'Food',
  price: 20000,
  costPrice: 8000,
  stock: 20,
  minStockAlert: 5,
  sku: 'FD-BGL-01',
  barcode: '899123456002',
  image: 'https://images.unsplash.com/photo-1585478259715-876acc5be8eb?w=500',
  unit: 'pcs'
};

test('calculateCartTotals computes subtotal, tax and total correctly', () => {
  const items: CartItem[] = [
    { product: sampleProductA, quantity: 2 }, // 2 * 25000 = 50000
    { product: sampleProductB, quantity: 1 }  // 1 * 20000 = 20000
  ];
  // Subtotal = 70000, Tax (10%) = 7000, Total = 77000
  const totals = calculateCartTotals(items, 0.1, 0);
  assert.equal(totals.subtotal, 70000);
  assert.equal(totals.taxAmount, 7000);
  assert.equal(totals.total, 77000);
  assert.equal(totals.itemCount, 3);
});

test('calculateCartTotals handles discount properly', () => {
  const items: CartItem[] = [
    { product: sampleProductA, quantity: 1 } // 25000
  ];
  // Subtotal 25000 - 5000 discount = 20000, 10% tax = 2000, Total = 22000
  const totals = calculateCartTotals(items, 0.1, 5000);
  assert.equal(totals.subtotal, 25000);
  assert.equal(totals.taxAmount, 2000);
  assert.equal(totals.total, 22000);
});

test('calculateChange returns correct change and 0 if underpaid', () => {
  assert.equal(calculateChange(100000, 77000), 23000);
  assert.equal(calculateChange(50000, 77000), 0);
  assert.equal(calculateChange(77000, 77000), 0);
});

test('formatCurrency formats IDR and USD accurately', () => {
  const formattedIdr = formatCurrency(50000, 'IDR');
  assert.ok(formattedIdr.includes('50.000') || formattedIdr.includes('Rp'));

  const formattedUsd = formatCurrency(50, 'USD');
  assert.ok(formattedUsd.includes('$50.00'));
});

test('generateInvoiceNumber formats correctly with date and sequence', () => {
  const inv = generateInvoiceNumber(42);
  assert.ok(inv.startsWith('TRX-'));
  assert.ok(inv.endsWith('-0042'));
});

test('calculateReportMetrics aggregates gross profit and payment stats', () => {
  const sampleOrder: Order = {
    id: 'ord-1',
    invoiceNumber: 'TRX-20261028-0001',
    items: [
      { product: sampleProductA, quantity: 2 }, // revenue: 50000, cost: 24000
      { product: sampleProductB, quantity: 1 }  // revenue: 20000, cost: 8000
    ],
    subtotal: 70000,
    taxAmount: 7000,
    taxRate: 0.1,
    discountAmount: 0,
    total: 77000,
    paymentMethod: 'cash',
    amountPaid: 80000,
    change: 3000,
    cashierId: 'u1',
    cashierName: 'John Doe',
    createdAt: new Date().toISOString(),
    status: 'completed',
    isSynced: true
  };

  const metrics = calculateReportMetrics([sampleOrder]);
  assert.equal(metrics.totalOrders, 1);
  assert.equal(metrics.totalSales, 77000);
  assert.equal(metrics.totalCost, 32000);
  assert.equal(metrics.grossProfit, 38000); // 70000 - 32000
  assert.equal(metrics.paymentMethodMap.cash.count, 1);
  assert.equal(metrics.topProducts.length, 2);
  assert.equal(metrics.topProducts[0].product.name, 'Cappuccino');
});

test('generateThermalESCCommands produces valid ESC/POS byte sequence', () => {
  const mockSettings: StoreSettings = {
    storeName: 'PosyMart Coffee & Bakery',
    tagline: 'Best Brew in Town',
    address: 'Jl. Merdeka No. 123',
    phone: '0812-3456-7890',
    email: 'info@posymart.com',
    currency: 'IDR',
    taxRate: 0.1,
    enableTax: true,
    receiptHeader: 'Selamat Datang',
    receiptFooter: 'Terima kasih atas kunjungan Anda!',
    printer: {
      type: 'bluetooth',
      paperWidth: '58mm',
      autoPrintOnCheckout: true,
      isConnected: false
    },
    autoCloudBackup: true
  };

  const sampleOrder: Order = {
    id: 'ord-1',
    invoiceNumber: 'TRX-20261028-0001',
    items: [{ product: sampleProductA, quantity: 1 }],
    subtotal: 25000,
    taxAmount: 2500,
    taxRate: 0.1,
    discountAmount: 0,
    total: 27500,
    paymentMethod: 'cash',
    amountPaid: 30000,
    change: 2500,
    cashierId: 'u1',
    cashierName: 'John Doe',
    createdAt: new Date().toISOString(),
    status: 'completed',
    isSynced: true
  };

  const escBytes = generateThermalESCCommands(sampleOrder, mockSettings);
  assert.ok(escBytes instanceof Uint8Array);
  assert.ok(escBytes.length > 50); // Valid non-empty thermal sequence
  // Starts with ESC @ (0x1b, 0x40)
  assert.equal(escBytes[0], 0x1b);
  assert.equal(escBytes[1], 0x40);
});
