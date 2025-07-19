import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q');
  const type = searchParams.get('type') || 'all'; // 'all', 'my', 'shared', 'public'

  if (!query) {
    return NextResponse.json({ error: 'Search query is required' }, { status: 400 });
  }

  try {
    const andConditions: Prisma.NoteWhereInput[] = [
      {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { content: { contains: query, mode: 'insensitive' } },
        ],
      },
    ];

    // Apply type filter
    if (type === 'my') {
      andConditions.push({ authorId: session.user.id });
    } else if (type === 'shared') {
      andConditions.push({
        shares: { some: { sharedWithId: session.user.id } },
      });
    } else if (type === 'public') {
      andConditions.push({ isPublic: true });
    } else {
      // All accessible notes
      andConditions.push({
        OR: [
          { authorId: session.user.id },
          { shares: { some: { sharedWithId: session.user.id } } },
          { isPublic: true },
        ],
      });
    }

    const whereCondition: Prisma.NoteWhereInput = {
      AND: andConditions,
    };

    const notes = await prisma.note.findMany({
      where: whereCondition,
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
      orderBy: { updatedAt: 'desc' },
      take: 50, // Limit results
    });

    return NextResponse.json(notes);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to search notes' },
      { status: 500 },
    );
  }
}
