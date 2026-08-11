'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, Upload, Link as LinkIcon, Loader2 } from 'lucide-react';

export default function UploadModal({ isOpen, onClose, user }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('file'); // 'file' o 'url'
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Estados del formulario
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categorySlug, setCategorySlug] = useState('anime');
  const [resolution, setResolution] = useState('4K');
  const [isExclusive, setIsExclusive] = useState(false);
  const [price, setPrice] = useState('0.00');
  const [imageUrl, setImageUrl] = useState('');
  const [file, setFile] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      let response;

      if (activeTab === 'file') {
        if (!file) {
          setErrorMsg('Por favor, selecciona un archivo de imagen.');
          setLoading(false);
          return;
        }

        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('categorySlug', categorySlug);
        formData.append('resolution', resolution);
        formData.append('isExclusive', isExclusive);
        formData.append('price', price);
        formData.append('authorId', user?.id || '');
        formData.append('file', file);

        response = await fetch('/api/wallpapers/upload', {
          method: 'POST',
          body: formData,
        });
      } else {
        if (!imageUrl) {
          setErrorMsg('Por favor, ingresa una URL de imagen válida.');
          setLoading(false);
          return;
        }

        response = await fetch('/api/wallpapers/upload', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title,
            description,
            imageUrl,
            categorySlug,
            resolution,
            isExclusive,
            price,
            authorId: user?.id || '',
          }),
        });
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al subir el fondo de pantalla.');
      }

      // Limpiar campos del formulario
      setTitle('');
      setDescription('');
      setImageUrl('');
      setFile(null);
      
      // Cerrar modal y refrescar la página
      onClose();
      router.refresh();
    } catch (err) {
      console.error('Error al publicar:', err);
      setErrorMsg(err.message || 'Ocurrió un error inesperado.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl p-6 text-white overflow-hidden">
        
        {/* Encabezado */}
        <div className="flex justify-between items-center pb-4 border-b border-neutral-800">
          <h2 className="text-xl font-bold">Subir Fondo de Pantalla</h2>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Pestañas de Selección */}
        <div className="flex gap-2 my-4 p-1 bg-neutral-950 rounded-lg border border-neutral-800">
          <button
            type="button"
            onClick={() => setActiveTab('file')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'file'
                ? 'bg-neutral-800 text-white'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Upload size={16} />
            Adjuntar Archivo
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('url')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'url'
                ? 'bg-neutral-800 text-white'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <LinkIcon size={16} />
            URL Externa
          </button>
        </div>

        {/* Mensaje de Error */}
        {errorMsg && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
            {errorMsg}
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-1">
              Título *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej: Paisaje Cyberpunk Neon"
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-neutral-600"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-1">
              Descripción
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Breve detalle sobre el diseño..."
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-neutral-600"
            />
          </div>

          {activeTab === 'file' ? (
            <div>
              <label className="block text-xs font-medium text-neutral-400 mb-1">
                Archivo de Imagen *
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files[0])}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-neutral-400 file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-neutral-800 file:text-white hover:file:bg-neutral-700 cursor-pointer"
              />
            </div>
          ) : (
            <div>
              <label className="block text-xs font-medium text-neutral-400 mb-1">
                URL de la Imagen *
              </label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://ejemplo.com/imagen.jpg"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-neutral-600"
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-neutral-400 mb-1">
                Categoría (Slug)
              </label>
              <input
                type="text"
                value={categorySlug}
                onChange={(e) => setCategorySlug(e.target.value)}
                placeholder="anime, cyberpunk..."
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-neutral-600"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-400 mb-1">
                Resolución
              </label>
              <select
                value={resolution}
                onChange={(e) => setResolution(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-neutral-600"
              >
                <option value="1080p">1080p (Full HD)</option>
                <option value="2K">2K (QHD)</option>
                <option value="4K">4K (Ultra HD)</option>
                <option value="8K">8K (Ultra HD)</option>
              </select>
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-3 border-t border-neutral-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-neutral-400 hover:text-white transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 text-sm font-medium bg-white text-black rounded-lg hover:bg-neutral-200 disabled:opacity-50 flex items-center gap-2 transition-colors"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              {loading ? 'Publicando...' : 'Publicar Fondo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}