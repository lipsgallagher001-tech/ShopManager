
import React, { useState, useEffect } from 'react';
import { StorageService } from '../services/storage';
import { APP_CONFIG, EMOJIS } from '../constants';
import { Sale } from '../types';

interface NewSaleProps {
  onCancel: () => void;
  onSave: () => void;
}

const NewSale: React.FC<NewSaleProps> = ({ onCancel, onSave }) => {
  const [product, setProduct] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [unitPrice, setUnitPrice] = useState<number | string>('');
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const price = Number(unitPrice) || 0;
    setTotal(quantity * price);
  }, [quantity, unitPrice]);

  const handleSave = () => {
    if (!product || Number(unitPrice) <= 0) return;

    const newSale: Sale = {
      id: Date.now().toString(),
      product,
      quantity,
      unitPrice: Number(unitPrice),
      total,
      timestamp: Date.now(),
      emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)]
    };

    StorageService.saveSale(newSale);
    onSave();
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6] font-['Inter'] antialiased">
      {/* Navbar Design System implementation */}
      <header className="sticky top-0 z-[50] w-full bg-[rgba(255,255,255,0.8)] backdrop-blur-[12px] border-b border-[#e2e8f0] transition-colors duration-200">
        <div className="max-w-[80rem] mx-auto px-6 py-4 flex items-center justify-between">
          
          {/* Left Section: Logo + Brand */}
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="flex h-10 w-10 items-center justify-center rounded-[0.75rem] bg-[#245feb] text-white shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] transition-transform duration-200 group-hover:scale-105">
              <span className="material-symbols-outlined !text-[1.5rem]">leaderboard</span>
            </div>
            <span className="text-[1.25rem] font-[800] tracking-[-0.025em] leading-tight text-[#0f172a]">
              ShopKeeper
            </span>
          </div>
          
          {/* Right Section: Back Action */}
          <button 
            onClick={onCancel}
            className="flex items-center gap-2 text-[#64748b] font-[500] text-[0.875rem] transition-colors duration-200 hover:text-[#0f172a] group"
          >
            <span className="material-symbols-outlined !text-[1.25rem] transition-transform duration-200 group-hover:-translate-x-1">
              arrow_back
            </span>
            Retour
          </button>
        </div>
      </header>

      <main className="max-w-[42rem] mx-auto px-4 py-12">
        {/* Page Title Section */}
        <div className="text-center mb-10 animate-[fadeIn_0.3s_ease-out]">
          <h1 className="text-[2.25rem] font-[900] text-[#0f172a] leading-tight tracking-tight mb-2">
            Nouvelle vente
          </h1>
          <p className="text-[1.125rem] font-medium text-[#64748b]">
            Saisissez les détails de la transaction.
          </p>
        </div>

        {/* Main Form Card */}
        <div className="bg-white rounded-[1.5rem] border border-white ring-1 ring-[#f1f5f9] shadow-[0_20px_25px_-5px_rgba(148,163,184,0.5)] overflow-hidden animate-[scaleIn_0.3s_ease-out]">
          <div className="p-6 md:p-10 flex flex-col gap-8">
            
            {/* Product Field */}
            <div className="flex flex-col gap-2">
              <label className="text-[0.75rem] font-bold text-[#64748b] uppercase tracking-wider ml-1">Produit</label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#9ca3af] group-focus-within:text-[#2563EB] transition-colors">
                  shopping_bag
                </span>
                <input 
                  type="text"
                  placeholder="Ex: Sac de riz 5kg"
                  className="w-full bg-[#f9fafb] border-0 ring-1 ring-[#e5e7eb] rounded-[1rem] py-4 pl-12 pr-4 text-[1.125rem] text-[#0f172a] placeholder:text-[#9ca3af] focus:ring-2 focus:ring-[#2563EB] focus:bg-white transition-all outline-none"
                  value={product}
                  onChange={(e) => setProduct(e.target.value)}
                />
              </div>
            </div>

            {/* Quantity and Price Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Quantity Field with Stepper */}
              <div className="flex flex-col gap-2">
                <label className="text-[0.75rem] font-bold text-[#64748b] uppercase tracking-wider ml-1">Quantité</label>
                <div className="flex items-center justify-between bg-[#f9fafb] ring-1 ring-[#e5e7eb] rounded-[1rem] p-2 h-[3.5rem]">
                  <button 
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center rounded-[0.75rem] bg-white border border-[#f3f4f6] text-[#64748b] hover:text-[#2563EB] hover:bg-[#eff6ff] active:scale-90 transition-all shadow-sm"
                  >
                    <span className="material-symbols-outlined !text-[20px] font-bold">remove</span>
                  </button>
                  <span className="text-[1.25rem] font-bold text-[#0f172a]">{quantity}</span>
                  <button 
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 flex items-center justify-center rounded-[0.75rem] bg-white border border-[#f3f4f6] text-[#64748b] hover:text-[#2563EB] hover:bg-[#eff6ff] active:scale-90 transition-all shadow-sm"
                  >
                    <span className="material-symbols-outlined !text-[20px] font-bold">add</span>
                  </button>
                </div>
              </div>

              {/* Price Field */}
              <div className="flex flex-col gap-2">
                <label className="text-[0.75rem] font-bold text-[#64748b] uppercase tracking-wider ml-1">Prix Unitaire</label>
                <div className="relative group">
                  <input 
                    type="number"
                    placeholder="0"
                    className="w-full bg-[#f9fafb] border-0 ring-1 ring-[#e5e7eb] rounded-[1rem] py-4 px-4 pr-16 text-[1.125rem] font-bold text-[#0f172a] focus:ring-2 focus:ring-[#2563EB] focus:bg-white transition-all outline-none"
                    value={unitPrice}
                    onChange={(e) => setUnitPrice(e.target.value)}
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 bg-[rgba(226,232,240,0.5)] text-[#64748b] text-[0.75rem] font-bold px-2 py-1.5 rounded-[0.5rem] tracking-wider uppercase">
                    {APP_CONFIG.currency}
                  </div>
                </div>
              </div>
            </div>

            {/* Total Display Card - Emerald Style */}
            <div className="relative overflow-hidden rounded-[1.5rem] bg-[#ECFDF5] ring-1 ring-[#D1FAE5] p-10 text-center">
              <div className="absolute top-0 left-0 w-full h-[0.25rem] bg-gradient-to-r from-transparent via-[#34D399] to-transparent opacity-50" />
              <p className="text-[#059669] text-[0.75rem] font-bold tracking-[0.2em] uppercase mb-2">Total à payer</p>
              <div className="flex items-baseline justify-center gap-2">
                <span className="text-[3.5rem] md:text-[4.5rem] font-[900] text-[#059669] tracking-tighter leading-none drop-shadow-sm">
                  {total.toLocaleString()}
                </span>
                <span className="text-xl font-bold text-[#059669] opacity-80">{APP_CONFIG.currency}</span>
              </div>
            </div>

            {/* Actions Section */}
            <div className="flex flex-col-reverse md:flex-row gap-4 mt-2">
              <button 
                type="button"
                onClick={onCancel}
                className="flex-1 bg-white text-[#475569] border border-[#e2e8f0] h-[3.5rem] rounded-[1rem] font-bold text-[1rem] hover:bg-[#f8fafc] hover:text-[#0f172a] active:scale-[0.98] transition-all"
              >
                Annuler
              </button>
              <button 
                type="button"
                onClick={handleSave}
                className="flex-[1.5] bg-[#2563EB] text-white h-[3.5rem] rounded-[1rem] font-bold text-[1.125rem] flex items-center justify-center gap-3 shadow-[0_10px_15px_-3px_rgba(37,99,235,0.3)] hover:bg-[#1d4ed8] hover:shadow-[0_20px_25px_-5px_rgba(37,99,235,0.4)] active:scale-[0.98] transition-all group"
              >
                <span className="material-symbols-outlined !text-[24px] group-hover:scale-110 transition-transform">check_circle</span>
                Enregistrer la vente
              </button>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <footer className="mt-16 text-center opacity-40">
           <p className="text-[10px] text-[#64748b] uppercase tracking-[0.2em] font-black">
             © 2024 ShopKeeper App • Radical Simplicity
           </p>
        </footer>
      </main>
    </div>
  );
};

export default NewSale;
