import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

interface FetchNotesParams {
  search?: string;
  filter?: string;
  page?: number;
  limit?: number;
}

export async function getNotesServerSide(params: FetchNotesParams = {}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    throw new Error('Unauthorized');
  }

  const { search = '', filter = 'all', page = 1, limit = 12 } = params;

  const skip = (page - 1) * limit;

  try {
    let whereCondition: Prisma.NoteWhereInput = {};

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
          author: { select: { id: true, fullname: true, email: true } },
          comments: {
            include: {
              author: { select: { id: true, fullname: true, email: true } },
            },
            orderBy: { createdAt: 'desc' },
          },
          shares: {
            include: {
              sharedWith: { select: { id: true, fullname: true, email: true } },
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

    return {
      notes,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  } catch (error) {
    console.error('Notes fetch error:', error);
    return {
      notes: [],
      pagination: { page: 1, limit: 10, total: 0, totalPages: 1, hasNext: false, hasPrev: false },
    };
  }
}

export async function getMyNotes(params: FetchNotesParams = {}) {
  return getNotesServerSide({ ...params, filter: 'my' });
}

export async function getPublicNotes(params: FetchNotesParams = {}) {
  return getNotesServerSide({ ...params, filter: 'public' });
}

export async function getSharedNotes(params: FetchNotesParams = {}) {
  return getNotesServerSide({ ...params, filter: 'shared' });
}
