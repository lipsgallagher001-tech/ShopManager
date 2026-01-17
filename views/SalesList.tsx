
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
      
      // Configuration des couleurs (identiques au Design System)
      const primaryBlue = [36, 99, 235]; // #2463eb
      const darkText = [15, 23, 42];    // #0f172a
      const grayText = [100, 116, 139]; // #64748b

      // --- EN-TÊTE DU DOCUMENT ---
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

      // --- RÉSUMÉ DES PERFORMANCES ---
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

      // --- TABLEAU DES TRANSACTIONS ---
      y += 20;
      doc.setFontSize(14);
      doc.text("Détail des transactions", 14, y);
      
      y += 8;
      // En-têtes du tableau
      doc.setFillColor(248, 250, 252); // Gris très clair
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
        // Nouvelle page si nécessaire
        if (y > 270) {
          doc.addPage();
          y = 20;
        }

        // Alternance de fond pour les lignes
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

      // --- PIED DE PAGE ---
      doc.setFontSize(8);
      doc.setTextColor(grayText[0], grayText[1], grayText[2]);
      const footerText = "Rapport généré automatiquement par ShopKeeper App - Radical Simplicity";
      doc.text(footerText, pageWidth / 2, 285, { align: 'center' });

      // Téléchargement
      const fileName = `Rapport_Ventes_${filter}_${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(fileName);
      
    } catch (error) {
      console.error("Erreur lors de l'exportation PDF:", error);
      alert("Une erreur est survenue lors de la génération du PDF. Vérifiez votre connexion internet.");
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] font-['Inter'] antialiased">
      {/* Sticky Header with Backdrop Blur */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#e2e8f0] transition-colors duration-200">
        <div className="max-w-[960px] mx-auto px-4 md:px-10 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-[#eff6ff] rounded-[0.75rem] text-[#245feb]">
              <span className="material-symbols-outlined !text-[24px]">storefront</span>
            </div>
            <span className="text-[1.125rem] font-bold tracking-tight text-[#0f172a]">ShopKeeper</span>
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
            <p className="text-[1rem] text-[#64748b]">Historique complet de vos transactions</p>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={handleExport}
              className="flex items-center gap-2 bg-[#245feb] text-white px-5 py-2.5 rounded-[0.75rem] text-[0.875rem] font-bold shadow-[0_10px_15px_-3px_rgba(36,95,235,0.2)] hover:bg-[#1d4ed8] hover:-translate-y-0.5 active:translate-y-0 transition-all group"
            >
              <span className="material-symbols-outlined !text-[20px] transition-transform group-hover:scale-110">picture_as_pdf</span>
              Exporter PDF
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          <div className="bg-white p-5 rounded-[1rem] border border-[#e2e8f0] shadow-sm flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="text-[0.875rem] font-semibold text-[#64748b]">Total CA</span>
              <div className="p-1.5 bg-[#ecfdf5] text-[#059669] rounded-[0.5rem]">
                <span className="material-symbols-outlined !text-[20px]">payments</span>
              </div>
            </div>
            <div className="flex items-baseline gap-1 mt-2">
              <span className="text-[1.875rem] font-extrabold text-[#0f172a] tracking-tight">{totalAmount.toLocaleString()}</span>
              <span className="text-[0.875rem] font-bold text-[#94a3b8] uppercase tracking-wide">{APP_CONFIG.currency}</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-[1rem] border border-[#e2e8f0] shadow-sm flex flex-col gap-1">
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

          <div className="bg-white p-5 rounded-[1rem] border border-[#e2e8f0] shadow-sm flex flex-col gap-1">
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
            <h3 className="text-[1.25rem] font-bold text-[#0f172a]">Détail chronologique</h3>
            
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
                  className="group bg-white p-5 rounded-[1rem] border border-[#e2e8f0] shadow-sm flex items-center gap-5 hover:shadow-md hover:-translate-y-0.5 hover:border-[#245feb]/20 transition-all cursor-pointer"
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
        </div>

        <footer className="mt-20 text-center opacity-40">
           <p className="text-[10px] text-[#4d6499] uppercase tracking-[0.2em] font-black">
             ShopKeeper • Gestion radicalement simple
           </p>
        </footer>
      </main>
    </div>
  );
};

export default SalesList;
