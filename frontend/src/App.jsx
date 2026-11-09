import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { OwnerDashboard } from './components/owner/OwnerDashboard';
import { TenantDashboard } from './components/tenant/TenantDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { PaymentModal } from './components/common/PaymentModal';
import { ReceiptModal } from './components/common/ReceiptModal';
import { Building2, Sparkles, BookOpen, GitBranch } from 'lucide-react';

const DashboardSwitch = () => {
  const { currentRole } = useApp();

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
      {currentRole === 'owner' && <OwnerDashboard />}
      {currentRole === 'tenant' && <TenantDashboard />}
      {currentRole === 'admin' && <AdminDashboard />}
    </main>
  );
};

export function App() {
  return (
    <AppProvider>
      <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-brand-500 selection:text-white">
        
        {/* Top subtle college project demo pill */}
        <div className="bg-slate-900 text-slate-300 px-4 py-1.5 text-[11px] text-center border-b border-slate-800 flex items-center justify-center space-x-3">
          <span className="inline-flex items-center space-x-1 font-semibold text-brand-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>RentEase Academic Capstone</span>
          </span>
          <span className="text-slate-500 hidden sm:inline">•</span>
          <span className="hidden sm:inline">PG & Rental Property Operating Platform</span>
          <span className="text-slate-500 hidden md:inline">•</span>
          <span className="text-emerald-400 font-mono hidden md:inline">React + TailwindCSS + Recharts</span>
        </div>

        {/* Global Navigation */}
        <Navbar />

        {/* Main Dashboard Area */}
        <div className="flex-1">
          <DashboardSwitch />
        </div>

        {/* Global Modals */}
        <PaymentModal />
        <ReceiptModal />

        {/* Academic Project Footer */}
        <footer className="bg-white border-t border-slate-200 mt-12 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded-lg bg-brand-600 flex items-center justify-center text-white text-[11px] font-bold">
                RE
              </div>
              <span className="font-bold text-slate-800">RentEase</span>
              <span>— Connecting PG Owners with Tenants</span>
            </div>
            <div className="flex items-center space-x-6 text-slate-400">
              <span>Full-Stack Architecture</span>
              <span>Role-Based Access Control</span>
              <span>Mock Payment Gateway</span>
            </div>
          </div>
        </footer>

      </div>
    </AppProvider>
  );
}

export default App;
