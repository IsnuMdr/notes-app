import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { noteSchema } from '@/lib/validations';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const searchParams = request.nextUrl.searchParams;
  const isPublic = searchParams.get('public') === 'true';
  const isShared = searchParams.get('shared') === 'true';
  const search = searchParams.get('search');
  const filter = searchParams.get('filter') || 'all';
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const skip = (page - 1) * limit;

  try {
    let whereCondition: Prisma.NoteWhereInput = {};

    if (isPublic) {
      whereCondition = { isPublic: true };
    } else if (isShared) {
      whereCondition = {
        shares: { some: { sharedWithId: session.user.id } },
      };
    } else {
      if (filter === 'my') {
        whereCondition = { authorId: session.user.id };
      } else if (filter === 'shared') {
        whereCondition = {
          shares: { some: { sharedWithId: session.user.id } },
        };
      } else if (filter === 'public') {
        whereCondition = { isPublic: true };
      } else {
        whereCondition = {
          OR: [{ authorId: session.user.id }, { isPublic: true }],
        };
      }
    }

    if (search) {
      const searchCondition = {
        OR: [
          { title: { contains: search, mode: 'insensitive' as const } },
          { content: { contains: search, mode: 'insensitive' as const } },
        ],
      };

      whereCondition = {
        AND: [whereCondition, searchCondition],
      };
    }

    const [notes, total] = await Promise.all([
      prisma.note.findMany({
        where: whereCondition,
        include: {
          author: { select: { id: true, username: true, email: true } },
          comments: {
            include: {
              author: { select: { id: true, username: true, email: true } },
            },
            orderBy: { createdAt: 'desc' },
          },
          shares: {
            include: {
              sharedWith: { select: { id: true, username: true, email: true } },
            },
          },
        },
        orderBy: { updatedAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.note.count({ where: whereCondition }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      notes,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error('Notes fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch notes' }, { status: 500 });
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
