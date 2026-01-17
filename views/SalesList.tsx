
import React, { useState } from 'react';
import { Sale, PeriodFilter } from '../types';
import { APP_CONFIG } from '../constants';

interface SalesListProps {
  sales: Sale[];
  onBack: () => void;
}

const SalesList: React.FC<SalesListProps> = ({ sales, onBack }) => {
  const [filter, setFilter] = useState<PeriodFilter>('today');

  const filteredSales = sales.filter(sale => {
    const now = new Date();
    const saleDate = new Date(sale.timestamp);
    
    if (filter === 'today') {
      return saleDate.toDateString() === now.toDateString();
    }
    if (filter === 'week') {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(now.getDate() - 7);
      return saleDate >= oneWeekAgo;
    }
    if (filter === 'month') {
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(now.getMonth() - 1);
      return saleDate >= oneMonthAgo;
    }
    return true;
  });

  const totalAmount = filteredSales.reduce((sum, s) => sum + s.total, 0);
  const averageBasket = filteredSales.length ? Math.round(totalAmount / filteredSales.length) : 0;

  return (
    <div className="min-h-screen bg-[#f8fafc] font-['Inter'] antialiased">
      {/* Sticky Header with Backdrop Blur */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#e2e8f0] transition-colors duration-200">
        <div className="max-w-[960px] mx-auto px-4 md:px-10 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-[#eff6ff] rounded-[0.75rem] text-[#245feb]">
              <span className="material-symbols-outlined !text-[24px]">storefront</span>
            </div>
            <span className="text-[1.125rem] font-bold tracking-tight text-[#0f172a]">ShopManager</span>
          </div>
          
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-[#64748b] font-bold text-[0.875rem] px-4 py-2 bg-white border border-[#e2e8f0] rounded-full shadow-sm hover:bg-[#f9fafb] hover:text-[#0f172a] transition-all group"
          >
            <span className="material-symbols-outlined !text-[18px] transition-transform group-hover:-translate-x-1">arrow_back</span>
            Retour
          </button>
        </div>
      </header>

      <main className="max-w-[960px] mx-auto px-4 py-8 md:py-12">
        {/* Page Title Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-[1.875rem] md:text-[2.25rem] font-black text-[#0f172a] tracking-tight">Mes ventes</h1>
            <p className="text-[1rem] text-[#64748b]">Gérez votre historique de transactions</p>
          </div>
          
          <div className="hidden md:block">
            <button className="flex items-center gap-2 bg-[#245feb] text-white px-4 py-2 rounded-[0.5rem] text-[0.875rem] font-bold shadow-[0_10px_15px_-3px_rgba(36,95,235,0.2)] hover:bg-[#1d4ed8] hover:-translate-y-0.5 transition-all">
              <span className="material-symbols-outlined !text-[20px]">download</span>
              Exporter
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {/* Total Stat Card */}
          <div className="bg-white p-5 rounded-[1rem] border border-[#e2e8f0] shadow-custom-soft flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="text-[0.875rem] font-semibold text-[#64748b]">Total ({filter === 'today' ? '24h' : filter === 'week' ? '7j' : '30j'})</span>
              <div className="p-1.5 bg-[#ecfdf5] text-[#059669] rounded-[0.5rem]">
                <span className="material-symbols-outlined !text-[20px]">payments</span>
              </div>
            </div>
            <div className="flex items-baseline gap-1 mt-2">
              <span className="text-[1.875rem] font-extrabold text-[#0f172a] tracking-tight">{totalAmount.toLocaleString()}</span>
              <span className="text-[0.875rem] font-bold text-[#94a3b8] uppercase tracking-wide">{APP_CONFIG.currency}</span>
            </div>
          </div>

          {/* Average Basket Stat Card */}
          <div className="bg-white p-5 rounded-[1rem] border border-[#e2e8f0] shadow-custom-soft flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="text-[0.875rem] font-semibold text-[#64748b]">Panier moyen</span>
              <div className="p-1.5 bg-[#eff6ff] text-[#2563eb] rounded-[0.5rem]">
                <span className="material-symbols-outlined !text-[20px]">analytics</span>
              </div>
            </div>
            <div className="flex items-baseline gap-1 mt-2">
              <span className="text-[1.875rem] font-extrabold text-[#0f172a] tracking-tight">{averageBasket.toLocaleString()}</span>
              <span className="text-[0.875rem] font-bold text-[#94a3b8] uppercase tracking-wide">{APP_CONFIG.currency}</span>
            </div>
          </div>

          {/* Item Count Stat Card */}
          <div className="bg-white p-5 rounded-[1rem] border border-[#e2e8f0] shadow-custom-soft flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="text-[0.875rem] font-semibold text-[#64748b]">Articles vendus</span>
              <div className="p-1.5 bg-[#fff7ed] text-[#ea580c] rounded-[0.5rem]">
                <span className="material-symbols-outlined !text-[20px]">inventory_2</span>
              </div>
            </div>
            <div className="flex items-baseline gap-1 mt-2">
              <span className="text-[1.875rem] font-extrabold text-[#0f172a] tracking-tight">{filteredSales.length}</span>
              <span className="text-[0.875rem] font-bold text-[#94a3b8] uppercase tracking-wide">Transactions</span>
            </div>
          </div>
        </div>

        {/* Filters and List Section */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h3 className="text-[1.25rem] font-bold text-[#0f172a]">Transactions récentes</h3>
            
            {/* Tabs Pill Container */}
            <div className="inline-flex bg-[#f3f4f6] p-1 rounded-full border border-[#e5e7eb] shadow-inner self-start">
              <button 
                onClick={() => setFilter('today')}
                className={`px-5 py-1.5 text-[0.875rem] font-bold rounded-full transition-all ${filter === 'today' ? 'bg-white text-[#0f172a] shadow-sm ring-1 ring-black/5' : 'text-[#64748b] hover:text-[#0f172a]'}`}
              >
                Aujourd'hui
              </button>
              <button 
                onClick={() => setFilter('week')}
                className={`px-5 py-1.5 text-[0.875rem] font-bold rounded-full transition-all ${filter === 'week' ? 'bg-white text-[#0f172a] shadow-sm ring-1 ring-black/5' : 'text-[#64748b] hover:text-[#0f172a]'}`}
              >
                Semaine
              </button>
              <button 
                onClick={() => setFilter('month')}
                className={`px-5 py-1.5 text-[0.875rem] font-bold rounded-full transition-all ${filter === 'month' ? 'bg-white text-[#0f172a] shadow-sm ring-1 ring-black/5' : 'text-[#64748b] hover:text-[#0f172a]'}`}
              >
                Mois
              </button>
            </div>
          </div>

          {/* Transactions List */}
          <div className="flex flex-col gap-3">
            {filteredSales.length === 0 ? (
              <div className="py-16 text-center bg-white rounded-[1rem] border border-dashed border-[#e2e8f0]">
                <span className="material-symbols-outlined !text-[48px] text-[#cbd5e1] mb-2">history</span>
                <p className="text-[#94a3b8] font-medium italic">Aucune vente enregistrée pour cette période.</p>
              </div>
            ) : (
              filteredSales.map((sale) => (
                <div 
                  key={sale.id} 
                  className="group bg-white p-5 rounded-[1rem] border border-[#e2e8f0] shadow-custom-card flex items-center gap-5 hover:shadow-custom-cardHover hover:-translate-y-0.5 hover:border-[rgba(36,95,235,0.2)] transition-all cursor-pointer"
                >
                  <div className="flex-shrink-0 h-12 w-12 rounded-full bg-[#f8fafc] flex items-center justify-center text-[1.5rem] border border-[#e2e8f0] group-hover:bg-[#eff6ff] transition-colors">
                    {sale.emoji || '🛒'}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[1rem] font-bold text-[#0f172a] truncate group-hover:text-[#245feb] transition-colors">{sale.product}</h4>
                    <p className="text-[0.875rem] text-[#64748b] truncate">
                      {sale.quantity} unité{sale.quantity > 1 ? 's' : ''} × {sale.unitPrice.toLocaleString()} {APP_CONFIG.currency}
                    </p>
                  </div>
                  
                  <div className="flex flex-col items-end gap-1">
                    <div className="text-[1.125rem] font-[900] text-[#059669] tracking-tight">
                      {sale.total.toLocaleString()} <span className="text-[0.75rem] font-bold">{APP_CONFIG.currency}</span>
                    </div>
                    <div className="text-[0.75rem] font-semibold text-[#9ca3af]">
                      {new Date(sale.timestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Load More Button */}
          {filteredSales.length > 0 && (
            <div className="mt-4 flex justify-center">
              <button className="flex items-center gap-2 px-6 py-3 bg-white border border-[#e2e8f0] text-[#64748b] rounded-full text-[0.875rem] font-bold shadow-sm hover:shadow-md hover:text-[#245feb] hover:border-[#245feb] transition-all group">
                Charger plus de ventes
                <span className="material-symbols-outlined !text-[18px] group-hover:rotate-180 transition-transform duration-500">refresh</span>
              </button>
            </div>
          )}
        </div>

        {/* Footer Tagline */}
        <footer className="mt-20 text-center opacity-40">
           <p className="text-[10px] text-[#4d6499] uppercase tracking-[0.2em] font-black">
             ShopManager • Gestion moderne et intuitive
           </p>
        </footer>
      </main>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default SalesList;
