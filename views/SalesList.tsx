
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

  /**
   * Génère un rapport PDF des ventes filtrées
   */
  const handleExport = async () => {
    if (filteredSales.length === 0) {
      alert("Aucune vente à exporter pour cette période.");
      return;
    }

    try {
      // Import dynamique de jsPDF pour optimiser le chargement initial
      const { jsPDF } = await import('https://esm.sh/jspdf');
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      
      const primaryBlue = [36, 99, 235]; 
      const darkText = [15, 23, 42];    
      const grayText = [100, 116, 139]; 

      doc.setFillColor(primaryBlue[0], primaryBlue[1], primaryBlue[2]);
      doc.rect(0, 0, pageWidth, 40, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(22);
      doc.setFont('helvetica', 'bold');
      doc.text(APP_CONFIG.name.toUpperCase(), 14, 25);
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`RAPPORT DE VENTES - PÉRIODE : ${filter.toUpperCase()}`, 14, 32);
      doc.text(`Généré le ${new Date().toLocaleString('fr-FR')}`, pageWidth - 70, 32);

      let y = 55;
      doc.setTextColor(darkText[0], darkText[1], darkText[2]);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text("Résumé financier", 14, y);
      
      y += 10;
      doc.setDrawColor(226, 232, 240);
      doc.line(14, y, pageWidth - 14, y);
      
      y += 10;
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(grayText[0], grayText[1], grayText[2]);
      doc.text("Chiffre d'Affaires Total:", 14, y);
      doc.text("Nombre de Transactions:", 80, y);
      doc.text("Panier Moyen:", 140, y);
      
      y += 7;
      doc.setTextColor(darkText[0], darkText[1], darkText[2]);
      doc.setFont('helvetica', 'bold');
      doc.text(`${totalAmount.toLocaleString()} ${APP_CONFIG.currency}`, 14, y);
      doc.text(`${filteredSales.length}`, 80, y);
      doc.text(`${averageBasket.toLocaleString()} ${APP_CONFIG.currency}`, 140, y);

      y += 20;
      doc.setFontSize(14);
      doc.text("Détail des transactions", 14, y);
      
      y += 8;
      doc.setFillColor(248, 250, 252); 
      doc.rect(14, y, pageWidth - 28, 10, 'F');
      doc.setTextColor(grayText[0], grayText[1], grayText[2]);
      doc.setFontSize(9);
      doc.text("PRODUIT", 18, y + 6.5);
      doc.text("QTÉ", 80, y + 6.5);
      doc.text("PRIX UNIT.", 110, y + 6.5);
      doc.text("TOTAL", 150, y + 6.5);
      doc.text("HEURE", 180, y + 6.5);
      
      y += 10;
      doc.setTextColor(darkText[0], darkText[1], darkText[2]);
      doc.setFont('helvetica', 'normal');

      filteredSales.forEach((sale, index) => {
        if (y > 270) {
          doc.addPage();
          y = 20;
        }
        if (index % 2 === 0) {
          doc.setFillColor(252, 252, 253);
          doc.rect(14, y, pageWidth - 28, 8, 'F');
        }
        const timeStr = new Date(sale.timestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
        doc.text(sale.product.substring(0, 30), 18, y + 5);
        doc.text(sale.quantity.toString(), 80, y + 5);
        doc.text(`${sale.unitPrice.toLocaleString()}`, 110, y + 5);
        doc.setFont('helvetica', 'bold');
        doc.text(`${sale.total.toLocaleString()}`, 150, y + 5);
        doc.setFont('helvetica', 'normal');
        doc.text(timeStr, 180, y + 5);
        y += 8;
      });

      doc.setFontSize(8);
      doc.setTextColor(grayText[0], grayText[1], grayText[2]);
      const footerText = "Rapport généré automatiquement par ShopKeeper App - Radical Simplicity";
      doc.text(footerText, pageWidth / 2, 285, { align: 'center' });

      const fileName = `Rapport_Ventes_${filter}_${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(fileName);
      
    } catch (error) {
      console.error("Erreur lors de l'exportation PDF:", error);
      alert("Une erreur est survenue lors de la génération du PDF.");
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] font-['Inter'] antialiased">
      {/* Header Sticky avec effet de flou */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-[#e2e8f0] transition-all duration-300">
        <div className="max-w-[960px] mx-auto px-4 md:px-10 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-[#eff6ff] rounded-[0.75rem] text-[#245feb]">
              <span className="material-symbols-outlined !text-[24px]">leaderboard</span>
            </div>
            <span className="text-[1.125rem] font-black tracking-tight text-[#0f172a]">ShopKeeper</span>
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
        {/* Titre et Bouton d'export avec Animation d'entrée */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 animate-stagger-1">
          <div>
            <h1 className="text-[2.25rem] md:text-[2.75rem] font-[900] text-[#0f172a] tracking-tight leading-none">
              Mes ventes
            </h1>
            <p className="text-[1.125rem] text-[#64748b] mt-2 font-medium">Historique complet de vos transactions</p>
          </div>
          
          <button 
            onClick={handleExport}
            className="flex items-center justify-center gap-2 bg-[#245feb] text-white px-6 py-3.5 rounded-[1rem] text-[1rem] font-bold shadow-xl hover:bg-[#1d4ed8] hover:-translate-y-1 active:scale-[0.98] transition-all group w-full md:w-auto"
          >
            <span className="material-symbols-outlined !text-[22px] transition-transform group-hover:scale-110">picture_as_pdf</span>
            Exporter PDF
          </button>
        </div>

        {/* Grille de Stats avec Animation Staggered */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12 animate-stagger-2">
          <div className="bg-white p-6 rounded-[1.25rem] border border-[#e2e8f0] shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[0.875rem] font-bold text-[#64748b] uppercase tracking-widest">Total CA</span>
              <div className="p-2 bg-[#ecfdf5] text-[#10b981] rounded-[0.75rem]">
                <span className="material-symbols-outlined !text-[22px]">payments</span>
              </div>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-[2rem] font-[900] text-[#0f172a] tracking-tighter">{totalAmount.toLocaleString()}</span>
              <span className="text-[0.875rem] font-bold text-[#94a3b8]">{APP_CONFIG.currency}</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-[1.25rem] border border-[#e2e8f0] shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[0.875rem] font-bold text-[#64748b] uppercase tracking-widest">Panier moyen</span>
              <div className="p-2 bg-[#eff6ff] text-[#245feb] rounded-[0.75rem]">
                <span className="material-symbols-outlined !text-[22px]">analytics</span>
              </div>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-[2rem] font-[900] text-[#0f172a] tracking-tighter">{averageBasket.toLocaleString()}</span>
              <span className="text-[0.875rem] font-bold text-[#94a3b8]">{APP_CONFIG.currency}</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-[1.25rem] border border-[#e2e8f0] shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[0.875rem] font-bold text-[#64748b] uppercase tracking-widest">Transactions</span>
              <div className="p-2 bg-[#fff7ed] text-[#ea580c] rounded-[0.75rem]">
                <span className="material-symbols-outlined !text-[22px]">inventory_2</span>
              </div>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-[2rem] font-[900] text-[#0f172a] tracking-tighter">{filteredSales.length}</span>
              <span className="text-[0.875rem] font-bold text-[#94a3b8]">Ventes</span>
            </div>
          </div>
        </div>

        {/* Liste des ventes avec effet de défilement visuel */}
        <div className="flex flex-col gap-6 animate-stagger-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h3 className="text-[1.25rem] font-black text-[#0f172a] flex items-center gap-2">
              <span className="w-2 h-6 bg-[#245feb] rounded-full"></span>
              Historique détaillé
            </h3>
            
            <div className="inline-flex bg-[#f3f4f6] p-1 rounded-full border border-[#e5e7eb] shadow-inner self-start">
              {['today', 'week', 'month'].map((p) => (
                <button 
                  key={p}
                  onClick={() => setFilter(p as PeriodFilter)}
                  className={`px-5 py-2 text-[0.875rem] font-bold rounded-full transition-all capitalize ${filter === p ? 'bg-white text-[#0f172a] shadow-sm ring-1 ring-black/5' : 'text-[#64748b] hover:text-[#0f172a]'}`}
                >
                  {p === 'today' ? "Aujourd'hui" : p === 'week' ? 'Semaine' : 'Mois'}
                </button>
              ))}
            </div>
          </div>

          {/* Transactions avec animation d'apparition différée */}
          <div className="flex flex-col gap-4">
            {filteredSales.length === 0 ? (
              <div className="py-20 text-center bg-white rounded-[1.5rem] border-2 border-dashed border-[#e2e8f0] animate-[fadeIn_0.5s_ease-out]">
                <span className="material-symbols-outlined !text-[64px] text-[#cbd5e1] mb-4">history_toggle_off</span>
                <p className="text-[#94a3b8] font-bold text-[1.125rem]">Aucune vente pour le moment</p>
                <p className="text-[#cbd5e1] text-[0.875rem]">Les ventes enregistrées apparaîtront ici.</p>
              </div>
            ) : (
              filteredSales.map((sale, idx) => (
                <div 
                  key={sale.id} 
                  style={{ animationDelay: `${0.1 + (idx * 0.05)}s` }}
                  className="group bg-white p-5 rounded-[1.25rem] border border-[#e2e8f0] shadow-sm flex items-center gap-5 hover:shadow-lg hover:-translate-y-1 hover:border-[#245feb]/20 transition-all cursor-pointer animate-[fadeIn_0.5s_ease-out_forwards] opacity-0"
                >
                  <div className="flex-shrink-0 h-14 w-14 rounded-[1rem] bg-[#f8fafc] flex items-center justify-center text-[1.75rem] border border-[#e2e8f0] group-hover:bg-[#eff6ff] group-hover:scale-105 transition-all">
                    {sale.emoji || '🛒'}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[1.125rem] font-[800] text-[#0f172a] truncate group-hover:text-[#245feb] transition-colors">{sale.product}</h4>
                    <p className="text-[0.875rem] font-medium text-[#64748b] truncate mt-0.5">
                      {sale.quantity} unité{sale.quantity > 1 ? 's' : ''} • {sale.unitPrice.toLocaleString()} {APP_CONFIG.currency}/unité
                    </p>
                  </div>
                  
                  <div className="flex flex-col items-end gap-1.5">
                    <div className="text-[1.25rem] font-[900] text-[#10b981] tracking-tighter">
                      {sale.total.toLocaleString()} <span className="text-[0.75rem] font-bold">{APP_CONFIG.currency}</span>
                    </div>
                    <div className="inline-flex items-center gap-1 text-[0.75rem] font-bold text-[#94a3b8] bg-[#f8fafc] px-2 py-0.5 rounded-full border border-[#f1f5f9]">
                      <span className="material-symbols-outlined !text-[12px]">schedule</span>
                      {new Date(sale.timestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer final */}
        <footer className="mt-24 text-center animate-stagger-5 opacity-40">
           <p className="text-[11px] text-[#4d6499] uppercase tracking-[0.25em] font-[900]">
             ShopKeeper • Radical Simplicity
           </p>
        </footer>
      </main>
    </div>
  );
};

export default SalesList;
