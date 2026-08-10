'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import WallpaperGrid from '@/components/WallpaperGrid';
import PreviewModal from '@/components/PreviewModal';
import UploadModal from '@/components/UploadModal';

export default function Home() {
  const [wallpapers, setWallpapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedWallpaper, setSelectedWallpaper] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  const fetchWallpapers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/wallpapers');
      if (!response.ok) throw new Error('Error al obtener los wallpapers');
      
      const data = await response.json();
      
      const formattedData = data.map((item) => ({
        id: item.id,
        title: item.title,
        description: item.description,
        author: item.author?.name || 'Creador Anónimo',
        authorAvatar: item.author?.avatarUrl,
        url: item.imageUrl,
        thumbnail: item.thumbnailUrl || item.imageUrl,
        resolution: item.resolution,
        isExclusive: item.isExclusive,
        isAnimated: item.isAnimated,
        price: item.price,
        categorySlug: item.category?.slug || 'otros',
      }));

      setWallpapers(formattedData);
    } catch (error) {
      console.error('Error al cargar la galería:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWallpapers();
  }, []);

  const filteredWallpapers = activeCategory === 'all'
    ? wallpapers
    : wallpapers.filter((wp) => wp.categorySlug === activeCategory);

  return (
    <main className="min-h-screen bg-purple-950 text-purple-50 flex flex-col items-center justify-start p-4 sm:p-6">
      <div className="w-full max-w-4xl flex flex-col items-center">
        
        {/* Encabezado Principal Centrado */}
        <header className="w-full text-center py-6 border-b border-purple-800/50 mb-6 flex flex-col items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white drop-shadow-sm">
              WallpaperCraft
            </h1>
            <p className="text-xs text-purple-300 mt-1 font-medium tracking-wide">
              CRAFT CLUB & MARKETPLACE
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsUploadOpen(true)}
              className="px-5 py-2 text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white rounded-full shadow-lg shadow-purple-900/50 transition-all duration-200 active:scale-95"
            >
              + Subir
            </button>

            <button className="px-5 py-2 text-xs font-semibold bg-purple-800 hover:bg-purple-700 text-purple-100 rounded-full border border-purple-600/50 transition-all duration-200 active:scale-95">
              Craft Club
            </button>
          </div>
        </header>

        {/* Categorías Centradas */}
        <nav className="flex flex-wrap justify-center gap-2 mb-8 w-full">
          {[
            { name: 'Todos', slug: 'all' },
            { name: 'Cyberpunk', slug: 'cyberpunk' },
            { name: 'Naturaleza', slug: 'nature' },
            { name: 'Anime', slug: 'anime' },
          ].map((cat) => (
            <button
              key={cat.slug}
              onClick={() => setActiveCategory(cat.slug)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                activeCategory === cat.slug
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-900/50'
                  : 'bg-purple-900/40 text-purple-300 hover:bg-purple-900/80 hover:text-white'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </nav>

        {/* Sección de Contenido Centrada */}
        <div className="w-full flex justify-center">
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 w-full">
              {[...Array(4)].map((_, i) => (
                <div 
                  key={i} 
                  className="w-full h-60 bg-purple-900/30 rounded-2xl animate-pulse border border-purple-800/40"
                />
              ))}
            </div>
          ) : filteredWallpapers.length > 0 ? (
            <div className="w-full">
              <WallpaperGrid 
                wallpapers={filteredWallpapers} 
                onSelect={(item) => setSelectedWallpaper(item)} 
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-center p-8 bg-purple-900/20 rounded-3xl border border-purple-800/40 w-full max-w-md">
              <p className="text-purple-300 text-sm mb-4">
                No hay wallpapers disponibles en esta categoría.
              </p>
              <button
                onClick={() => setIsUploadOpen(true)}
                className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-purple-900/50 transition-all active:scale-95"
              >
                Subir el primer wallpaper
              </button>
            </div>
          )}
        </div>

      </div>

      {/* Modales */}
      <AnimatePresence>
        {selectedWallpaper && (
          <PreviewModal 
            wallpaper={selectedWallpaper} 
            onClose={() => setSelectedWallpaper(null)} 
          />
        )}
      </AnimatePresence>

      <UploadModal 
        isOpen={isUploadOpen} 
        onClose={() => setIsUploadOpen(false)} 
        onUploadSuccess={fetchWallpapers} 
      />
    </main>
  );
}