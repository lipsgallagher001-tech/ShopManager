
import React, { useState, useRef, useEffect } from 'react';
import { Card } from '../components/UI';
import { User, Sale } from '../types';
import { APP_CONFIG } from '../constants';
import { StorageService } from '../services/storage';

interface DashboardProps {
  user: User;
  sales: Sale[];
  onNewSale: () => void;
  onViewSales: () => void;
  onViewSummary: () => void;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, sales, onNewSale, onViewSales, onViewSummary, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const today = new Date();
  const dateFormatted = today.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  // Fermer le menu si on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    StorageService.logout();
    onLogout();
  };

  // Calcul du total du jour
  const todayStart = new Date().setHours(0, 0, 0, 0);
  const dailyTotal = sales
    .filter(s => s.timestamp >= todayStart)
    .reduce((sum, s) => sum + s.total, 0);

  return (
    <div className="min-h-screen bg-[#f8f9fc] flex flex-col items-center">
      {/* Navbar Design System implementation for Dashboard */}
      <header className="sticky top-0 z-[50] w-full bg-[rgba(255,255,255,0.8)] backdrop-blur-[12px] border-b border-[#e2e8f0] transition-colors duration-200">
        <div className="max-w-[960px] mx-auto px-6 py-4 flex items-center justify-between">
          
          {/* Left Section: Logo + Brand */}
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="flex h-10 w-10 items-center justify-center rounded-[0.75rem] bg-[#245feb] text-white shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] transition-transform duration-200 group-hover:scale-105">
              <span className="material-symbols-outlined !text-[1.5rem]">leaderboard</span>
            </div>
            <span className="text-[1.25rem] font-[800] tracking-[-0.025em] leading-tight text-[#0f172a]">
              ShopKeeper
            </span>
          </div>
          
          {/* Right Section: Settings Button Developed */}
          <div className="relative" ref={menuRef}>
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`flex h-10 w-10 items-center justify-center rounded-full transition-all duration-200 ${
                isMenuOpen ? 'bg-[#245feb] text-white shadow-md' : 'bg-[#f1f5f9] text-[#0f172a] hover:bg-[#e2e8f0]'
              }`}
              aria-label="Paramètres"
            >
              <span className={`material-symbols-outlined !text-[1.25rem] transition-transform duration-300 ${isMenuOpen ? 'rotate-90' : 'rotate-0'}`}>
                settings
              </span>
            </button>

            {/* Dropdown Menu */}
            {isMenuOpen && (
              <div className="absolute right-0 mt-3 w-56 bg-white rounded-[1.25rem] shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1),0_8px_10px_-6px_rgba(0,0,0,0.1)] border border-[#f1f5f9] py-2 z-[100] animate-[scaleIn_0.2s_ease-out] origin-top-right">
                <div className="px-4 py-3 border-b border-[#f1f5f9] mb-1">
                  <p className="text-[0.75rem] font-bold text-[#94a3b8] uppercase tracking-widest">Utilisateur</p>
                  <p className="text-[0.875rem] font-extrabold text-[#0f172a] truncate">{user.name}</p>
                </div>
                
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left text-[#ef4444] hover:bg-[#fef2f2] transition-colors group"
                >
                  <div className="w-8 h-8 rounded-full bg-[#fef2f2] flex items-center justify-center group-hover:bg-[#fee2e2] transition-colors">
                    <span className="material-symbols-outlined !text-[18px]">logout</span>
                  </div>
                  <span className="font-bold text-[0.875rem]">Se déconnecter</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="w-full max-w-[600px] px-4 pb-12 flex flex-col items-center">
        {/* Date Pill */}
        <div className="mt-8 mb-6 animate-stagger-1">
          <div className="inline-flex items-center gap-2 bg-white border border-[#e2e8f0] rounded-full px-5 py-2 shadow-sm">
             <span className="material-symbols-outlined text-[#245feb] !text-[18px]">calendar_today</span>
             <span className="text-sm font-semibold text-[#4d6499] capitalize">{dateFormatted}</span>
          </div>
        </div>

        {/* Greeting Section */}
        <div className="text-center mb-10 animate-stagger-2">
          <h1 className="text-[2.25rem] md:text-[3rem] font-[900] text-[#0e121b] leading-tight tracking-[-0.033em]">
            Bonjour, {user.name}
          </h1>
          <p className="text-[1.125rem] md:text-[1.25rem] text-[#4d6499] font-medium mt-1">
            {user.shopName}
          </p>
        </div>

        {/* Hero Card Metric */}
        <Card className="w-full text-center mb-10 !p-8 md:!p-10 !border-[#e2e8f0] !shadow-soft animate-stagger-3 hover:!border-[rgba(36,95,235,0.2)] transition-colors">
          <p className="text-[1.125rem] font-medium text-[#0e121b] mb-4">Ventes d'aujourd'hui</p>
          <div className="flex items-baseline justify-center gap-2 mb-4">
            <span className="text-[3.5rem] md:text-[4.5rem] font-[900] text-[#0e121b] tracking-tighter leading-none drop-shadow-sm">
              {dailyTotal.toLocaleString()}
            </span>
            <span className="text-2xl font-bold text-[#0e121b] opacity-80">{APP_CONFIG.currency}</span>
          </div>
          
          {dailyTotal > 0 && (
            <div className="inline-flex items-center gap-1.5 bg-[#d1fae5] border border-[#a7f3d0] text-[#10B981] px-4 py-2 rounded-[0.5rem] animate-[fadeIn_0.5s_ease-out]">
              <span className="material-symbols-outlined !text-[18px] font-bold">trending_up</span>
              <span className="text-[0.75rem] font-[900] tracking-widest uppercase">Bon démarrage</span>
            </div>
          )}
        </Card>

        {/* Action Buttons Section */}
        <div className="w-full flex flex-col gap-5">
           {/* Massive Primary Action */}
           <button 
             onClick={onNewSale}
             className="w-full bg-[#245feb] text-white h-[5rem] md:h-[6rem] rounded-[1rem] flex items-center justify-center gap-3 shadow-glow transition-all duration-300 hover:bg-[#1d4ed8] hover:-translate-y-1 active:scale-[0.98] active:bg-[#1e40af] animate-stagger-4 group"
           >
             <div className="w-10 h-10 md:w-12 md:h-12 bg-white/20 rounded-full flex items-center justify-center transition-transform group-hover:scale-110">
               <span className="material-symbols-outlined !text-[24px] md:!text-[28px] font-bold">add</span>
             </div>
             <span className="text-[1.25rem] md:text-[1.5rem] font-bold tracking-tight">Nouvelle vente</span>
           </button>
           
           {/* Secondary Actions Row */}
           <div className="grid grid-cols-2 gap-4 animate-stagger-5">
             <button 
                onClick={onViewSales}
                className="bg-[#e7ebf3] text-[#0e121b] h-[3.5rem] rounded-[0.75rem] flex items-center justify-center gap-2 font-bold text-sm md:text-base hover:bg-[#e2e6ef] transition-colors group"
             >
               <span className="material-symbols-outlined text-[#64748b] group-hover:text-[#245feb] transition-colors !text-[20px]">list_alt</span>
               Voir les ventes
             </button>
             <button 
                onClick={onViewSummary}
                className="bg-[#e7ebf3] text-[#0e121b] h-[3.5rem] rounded-[0.75rem] flex items-center justify-center gap-2 font-bold text-sm md:text-base hover:bg-[#e2e6ef] transition-colors group"
             >
               <span className="material-symbols-outlined text-[#64748b] group-hover:text-[#245feb] transition-colors !text-[20px]">leaderboard</span>
               Résumé
             </button>
           </div>
        </div>

        {/* Decorative Footer Tagline */}
        <footer className="mt-16 text-center animate-stagger-5 opacity-40">
           <p className="text-[10px] text-[#4d6499] uppercase tracking-[0.2em] font-black">
             ShopKeeper • Radical Simplicity
           </p>
        </footer>
      </main>
    </div>
  );
};

export default Dashboard;
