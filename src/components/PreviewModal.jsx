'use client';

import { motion } from 'framer-motion';

export default function PreviewModal({ wallpaper, onClose }) {
  if (!wallpaper) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl"
      >
        {/* Vista previa de la imagen */}
        <div className="relative h-96 w-full bg-slate-950">
          <img
            src={wallpaper.url}
            alt={wallpaper.title}
            className="w-full h-full object-cover"
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-slate-900/80 backdrop-blur-md text-slate-300 hover:text-white rounded-full border border-slate-700/50"
          >
            ✕
          </button>
        </div>

        {/* Detalles y Acciones */}
        <div className="p-5">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h2 className="text-lg font-bold text-white">{wallpaper.title}</h2>
              <p className="text-xs text-slate-400">Por {wallpaper.author}</p>
            </div>
            <span className="px-2.5 py-1 text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-lg">
              {wallpaper.resolution}
            </span>
          </div>

          {wallpaper.description && (
            <p className="text-xs text-slate-300 my-3 line-clamp-2">
              {wallpaper.description}
            </p>
          )}

          <div className="mt-5 flex gap-3">
            <a
              href={wallpaper.url}
              target="_blank"
              rel="noopener noreferrer"
              download
              className="flex-1 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-xs rounded-xl text-center shadow-lg shadow-indigo-600/30 transition-all duration-200 active:scale-95"
            >
              Descargar HD
            </a>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}