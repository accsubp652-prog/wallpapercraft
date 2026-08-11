import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req) {
  try {
    const contentType = req.headers.get('content-type') || '';
    let title, description, imageUrl, categorySlug, resolution, isExclusive, price, authorId;

    // 1. Extraer los datos según si vienen en FormData (archivos) o JSON (URLs externas)
    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      title = formData.get('title');
      description = formData.get('description');
      categorySlug = formData.get('categorySlug');
      resolution = formData.get('resolution');
      isExclusive = formData.get('isExclusive') === 'true';
      price = formData.get('price');
      authorId = formData.get('authorId');
      
      // NOTA: Si usas almacenamiento de imágenes (Cloudinary, AWS S3, etc.), la URL vendría del servicio subido.
      imageUrl = formData.get('imageUrl') || '/placeholder-wallpaper.jpg';
    } else {
      const body = await req.json();
      title = body.title;
      description = body.description;
      imageUrl = body.imageUrl;
      categorySlug = body.categorySlug;
      resolution = body.resolution;
      isExclusive = body.isExclusive;
      price = body.price;
      authorId = body.authorId;
    }

    // 2. Validar que exista un ID de usuario/autor en la petición
    if (!authorId) {
      return NextResponse.json(
        { error: 'Debes iniciar sesión para publicar un fondo de pantalla.' },
        { status: 401 }
      );
    }

    // 3. Buscar el usuario en la base de datos PostgreSQL mediante Prisma
    const user = await prisma.user.findUnique({
      where: { id: authorId },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'El usuario no existe o no se encuentra registrado en la base de datos.' },
        { status: 404 }
      );
    }

    // 4. RESTRICCIÓN DE PLAN: Verificar si la cuenta NO es Premium
    if (!user.isPremium) {
      return NextResponse.json(
        { 
          error: 'Tu cuenta pertenece al Plan Gratuito. La opción de publicar fondos está reservada exclusivamente a usuarios Premium.' 
        },
        { status: 403 }
      );
    }

    // 5. Vincular categoría opcional si se envió el slug
    let categoryRecord = null;
    if (categorySlug) {
      categoryRecord = await prisma.category.findUnique({
        where: { slug: categorySlug },
      });
    }

    // 6. Guardar el nuevo fondo de pantalla en PostgreSQL (Railway)
    const newWallpaper = await prisma.wallpaper.create({
      data: {
        title: title ? title.trim() : 'Fondo sin título',
        description: description ? description.trim() : '',
        imageUrl,
        thumbnailUrl: imageUrl,
        resolution: resolution || '4K',
        isExclusive: Boolean(isExclusive),
        price: price ? parseFloat(price) : 0,
        authorId: user.id,
        categoryId: categoryRecord ? categoryRecord.id : null,
      },
    });

    return NextResponse.json(
      {
        message: 'Fondo de pantalla publicado con éxito.',
        wallpaper: newWallpaper,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error en la API de subida de imágenes:', error);
    return NextResponse.json(
      { error: 'Ocurrió un error interno al intentar procesar la imagen en el servidor.' },
      { status: 500 }
    );
  }
}