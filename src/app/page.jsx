import { prisma } from '@/lib/prisma';
import WallpaperGrid from '@/components/WallpaperGrid';

// Deshabilitar la caché estática para reflejar nuevos fondos de inmediato
export const revalidate = 0;

export default async function HomePage({ searchParams }) {
  const params = await searchParams;
  const categorySlug = params?.category;
  const searchQuery = params?.q;

  // Construir el filtro para la consulta de Prisma
  const whereClause = {};

  if (categorySlug) {
    whereClause.category = {
      slug: categorySlug,
    };
  }

  if (searchQuery) {
    whereClause.OR = [
      { title: { contains: searchQuery, mode: 'insensitive' } },
      { description: { contains: searchQuery, mode: 'insensitive' } },
    ];
  }

  // Obtener los fondos de pantalla y sus relaciones desde PostgreSQL
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
          email: true,
          isPremium: true,
        },
      },
    },
  });

  // Obtener todas las categorías para la barra de filtros
  const categories = await prisma.category.findMany({
    orderBy: {
      name: 'asc',
    },
  });

  return (
    <main className="min-h-screen bg-neutral-950 text-white pb-20">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8 text-center">
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white mb-4">
          Descubre los mejores <span className="bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">Wallpapers</span>
        </h1>
        <p className="text-neutral-400 max-w-2xl mx-auto text-sm sm:text-base">
          Explora y descarga fondos de pantalla exclusivos en alta resolución creados por nuestra comunidad.
        </p>
      </section>

      {/* Galería / Grid de Fondos */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <WallpaperGrid wallpapers={wallpapers} categories={categories} />
      </section>
    </main>
  );
}