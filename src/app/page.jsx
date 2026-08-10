import { prisma } from '@/lib/prisma';
import WallpaperGrid from '@/components/WallpaperGrid';
import Navbar from '@/components/Navbar'; // Asegúrate de importar tu Navbar si lo tienes en componentes

export const revalidate = 0;

export default async function HomePage({ searchParams }) {
  const params = await searchParams;
  const selectedCategory = params?.category;
  const searchQuery = params?.search;

  const whereClause = {};

  if (selectedCategory) {
    whereClause.category = {
      slug: selectedCategory,
    };
  }

  if (searchQuery) {
    whereClause.OR = [
      { title: { contains: searchQuery, mode: 'insensitive' } },
      { description: { contains: searchQuery, mode: 'insensitive' } },
    ];
  }

  const wallpapers = await prisma.wallpaper.findMany({
    where: whereClause,
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      category: true,
      author: {
        select: {
          id: true,
          name: true,
          avatarUrl: true,
        },
      },
    },
  });

  const formattedWallpapers = wallpapers.map((wallpaper) => ({
    ...wallpaper,
    price: Number(wallpaper.price),
    createdAt: wallpaper.createdAt.toISOString(),
  }));

  return (
    <main className="min-h-screen bg-neutral-950 text-white pb-16">
      {/* Contenedor principal de la interfaz */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Encabezado y título */}
        <header className="mb-8 border-b border-neutral-800 pb-6">
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-white">
            Explora Fondos de Pantalla
          </h1>
          <p className="mt-2 text-sm text-neutral-400">
            Descubre y descarga fondos de alta resolución subidos por la comunidad.
          </p>
        </header>

        {/* Grilla de contenidos */}
        {formattedWallpapers.length > 0 ? (
          <WallpaperGrid wallpapers={formattedWallpapers} />
        ) : (
          <div className="text-center py-20 bg-neutral-900/50 rounded-2xl border border-neutral-800">
            <p className="text-neutral-400 text-lg">
              No se encontraron fondos de pantalla.
            </p>
            <p className="text-neutral-600 text-sm mt-1">
              ¡Sé el primero en subir uno utilizando el botón de publicación!
            </p>
          </div>
        )}
      </section>
    </main>
  );
}