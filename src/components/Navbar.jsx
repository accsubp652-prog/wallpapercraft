'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sparkles, Plus, Lock, User as UserIcon, LogOut, Crown } from 'lucide-react';
import UploadModal from './UploadModal';
import AuthModal from './AuthModal';
import SubscribeModal from './SubscribeModal';

export default function Navbar() {
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isSubscribeOpen, setIsSubscribeOpen] = useState(false);
  const [user, setUser] = useState(null);

  // Cargar usuario guardado en el cliente
  useEffect(() => {
    const savedUser = localStorage.getItem('wallpapercraft_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error('Error al leer sesión:', e);
      }
    }
  }, []);

  const handleOpenUpload = () => {
    if (!user) {
      setIsAuthOpen(true);
      return;
    }

    if (!user.isPremium) {
      setIsSubscribeOpen(true);
      return;
    }

    setIsUploadOpen(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('wallpapercraft_user');
    setUser(null);
    window.location.reload();
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-neutral-950/80 backdrop-blur-md border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-white shrink-0">
            <div className="p-1.5 bg-white text-black rounded-lg">
              <Sparkles size={18} />
            </div>
            <span>WallpaperCraft</span>
          </Link>

          {/* Acciones de usuario, plan y subida */}
          <div className="flex items-center gap-3">
            
            {/* Botón para subir fondos */}
            <button
              onClick={handleOpenUpload}
              className="flex items-center gap-2 bg-white text-black hover:bg-neutral-200 font-medium text-sm px-4 py-2 rounded-full transition-colors"
            >
              {user && !user.isPremium ? <Lock size={15} className="text-amber-600" /> : <Plus size={16} />}
              <span>Subir Fondo</span>
            </button>

            {user ? (
              <div className="flex items-center gap-2 bg-neutral-900 border border-neutral-800 px-3 py-1.5 rounded-full text-xs text-neutral-300">
                <UserIcon size={14} />
                <span className="font-semibold text-white">{user.name}</span>
                
                {/* Insignia de Plan */}
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  user.isPremium 
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' 
                    : 'bg-neutral-800 text-neutral-400'
                }`}>
                  {user.isPremium ? 'PRO' : 'GRATIS'}
                </span>

                {/* Botón para mejorar plan si es usuario Gratis */}
                {!user.isPremium && (
                  <button
                    onClick={() => setIsSubscribeOpen(true)}
                    className="flex items-center gap-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[11px] font-bold px-2 py-0.5 rounded-full transition-colors ml-1"
                  >
                    <Crown size={12} />
                    <span>Obtener PRO</span>
                  </button>
                )}

                <button
                  onClick={handleLogout}
                  className="text-neutral-500 hover:text-red-400 ml-1 transition-colors"
                  title="Cerrar sesión"
                >
                  <LogOut size={14} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAuthOpen(true)}
                className="text-xs font-semibold bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-white px-3.5 py-2 rounded-full transition-colors"
              >
                Crear Cuenta / Entrar
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Modales */}
      <UploadModal 
        isOpen={isUploadOpen} 
        onClose={() => setIsUploadOpen(false)} 
        user={user}
      />
      <AuthModal 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)} 
      />
      <SubscribeModal
        isOpen={isSubscribeOpen}
        onClose={() => setIsSubscribeOpen(false)}
        user={user}
        onUpgradeSuccess={(updatedUser) => setUser(updatedUser)}
      />
    </>
  );
}