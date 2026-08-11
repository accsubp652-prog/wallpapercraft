import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'El ID de usuario es requerido para actualizar la cuenta.' },
        { status: 400 }
      );
    }

    // 1. Buscar al usuario en PostgreSQL
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'El usuario no existe en la base de datos.' },
        { status: 404 }
      );
    }

    // 2. Modificar la variable isPremium a true
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { isPremium: true },
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
        message: '¡Felicidades! Tu cuenta ha sido actualizada al Plan Premium.',
        user: updatedUser,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error al actualizar el plan del usuario:', error);
    return NextResponse.json(
      { error: 'Error interno al actualizar la suscripción en PostgreSQL.' },
      { status: 500 }
    );
  }
}