
import React from 'react';
import { Sale } from '../types';
import { APP_CONFIG } from '../constants';

interface SummaryProps {
  sales: Sale[];
  onBack: () => void;
}

const Summary: React.FC<SummaryProps> = ({ sales, onBack }) => {
  const now = new Date();
  
  // Calculs par périodes
  const todayStart = new Date().setHours(0, 0, 0, 0);
  const weekStart = new Date();
  weekStart.setDate(now.getDate() - 7);
  weekStart.setHours(0, 0, 0, 0);
  
  const monthStart = new Date();
  monthStart.setMonth(now.getMonth() - 1);
  monthStart.setHours(0, 0, 0, 0);

  const getSum = (startTime: number) => 
    sales.filter(s => s.timestamp >= startTime).reduce((sum, s) => sum + s.total, 0);

  const stats = [
    { 
      label: "AUJOURD'HUI", 
      amount: getSum(todayStart), 
      variant: 'emerald',
      icon: 'today',
      dot: true
    },
    { 
      label: "CETTE SEMAINE", 
      amount: getSum(weekStart.getTime()), 
      variant: 'blue',
      icon: 'date_range'
    },
    { 
      label: "CE MOIS", 
      amount: getSum(monthStart.getTime()), 
      variant: 'purple',
      icon: 'calendar_month'
    },
  ];

  const variants = {
    emerald: {
      bg: 'bg-[#ffffff]',
      border: 'border-[#f1f5f9]',
      glow: 'bg-[#ecfdf5]',
      badgeBg: 'bg-[#ecfdf5]',
      badgeText: 'text-[#047857]',
      dotBg: 'bg-[#10b981]',
      icon: 'text-[#059669]'
    },
    blue: {
      bg: 'bg-[#ffffff]',
      border: 'border-[#f1f5f9]',
      glow: 'bg-[#eff6ff]',
      badgeBg: 'bg-[#eff6ff]',
      badgeText: 'text-[#1d4ed8]',
      dotBg: 'bg-[#60a5fa]',
      icon: 'text-[#2563eb]'
    },
    purple: {
      bg: 'bg-[#ffffff]',
      border: 'border-[#f1f5f9]',
      glow: 'bg-[#faf5ff]',
      badgeBg: 'bg-[#faf5ff]',
      badgeText: 'text-[#7e22ce]',
      dotBg: 'bg-[#c084fc]',
      icon: 'text-[#9333ea]'
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] font-['Inter'] antialiased overflow-x-hidden">
      {/* Sticky Navbar implementation from Sales App Navbar Design System */}
      <header className="sticky top-0 z-[50] w-full bg-[rgba(255,255,255,0.8)] backdrop-blur-[12px] border-b border-[#e2e8f0] transition-colors duration-200">
        <div className="max-w-[72rem] mx-auto px-6 py-4 flex items-center justify-between">
          
          {/* Left Section: Logo + Brand */}
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="flex h-10 w-10 items-center justify-center rounded-[0.75rem] bg-[#245feb] text-white shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] transition-transform duration-200 group-hover:scale-105">
              <span className="material-symbols-outlined !text-[1.5rem]">leaderboard</span>
            </div>
            <span className="text-[1.25rem] font-[800] tracking-[-0.025em] leading-tight text-[#0f172a]">
              ShopKeeper
            </span>
          </div>
          
          {/* Right Section: Back Action (Styled as per reference image) */}
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-[#64748b] bg-white border border-[#e2e8f0] px-5 py-2 rounded-full shadow-sm hover:text-[#0f172a] hover:border-[#cbd5e1] hover:shadow-md transition-all duration-200 group"
            aria-label="Retour au Dashboard"
          >
            <span className="material-symbols-outlined !text-[20px] transition-transform duration-200 group-hover:-translate-x-1">
              arrow_back
            </span>
            <span className="text-[0.875rem] font-bold">Retour</span>
          </button>
        </div>
      </header>

      <main className="max-w-[72rem] mx-auto px-4 md:px-8 py-12">
        {/* Page Header */}
        <div className="flex flex-col gap-3 mb-12 animate-stagger-1">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-[2.25rem] md:text-[3rem] font-[800] text-[#0f172a] leading-tight tracking-tight">
                Résumé des Ventes
              </h1>
              <p className="text-[1.125rem] font-[300] text-[#64748b] max-w-[42rem] mt-2">
                Vue d'ensemble instantanée de vos performances financières.
              </p>
            </div>
            <div className="bg-[#f1f5f9] text-[#94a3b8] text-[0.875rem] font-medium px-4 py-1.5 rounded-full">
              Mis à jour : {now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 mb-16 animate-stagger-2">
          {stats.map((stat, i) => {
            const v = variants[stat.variant as keyof typeof variants];
            return (
              <div 
                key={i} 
                className={`group relative flex flex-col justify-between overflow-hidden rounded-[1.5rem] p-8 border ${v.border} ${v.bg} shadow-[0_2px_20px_rgba(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)]`}
              >
                {/* Background Glow Effect */}
                <div className={`absolute top-0 right-0 h-32 w-32 -mr-8 -mt-8 rounded-full ${v.glow} blur-[40px] opacity-60 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`} />
                
                <div className="relative z-10 flex items-center justify-between mb-8">
                  <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${v.badgeBg} ${v.badgeText}`}>
                    {stat.dot && (
                      <div className={`h-2 w-2 rounded-full ${v.dotBg} animate-pulse-soft`} />
                    )}
                    <span className="text-[0.75rem] font-[800] tracking-widest uppercase">{stat.label}</span>
                  </div>
                  <span className={`material-symbols-outlined ${v.icon} opacity-60 !text-[24px]`}>{stat.icon}</span>
                </div>
                
                <div className="relative z-10 flex flex-col gap-1">
                  <div className="flex items-baseline gap-2">
                    <span className="font-['Space_Grotesk'] text-[2.5rem] md:text-[3rem] font-[700] text-[#0f172a] leading-tight tracking-tight">
                      {stat.amount.toLocaleString()}
                    </span>
                    <span className="text-[0.875rem] font-[500] text-[#94a3b8] tracking-widest uppercase">{APP_CONFIG.currency}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Actions */}
        <div className="flex flex-col items-center gap-8 animate-stagger-3">
          <button 
            onClick={onBack}
            className="flex items-center justify-center gap-3 min-w-[200px] py-4 px-8 bg-[#0f172a] text-white rounded-[1rem] font-bold text-[1rem] shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1)] transition-all duration-300 hover:bg-[#1e293b] hover:shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1)] hover:scale-[1.02] active:scale-[0.95] group"
          >
            <span className="material-symbols-outlined !text-[24px] group-hover:-translate-x-1 transition-transform">arrow_back</span>
            Retour au Dashboard
          </button>
          
          <p className="text-[0.75rem] text-[#94a3b8] font-bold uppercase tracking-[0.2em] opacity-40">
            ShopKeeper • Radical Simplicity
          </p>
        </div>
      </main>
    </div>
  );
};

export default Summary;
