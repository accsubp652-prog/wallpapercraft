const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando la carga de datos de prueba...');

  // 1. Crear Categorías
  const anime = await prisma.category.upsert({
    where: { slug: 'anime' },
    update: {},
    create: { name: 'Anime & Manga', slug: 'anime' },
  });

  const nature = await prisma.category.upsert({
    where: { slug: 'nature' },
    update: {},
    create: { name: 'Naturaleza', slug: 'nature' },
  });

  const cyberpunk = await prisma.category.upsert({
    where: { slug: 'cyberpunk' },
    update: {},
    create: { name: 'Cyberpunk & Sci-Fi', slug: 'cyberpunk' },
  });

  // 2. Crear Usuario Artista de Prueba
  const artist = await prisma.user.upsert({
    where: { email: 'artista@wallpapercraft.com' },
    update: {},
    create: {
      email: 'artista@wallpapercraft.com',
      name: 'Neo Visuals',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      isPremium: true,
    },
  });

  // 3. Crear Fondos de Pantalla
  await prisma.wallpaper.createMany({
    data: [
      {
        title: 'Neon Tokyo Alley',
        description: 'Callejón futurista iluminado con luces de neón en 4K.',
        imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
        thumbnailUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=400&q=80',
        authorId: artist.id,
        categoryId: cyberpunk.id,
        resolution: '4K',
      },
      {
        title: 'Mountain Sunset',
        description: 'Cumbres nevadas bajo un atardecer cálido.',
        imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
        thumbnailUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=400&q=80',
        authorId: artist.id,
        categoryId: nature.id,
        resolution: '4K',
      },
      {
        title: 'Abstract Fluid',
        description: 'Obras de arte fluido y minimalista para pantallas OLED.',
        imageUrl: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1200&q=80',
        thumbnailUrl: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=400&q=80',
        authorId: artist.id,
        categoryId: anime.id,
        resolution: '8K',
        isExclusive: true,
        price: 1.99,
      },
    ],
  });

  console.log('✅ Base de datos poblada exitosamente.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });