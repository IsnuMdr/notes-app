import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { noteSchema } from '@/lib/validations';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const searchParams = request.nextUrl.searchParams;
  const isPublic = searchParams.get('public') === 'true';

  try {
    const notes = await prisma.note.findMany({
      where: isPublic
        ? { isPublic: true }
        : {
            OR: [
              { authorId: session.user.id },
              { shares: { some: { sharedWithId: session.user.id } } },
            ],
          },
      include: {
        author: {
          select: { id: true, username: true, email: true },
        },
        comments: {
          include: {
            author: {
              select: { id: true, username: true, email: true },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
        shares: {
          include: {
            sharedWith: {
              select: { id: true, username: true, email: true },
            },
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    return NextResponse.json(notes);
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const validatedData = noteSchema.parse(body);

    const note = await prisma.note.create({
      data: {
        ...validatedData,
        authorId: session.user.id,
      },
      include: {
        author: {
          select: { id: true, username: true, email: true },
        },
        comments: {
          include: {
            author: {
              select: { id: true, username: true, email: true },
            },
          },
        },
        shares: {
          include: {
            sharedWith: {
              select: { id: true, username: true, email: true },
            },
          },
        },
      },
    });

    return NextResponse.json(note, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
