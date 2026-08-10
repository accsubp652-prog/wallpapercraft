'use client';

import { motion } from 'framer-motion';

export default function WallpaperGrid({ wallpapers, onSelect }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {wallpapers.map((wallpaper, index) => (
        <motion.div
          key={wallpaper.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
          onClick={() => onSelect(wallpaper)}
          className="group relative h-72 rounded-2xl overflow-hidden bg-slate-800 border border-slate-800/80 cursor-pointer shadow-lg hover:shadow-indigo-500/10 transition-all duration-300"
        >
          {/* Imagen de fondo */}
          <img
            src={wallpaper.thumbnail}
            alt={wallpaper.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />

          {/* Sombra suave / Gradiente */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

          {/* Badges superiores (Exclusive / Resolution) */}
          <div className="absolute top-3 left-3 right-3 flex justify-between items-center z-10">
            <span className="px-2 py-0.5 text-[10px] font-bold tracking-wider bg-slate-900/80 backdrop-blur-md text-slate-300 rounded-md border border-slate-700/50">
              {wallpaper.resolution}
            </span>
            {wallpaper.isExclusive && (
              <span className="px-2 py-0.5 text-[10px] font-bold bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 rounded-md shadow-md">
                PRO
              </span>
            )}
          </div>

          {/* Información inferior */}
          <div className="absolute bottom-3 left-3 right-3 z-10">
            <h3 className="text-sm font-bold text-white truncate drop-shadow-sm">
              {wallpaper.title}
            </h3>
            <p className="text-xs text-slate-400 truncate">
              {wallpaper.author}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}