
import React from 'react';
import { THEME } from '../constants';

interface LayoutProps {
  children: React.ReactNode;
  showHeader?: boolean;
  title?: string;
  onBack?: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, showHeader = false, title, onBack }) => {
  return (
    <div className="min-h-screen w-full flex flex-col items-center px-4 py-8 md:py-12">
      <div className="w-full max-w-[480px] flex flex-col">
        {showHeader && (
          <header className="flex items-center justify-between mb-8 w-full">
            <div className="flex items-center gap-2">
               <div className="p-2 bg-blue-600 rounded-lg text-white">
                 <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
               </div>
               <span className="font-bold text-xl tracking-tight text-slate-900">{title || 'ShopManager'}</span>
            </div>
            {onBack && (
              <button onClick={onBack} className="flex items-center gap-1 text-slate-500 hover:text-slate-800 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                <span className="text-sm font-medium">Retour</span>
              </button>
            )}
          </header>
        )}
        <main className="w-full flex-1">
          {children}
        </main>
        <footer className="mt-12 text-center">
           <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">
             SimpleVente v1.0 • Fait avec passion
           </p>
        </footer>
      </div>
    </div>
  );
};

export default Layout;
