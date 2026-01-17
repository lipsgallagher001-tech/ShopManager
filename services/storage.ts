
import { User, Sale } from '../types';

const STORAGE_KEYS = {
  USER: 'shopmanager_user',
  SALES: 'shopmanager_sales',
  AUTH: 'shopmanager_is_auth'
};

export const StorageService = {
  // Gestion de l'utilisateur
  getUser: (): User | null => {
    const data = localStorage.getItem(STORAGE_KEYS.USER);
    return data ? JSON.parse(data) : null;
  },
  setUser: (user: User) => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  },

  // Gestion de l'authentification
  setAuthenticated: (isAuth: boolean) => {
    localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(isAuth));
  },
  isAuthenticated: (): boolean => {
    const data = localStorage.getItem(STORAGE_KEYS.AUTH);
    return data ? JSON.parse(data) : false;
  },

  // Gestion des ventes
  getSales: (): Sale[] => {
    const data = localStorage.getItem(STORAGE_KEYS.SALES);
    return data ? JSON.parse(data) : [];
  },
  saveSale: (sale: Sale) => {
    const sales = StorageService.getSales();
    sales.unshift(sale); // Plus récent en premier
    localStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify(sales));
  },

  // Utilitaires de déconnexion/Reset
  logout: () => {
    localStorage.setItem(STORAGE_KEYS.AUTH, 'false');
  }
};
