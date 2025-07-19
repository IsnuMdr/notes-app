import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { shareSchema } from '@/lib/validations';

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const validatedData = shareSchema.parse(body);

    // Check if note exists and user is the author
    const note = await prisma.note.findFirst({
      where: {
        id: validatedData.noteId,
        authorId: session.user.id,
      },
    });

    if (!note) {
      return NextResponse.json({ error: 'Note not found or unauthorized' }, { status: 404 });
    }

    // Find user to share with
    const userToShareWith = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (!userToShareWith) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if already shared
    const existingShare = await prisma.noteShare.findUnique({
      where: {
        noteId_sharedWithId: {
          noteId: validatedData.noteId,
          sharedWithId: userToShareWith.id,
        },
      },
    });

    if (existingShare) {
      return NextResponse.json({ error: 'Note already shared with this user' }, { status: 400 });
    }

    // Create share
    await prisma.noteShare.create({
      data: {
        noteId: validatedData.noteId,
        sharedWithId: userToShareWith.id,
      },
    });

    return NextResponse.json({ message: 'Note shared successfully' });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to share note' },
      { status: 500 },
    );
  }
}
