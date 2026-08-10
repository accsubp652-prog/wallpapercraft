'use client';

import { Download, Sparkles } from 'lucide-react';

export default function WallpaperGrid({ wallpapers = [] }) {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-5">
      {wallpapers.map((wallpaper) => (
        <div
          key={wallpaper.id}
          className="group relative bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden hover:border-neutral-700 hover:shadow-xl hover:shadow-black/60 transition-all duration-300 flex flex-col"
        >
          {/* Contenedor de la Imagen */}
          <div className="relative aspect-[9/16] w-full bg-neutral-950 overflow-hidden">
            <img
              src={wallpaper.imageUrl}
              alt={wallpaper.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />

            {/* Insignia Exclusivo / Premium */}
            {wallpaper.isExclusive && (
              <div className="absolute top-2.5 left-2.5 bg-amber-500/90 text-black font-semibold text-[10px] px-2 py-0.5 rounded-full backdrop-blur-md flex items-center gap-1 shadow-md">
                <Sparkles size={10} />
                Exclusivo
              </div>
            )}

            {/* Resolución */}
            <div className="absolute top-2.5 right-2.5 bg-black/60 text-neutral-300 font-medium text-[10px] px-2 py-0.5 rounded-md backdrop-blur-md border border-white/10">
              {wallpaper.resolution}
            </div>
          </div>

          {/* Información del Wallpaper */}
          <div className="p-3 flex flex-col justify-between flex-grow bg-neutral-900">
            <div>
              <h3 className="font-semibold text-white truncate text-sm mb-0.5">
                {wallpaper.title}
              </h3>
              
              <p className="text-[11px] text-neutral-400 truncate mb-2">
                Por: <span className="text-neutral-300">{wallpaper.author?.name || 'Creador Admin'}</span>
              </p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-neutral-800 text-[11px] text-neutral-400">
              <span className="truncate">{wallpaper.category?.name || 'Sin categoría'}</span>
              <a
                href={wallpaper.imageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg transition-colors flex items-center justify-center shrink-0"
                title="Descargar"
              >
                <Download size={13} />
              </a>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}