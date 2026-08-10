'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

export default function UploadModal({ isOpen, onClose, onUploadSuccess }) {
  const [uploadType, setUploadType] = useState('file'); // 'file' o 'url'
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    categorySlug: 'cyberpunk',
    resolution: '4K',
    isExclusive: false,
    price: '0.00',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let res;

      if (uploadType === 'file') {
        if (!selectedFile) throw new Error('Por favor, selecciona un archivo de imagen.');

        const data = new FormData();
        data.append('file', selectedFile);
        data.append('title', formData.title);
        data.append('description', formData.description);
        data.append('categorySlug', formData.categorySlug);
        data.append('resolution', formData.resolution);
        data.append('isExclusive', formData.isExclusive);
        data.append('price', formData.price);

        res = await fetch('/api/wallpapers/upload', {
          method: 'POST',
          body: data,
        });
      } else {
        if (!formData.imageUrl) throw new Error('Ingresa una URL válida.');

        res = await fetch('/api/wallpapers/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
      }

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Error al subir la imagen.');
      }

      onUploadSuccess();
      onClose();
      
      // Limpiar formulario y estados
      setSelectedFile(null);
      setPreviewUrl('');
      setFormData({
        title: '',
        description: '',
        imageUrl: '',
        categorySlug: 'cyberpunk',
        resolution: '4K',
        isExclusive: false,
        price: '0.00',
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="relative w-full max-w-lg bg-purple-950/90 border border-purple-800/60 p-6 rounded-3xl shadow-2xl text-purple-50 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-lg font-bold text-white">Subir Nuevo Wallpaper</h2>
            <p className="text-xs text-purple-300">Añade tu diseño a la colección</p>
          </div>
          <button 
            onClick={onClose} 
            className="w-8 h-8 flex items-center justify-center bg-purple-900/60 text-purple-300 hover:text-white rounded-full transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Pestañas para elegir el método de subida */}
        <div className="flex gap-2 p-1 bg-purple-900/50 rounded-xl mb-4 border border-purple-800/40">
          <button
            type="button"
            onClick={() => setUploadType('file')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              uploadType === 'file' ? 'bg-purple-600 text-white shadow' : 'text-purple-300 hover:text-white'
            }`}
          >
            Adjuntar Archivo
          </button>
          <button
            type="button"
            onClick={() => setUploadType('url')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              uploadType === 'url' ? 'bg-purple-600 text-white shadow' : 'text-purple-300 hover:text-white'
            }`}
          >
            URL Externa
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-300 text-xs rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-purple-300 mb-1 font-medium">Título del Wallpaper</label>
            <input
              type="text"
              required
              placeholder="Ej: Neon Cyber City"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full bg-purple-900/40 border border-purple-800/60 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-purple-500 transition-colors"
            />
          </div>

          {/* Campo Dinámico según la pestaña seleccionada */}
          {uploadType === 'file' ? (
            <div>
              <label className="block text-purple-300 mb-1 font-medium">Seleccionar Archivo de Imagen</label>
              <input
                type="file"
                accept="image/*"
                required
                onChange={handleFileChange}
                className="w-full bg-purple-900/40 border border-purple-800/60 rounded-xl px-3.5 py-2 text-purple-200 file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-500 cursor-pointer"
              />
              {previewUrl && (
                <div className="mt-3 relative h-32 rounded-xl overflow-hidden border border-purple-700/50">
                  <img src={previewUrl} alt="Vista previa" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          ) : (
            <div>
              <label className="block text-purple-300 mb-1 font-medium">URL de la Imagen</label>
              <input
                type="url"
                required
                placeholder="https://images.unsplash.com/..."
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                className="w-full bg-purple-900/40 border border-purple-800/60 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-purple-500 transition-colors"
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-purple-300 mb-1 font-medium">Categoría</label>
              <select
                value={formData.categorySlug}
                onChange={(e) => setFormData({ ...formData, categorySlug: e.target.value })}
                className="w-full bg-purple-900/40 border border-purple-800/60 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-purple-500 transition-colors"
              >
                <option value="cyberpunk" className="bg-purple-950">Cyberpunk</option>
                <option value="nature" className="bg-purple-950">Naturaleza</option>
                <option value="anime" className="bg-purple-950">Anime</option>
              </select>
            </div>

            <div>
              <label className="block text-purple-300 mb-1 font-medium">Resolución</label>
              <select
                value={formData.resolution}
                onChange={(e) => setFormData({ ...formData, resolution: e.target.value })}
                className="w-full bg-purple-900/40 border border-purple-800/60 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-purple-500 transition-colors"
              >
                <option value="HD" className="bg-purple-950">HD (1080p)</option>
                <option value="4K" className="bg-purple-950">4K</option>
                <option value="8K" className="bg-purple-950">8K</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-purple-300 mb-1 font-medium">Descripción (Opcional)</label>
            <textarea
              rows="2"
              placeholder="Breve descripción..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-purple-900/40 border border-purple-800/60 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-purple-500 resize-none transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-xl shadow-lg shadow-purple-900/50 transition-all duration-200 active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'Subiendo imagen...' : 'Publicar Wallpaper'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}