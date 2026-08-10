import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { v2 as cloudinary } from 'cloudinary';

// Configuración de credenciales de Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request) {
  try {
    const contentType = request.headers.get('content-type') || '';
    let title, description, imageUrl, categorySlug, resolution, isExclusive, price;

    // 1. Manejo de archivo adjunto (multipart/form-data)
    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      title = formData.get('title');
      description = formData.get('description');
      categorySlug = formData.get('categorySlug');
      resolution = formData.get('resolution');
      isExclusive = formData.get('isExclusive') === 'true';
      price = formData.get('price');

      const file = formData.get('file');
      if (!file) {
        return NextResponse.json(
          { error: 'No se adjuntó ningún archivo de imagen.' },
          { status: 400 }
        );
      }

      // Convertir el archivo a Buffer y subirlo a Cloudinary
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { folder: 'wallpapercraft' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(buffer);
      });

      imageUrl = uploadResult.secure_url;
    } else {
      // 2. Manejo de URL externa (application/json)
      const body = await request.json();
      title = body.title;
      description = body.description;
      imageUrl = body.imageUrl;
      categorySlug = body.categorySlug;
      resolution = body.resolution;
      isExclusive = body.isExclusive;
      price = body.price;
    }

    // Validación básica de campos obligatorios
    if (!title || !imageUrl) {
      return NextResponse.json(
        { error: 'El título y la imagen son obligatorios.' },
        { status: 400 }
      );
    }

    // Buscar o crear un usuario por defecto
    let user = await prisma.user.findFirst();
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: 'admin@wallpapercraft.com',
          name: 'Creador Admin',
        },
      });
    }

    // Buscar la categoría seleccionada
    let category = null;
    if (categorySlug) {
      category = await prisma.category.findUnique({
        where: { slug: categorySlug },
      });
    }

    // Guardar el registro en la base de datos de PostgreSQL (Railway)
    const newWallpaper = await prisma.wallpaper.create({
      data: {
        title,
        description: description || '',
        imageUrl,
        thumbnailUrl: imageUrl,
        resolution: resolution || '4K',
        isExclusive: Boolean(isExclusive),
        price: price ? parseFloat(price) : 0.0,
        authorId: user.id,
        categoryId: category ? category.id : null,
      },
    });

    return NextResponse.json(newWallpaper, { status: 201 });
  } catch (error) {
    console.error('Error detallado en el backend:', error);
    return NextResponse.json(
      { error: error.message || 'Error interno del servidor al procesar la imagen.' },
      { status: 500 }
    );
  }
}