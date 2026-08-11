'use client';

import { useState } from 'react';
import { X, Check, Crown, Loader2, Sparkles, ShieldCheck } from 'lucide-react';

export default function SubscribeModal({ isOpen, onClose, user, onUpgradeSuccess }) {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubscribe = async () => {
    if (!user?.id) {
      setErrorMsg('Debes iniciar sesión para contratar la suscripción.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const response = await fetch('/api/users/upgrade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'No se pudo procesar la suscripción.');
      }

      // 1. Actualizar el usuario en localStorage
      localStorage.setItem('wallpapercraft_user', JSON.stringify(data.user));

      // 2. Notificar al componente padre para actualizar la UI en tiempo real
      if (onUpgradeSuccess) {
        onUpgradeSuccess(data.user);
      }

      onClose();
      window.location.reload();
    } catch (err) {
      console.error('Error en la suscripción:', err);
      setErrorMsg(err.message || 'Ocurrió un error al procesar el pago.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="relative w-full max-w-md bg-neutral-900 border border-amber-500/30 rounded-2xl shadow-2xl p-6 text-white overflow-hidden">
        
        {/* Fondo decorativo con resplandor */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Encabezado */}
        <div className="flex justify-between items-start pb-4 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-amber-500/20 text-amber-400 rounded-lg border border-amber-500/30">
              <Crown size={22} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">WallpaperCraft PRO</h2>
              <p className="text-xs text-neutral-400">Desbloquea todo el potencial de la plataforma</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Mensaje de Error */}
        {errorMsg && (
          <div className="my-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
            {errorMsg}
          </div>
        )}

        {/* Tarjeta de Beneficios */}
        <div className="my-6 p-4 bg-neutral-950 rounded-xl border border-neutral-800 space-y-3">
          <div className="flex items-baseline justify-between mb-2">
            <span className="text-2xl font-black text-white">$4.99 <span className="text-xs text-neutral-400 font-normal">/ mes</span></span>
            <span className="text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full">
              ACCESO UNILIMITADO
            </span>
          </div>

          <ul className="space-y-2.5 text-xs text-neutral-300">
            <li className="flex items-center gap-2">
              <Check size={16} className="text-amber-400 shrink-0" />
              <span>Publicación ilimitada de fondos de pantalla.</span>
            </li>
            <li className="flex items-center gap-2">
              <Check size={16} className="text-amber-400 shrink-0" />
              <span>Descargas directas en máxima resolución (4K y 8K).</span>
            </li>
            <li className="flex items-center gap-2">
              <Check size={16} className="text-amber-400 shrink-0" />
              <span>Insignia distintiva <strong className="text-amber-400">PRO</strong> en tu perfil.</span>
            </li>
            <li className="flex items-center gap-2">
              <Check size={16} className="text-amber-400 shrink-0" />
              <span>Soporte prioritario y acceso a contenido exclusivo.</span>
            </li>
          </ul>
        </div>

        {/* Botón de Acción */}
        <div className="space-y-3">
          <button
            onClick={handleSubscribe}
            disabled={loading}
            className="w-full py-3 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold text-sm rounded-xl transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <>
                <Sparkles size={18} />
                Obtener Plan Premium
              </>
            )}
          </button>

          <p className="flex items-center justify-center gap-1 text-[11px] text-neutral-500">
            <ShieldCheck size={13} />
            Suscripción segura y cancelable en cualquier momento.
          </p>
        </div>

      </div>
    </div>
  );
}