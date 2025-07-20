import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create demo users
  const hashedPassword = await bcrypt.hash('password123', 12);

  const user1 = await prisma.user.upsert({
    where: { email: 'john@example.com' },
    update: {},
    create: {
      email: 'john@example.com',
      fullname: 'John Doe',
      password: hashedPassword,
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'jane@example.com' },
    update: {},
    create: {
      email: 'jane@example.com',
      fullname: 'Jane Smith',
      password: hashedPassword,
    },
  });

  // Create demo notes
  const note1 = await prisma.note.create({
    data: {
      title: 'Welcome to NoteTaker',
      content: `This is your first note! You can:

                - Create new notes
                - Edit existing notes
                - Share notes with other users
                - Make notes public
                - Add comments to notes

                Start exploring and organizing your thoughts!`,
      isPublic: true,
      authorId: user1.id,
    },
  });

  const note2 = await prisma.note.create({
    data: {
      title: 'Project Ideas',
      content: `Here are some ideas for future projects:

                1. Mobile app for note taking
                2. Integration with cloud storage
                3. Real-time collaboration features
                4. Rich text editor
                5. File attachments

                Feel free to add your own ideas in the comments!`,
      isPublic: true,
      authorId: user2.id,
    },
  });

  // Create demo comments
  await prisma.comment.create({
    data: {
      content: 'This is a great starting point for new users!',
      noteId: note1.id,
      authorId: user2.id,
    },
  });

  await prisma.comment.create({
    data: {
      content: 'I love the idea of real-time collaboration!',
      noteId: note2.id,
      authorId: user1.id,
    },
  });

  // Share note between users
  await prisma.noteShare.create({
    data: {
      noteId: note2.id,
      sharedWithId: user1.id,
    },
  });

  console.log('Database seeded successfully!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
