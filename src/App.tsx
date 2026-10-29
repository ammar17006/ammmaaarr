import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { InventoryView } from './components/InventoryView';
import { ReportsView } from './components/ReportsView';
import { OrdersView } from './components/OrdersView';
import { CustomersView } from './components/CustomersView';
import { UsersView } from './components/UsersView';
import { SettingsView } from './components/SettingsView';
import { ReturnsView } from './components/ReturnsView';
import { DiscountsView } from './components/DiscountsView';
import { CheckoutModal } from './components/CheckoutModal';
import { ReceiptModal } from './components/ReceiptModal';
import { PrinterModal } from './components/PrinterModal';
import { MobileCartDrawer } from './components/MobileCartDrawer';

const AppContent: React.FC = () => {
  const { activeView } = useApp();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileCartOpen, setIsMobileCartOpen] = useState(false);
  const [isPrinterModalOpen, setIsPrinterModalOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[#f8fafc] text-gray-800 font-sans antialiased overflow-hidden">
      {/* Sidebar (Desktop & Mobile Drawer) */}
      <Sidebar
        isMobileOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Header */}
        <Header
          onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          onOpenMobileCart={() => setIsMobileCartOpen(true)}
          onOpenPrinterModal={() => setIsPrinterModalOpen(true)}
        />

        {/* Dynamic Page Views */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-7 custom-scrollbar">
          {(activeView === 'dashboard' || activeView === 'sales') && <DashboardView />}
          {activeView === 'products' && <InventoryView />}
          {activeView === 'reports' && <ReportsView />}
          {activeView === 'orders' && <OrdersView />}
          {activeView === 'customers' && <CustomersView />}
          {activeView === 'users' && <UsersView />}
          {activeView === 'settings' && <SettingsView />}
          {activeView === 'returns' && <ReturnsView />}
          {activeView === 'discounts' && <DiscountsView />}
        </main>
      </div>

      {/* Global Interactive Modals */}
      <CheckoutModal />
      <ReceiptModal />
      <PrinterModal
        isOpen={isPrinterModalOpen}
        onClose={() => setIsPrinterModalOpen(false)}
      />
      <MobileCartDrawer
        isOpen={isMobileCartOpen}
        onClose={() => setIsMobileCartOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
