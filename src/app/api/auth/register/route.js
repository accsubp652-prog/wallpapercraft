import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req) {
  try {
    const { name, email } = await req.json();

    // 1. Validar que el correo electrónico sea obligatorio y válido
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'El correo electrónico es obligatorio.' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    // 2. Verificar si el usuario ya existe en la base de datos de PostgreSQL
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      // Si el usuario ya existe, devolvemos sus datos manteniendo su estado actual de suscripción
      return NextResponse.json(
        {
          message: 'Sesión iniciada correctamente.',
          user: {
            id: existingUser.id,
            name: existingUser.name,
            email: existingUser.email,
            isPremium: existingUser.isPremium,
            createdAt: existingUser.createdAt,
          },
        },
        { status: 200 }
      );
    }

    // 3. Si no existe, crear la cuenta asignando obligatoriamente isPremium: false (Plan Gratuito)
    const newUser = await prisma.user.create({
      data: {
        name: name && typeof name === 'string' && name.trim().length > 0 
          ? name.trim() 
          : 'Usuario Nuevo',
        email: normalizedEmail,
        isPremium: false, // Regla estricta: Plan Gratuito por defecto (sin permisos para subir imágenes)
      },
      select: {
        id: true,
        name: true,
        email: true,
        isPremium: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      {
        message: 'Cuenta creada exitosamente en el plan Gratuito.',
        user: newUser,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error en API de registro/autenticación:', error);
    return NextResponse.json(
      { error: 'Ocurrió un error en el servidor o en la conexión con PostgreSQL.' },
      { status: 500 }
    );
  }
}