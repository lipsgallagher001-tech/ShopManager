
export interface User {
  name: string;
  shopName: string;
  password?: string; // On stocke en local pour la démo
}

export interface Sale {
  id: string;
  product: string;
  quantity: number;
  unitPrice: number;
  total: number;
  timestamp: number; // Date en millisecondes
  emoji?: string;
}

export type PeriodFilter = 'today' | 'week' | 'month';
