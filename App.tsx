
import React, { useState, useEffect } from 'react';
import { StorageService } from './services/storage';
import { User, Sale } from './types';

// Views
import Login from './views/Login';
import Register from './views/Register';
import Dashboard from './views/Dashboard';
import NewSale from './views/NewSale';
import SalesList from './views/SalesList';
import Summary from './views/Summary';

type ViewState = 'login' | 'register' | 'dashboard' | 'newSale' | 'salesList' | 'summary';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('login');
  const [user, setUser] = useState<User | null>(null);
  const [sales, setSales] = useState<Sale[]>([]);

  // Initialisation et vérification auth
  useEffect(() => {
    const savedUser = StorageService.getUser();
    const isAuth = StorageService.isAuthenticated();
    const savedSales = StorageService.getSales();
    
    setSales(savedSales);
    
    if (savedUser && isAuth) {
      setUser(savedUser);
      setCurrentView('dashboard');
    } else if (savedUser) {
      setCurrentView('login');
    } else {
      setCurrentView('register');
    }
  }, []);

  const refreshData = () => {
    setSales(StorageService.getSales());
    setUser(StorageService.getUser());
  };

  const navigateTo = (view: ViewState) => {
    refreshData();
    setCurrentView(view);
    // Scroll au top lors du changement de vue
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLoginSuccess = () => {
    setUser(StorageService.getUser());
    navigateTo('dashboard');
  };

  // Rendu conditionnel basé sur l'état
  const renderView = () => {
    switch (currentView) {
      case 'login':
        return <Login onLogin={handleLoginSuccess} onGoToRegister={() => navigateTo('register')} />;
      case 'register':
        return <Register onRegister={handleLoginSuccess} onGoToLogin={() => navigateTo('login')} />;
      case 'dashboard':
        return user ? (
          <Dashboard 
            user={user} 
            sales={sales} 
            onNewSale={() => navigateTo('newSale')}
            onViewSales={() => navigateTo('salesList')}
            onViewSummary={() => navigateTo('summary')}
          />
        ) : <Register onRegister={handleLoginSuccess} onGoToLogin={() => navigateTo('login')} />;
      case 'newSale':
        return <NewSale onCancel={() => navigateTo('dashboard')} onSave={() => navigateTo('dashboard')} />;
      case 'salesList':
        return <SalesList sales={sales} onBack={() => navigateTo('dashboard')} />;
      case 'summary':
        return <Summary sales={sales} onBack={() => navigateTo('dashboard')} />;
      default:
        return <Login onLogin={handleLoginSuccess} onGoToRegister={() => navigateTo('register')} />;
    }
  };

  return (
    <div className="antialiased text-slate-900">
      {renderView()}
    </div>
  );
};

export default App;
