
import React, { useState } from 'react';
import { Card, Input, Button } from '../components/UI';
import Layout from '../components/Layout';
import { StorageService } from '../services/storage';

interface RegisterProps {
  onRegister: () => void;
  onGoToLogin: () => void;
}

const Register: React.FC<RegisterProps> = ({ onRegister, onGoToLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    shopName: '',
    password: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.shopName || !formData.password) return;
    
    StorageService.setUser(formData);
    StorageService.setAuthenticated(true);
    onRegister();
  };

  return (
    <Layout>
      <div className="relative min-h-[90vh] flex flex-col items-center justify-center overflow-hidden py-12 px-4">
        
        {/* Background Decorative Blurs - Sales App Design System */}
        <div className="absolute inset-0 z-[-10] pointer-events-none">
          {/* Top Right Blur */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] translate-x-[20%] -translate-y-[20%] rounded-full bg-[#198ff5] opacity-[0.1] blur-[100px]" />
          {/* Bottom Left Blur */}
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] -translate-x-[20%] translate-y-[20%] rounded-full bg-[#60a5fa] opacity-[0.1] blur-[100px]" />
        </div>

        <div className="w-full max-w-[480px] animate-[fadeIn_0.4s_ease-out]">
          {/* Header Section */}
          <div className="flex flex-col items-center mb-10 text-center">
             <div className="w-[3.5rem] h-[3.5rem] bg-[rgba(25,143,245,0.1)] text-[#198ff5] rounded-[0.75rem] flex items-center justify-center mb-6 shadow-sm">
                <span className="material-symbols-outlined !text-[28px]">app_registration</span>
             </div>
             <h1 className="text-[2rem] font-[900] text-[#0f172a] leading-[1.25] tracking-tight mb-3">Créer mon compte</h1>
             <p className="text-[#475569] text-[1rem] font-medium max-w-[280px]">
                Gérez votre boutique avec une <span className="text-[#198ff5]">simplicité radicale</span>
             </p>
          </div>

          {/* Registration Card - Sales App Styling */}
          <Card 
            className="!rounded-[0.75rem] !border-[rgba(226,232,240,0.5)] !shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1)] hover:!shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1)] transition-all duration-300" 
            padding="p-6 md:p-10"
          >
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div className="space-y-5">
                <div className="flex flex-col gap-1.5">
                  <Input 
                    label="Votre nom complet" 
                    placeholder="e.g. Jean Dupont"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    icon="person"
                    className="!rounded-[0.5rem]"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <Input 
                    label="Nom de la boutique" 
                    placeholder="e.g. La Petite Épicerie"
                    value={formData.shopName}
                    onChange={(e) => setFormData({...formData, shopName: e.target.value})}
                    icon="store"
                    className="!rounded-[0.5rem]"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <Input 
                    label="Code d'accès" 
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    icon="lock"
                    className="!rounded-[0.5rem]"
                  />
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="!bg-[#198ff5] hover:!bg-[rgba(25,143,245,0.9)] !rounded-[0.5rem] !h-auto !py-4 shadow-sm mt-2 transition-all active:scale-[0.98]"
              >
                <span className="text-[1rem] font-bold">Commencer l'aventure</span>
                <span className="material-symbols-outlined !text-[20px]">rocket_launch</span>
              </Button>

              {/* Divider with Text */}
              <div className="relative flex items-center py-2">
                <div className="flex-grow border-t border-[#e2e8f0]"></div>
                <span className="flex-shrink mx-4 text-[#64748b] text-[0.875rem] font-medium">Ou</span>
                <div className="flex-grow border-t border-[#e2e8f0]"></div>
              </div>

              <div className="text-center">
                <p className="text-[0.875rem] text-[#475569] font-medium">
                  Déjà membre ?{' '}
                  <button 
                    type="button" 
                    onClick={onGoToLogin}
                    className="text-[#198ff5] font-bold hover:underline transition-colors"
                  >
                    Connectez-vous
                  </button>
                </p>
              </div>
            </form>
          </Card>
          
          <div className="mt-12 text-center animate-[slideDown_0.5s_ease-out]">
             <p className="text-[0.75rem] text-[#94a3b8] font-bold uppercase tracking-[0.1em]">
               © 2024 Sales App. Radical Simplicity.
             </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Register;
