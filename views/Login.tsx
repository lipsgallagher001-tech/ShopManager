
import React, { useState } from 'react';
import { Card, Input, Button } from '../components/UI';
import Layout from '../components/Layout';
import { StorageService } from '../services/storage';
import { APP_CONFIG, THEME } from '../constants';

interface LoginProps {
  onLogin: () => void;
  onGoToRegister: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onGoToRegister }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const user = StorageService.getUser();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError("Aucun compte trouvé. Veuillez en créer un.");
      return;
    }
    if (password === user.password) {
      StorageService.setAuthenticated(true);
      onLogin();
    } else {
      setError("Mot de passe incorrect.");
    }
  };

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-[85vh] animate-[scaleIn_0.2s_ease-out]">
        {/* Header Section */}
        <div className="w-full flex flex-col items-center mb-10">
           <div className="w-[4rem] h-[4rem] bg-[rgba(36,99,235,0.1)] text-[#2463eb] rounded-full flex items-center justify-center mb-6 shadow-sm">
             <span className="material-symbols-outlined !text-[2.25rem]">storefront</span>
           </div>
           
           <h1 className="text-[1.875rem] font-bold text-[#0f172a] leading-[1.25] text-center">
             {user?.shopName || 'Ma Boutique'}
           </h1>
           <p className="text-[#64748b] text-[1.125rem] mt-2 font-medium">
             Bon retour parmi nous
           </p>
        </div>

        {/* Login Card */}
        <Card 
          className="w-full max-w-[440px] !p-8 md:!p-12" 
          hasGradientBar 
        >
          <form onSubmit={handleLogin} className="flex flex-col">
            <div className="mb-8">
              <Input 
                label="Accès sécurisé" 
                type="password" 
                placeholder="Entrez votre code"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon="lock"
                className="!h-[3.5rem] !rounded-[0.75rem]"
              />
            </div>
            
            {error && (
              <div className="mb-6 flex items-center gap-2 text-[#ef4444] text-[0.875rem] font-semibold bg-red-50 p-4 rounded-[0.5rem] border border-red-100 animate-[fadeIn_0.2s_ease-out]">
                <span className="material-symbols-outlined !text-[18px]">error</span>
                {error}
              </div>
            )}
            
            {/* Login Button with increased top margin for spacing as requested */}
            <Button 
              type="submit"
              className="mt-2 !h-[3.75rem] !rounded-[0.75rem] !text-[1.125rem] !font-bold !bg-[#2463eb] hover:!bg-[#1d4ed8] shadow-lg"
            >
              Se connecter
              <span className="material-symbols-outlined !text-[22px] transition-transform group-hover:translate-x-1">login</span>
            </Button>

            <div className="mt-8 pt-6 border-t border-[#e2e8f0] text-center">
               <p className="text-[1rem] text-[#64748b] font-medium">
                 Nouveau commerçant ?{' '}
                 <button 
                   type="button" 
                   onClick={onGoToRegister}
                   className="text-[#2463eb] font-bold hover:underline transition-colors"
                 >
                   Créer un compte
                 </button>
               </p>
            </div>
          </form>
        </Card>
        
        {/* Footer Meta */}
        <div className="mt-12 flex flex-col items-center gap-1.5 opacity-60">
          <p className="text-[0.75rem] text-[#94a3b8] font-bold uppercase tracking-widest">
            {APP_CONFIG.name} v{APP_CONFIG.version}
          </p>
          <div className="flex items-center gap-1.5 text-[#cbd5e1]">
             <span className="material-symbols-outlined !text-[14px]">shield</span>
             <span className="text-[10px] font-semibold">AUTHENTIFICATION SÉCURISÉE</span>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
