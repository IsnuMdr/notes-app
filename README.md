# 📝 Note Taker App

> A modern, collaborative note-taking platform built with Next.js, featuring real-time sharing, rich text editing, and seamless user experience.

[![Next.js](https://img.shields.io/badge/Next.js-13+-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.0+-2D3748?logo=prisma)](https://www.prisma.io/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3.0+-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-336791?logo=postgresql)](https://www.postgresql.org/)

## ✨ Features

### 🔐 **Authentication & Security**

- Secure user registration and login
- Password strength validation with visual indicator
- Session management with NextAuth.js
- Password visibility toggle
- Protected routes and API endpoints

### 📝 **Rich Note Management**

- **Rich Text Editor** powered by Tiptap
- Create, edit, delete, and organize notes
- Auto-save functionality
- **Search & Filter** with advanced options
- **Pagination** for optimal performance
- Responsive grid layout

### 🤝 **Collaboration Features**

- **Share notes** with specific users via email
- **Public notes** for community sharing
- **Real-time comments** system
- Edit and delete own comments
- Activity tracking and notifications

### 🎨 **User Experience**

- **Fully responsive** design (mobile, tablet, desktop)
- **Dark/Light mode** support
- **Loading states** and smooth transitions
- **Keyboard shortcuts** for power users
- **Accessibility** compliance (WCAG 2.1)

### 🚀 **Performance & SEO**

- **Server-Side Rendering** (SSR) for optimal SEO
- **Static Site Generation** (SSG) where applicable
- **Image optimization** and lazy loading
- **Code splitting** and bundle optimization
- **Caching strategies** with React Query

## 🛠️ Tech Stack

### **Frontend**

- **[Next.js 15+](https://nextjs.org/)** - React framework with App Router
- **[React 18](https://reactjs.org/)** - UI library with concurrent features
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe development
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[ShadCN UI](https://ui.shadcn.com/)** - Modern, accessible components

### **Backend**

- **[Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)** - Serverless functions
- **[NextAuth.js](https://next-auth.js.org/)** - Authentication solution
- **[Prisma](https://www.prisma.io/)** - Type-safe database ORM
- **[PostgreSQL](https://www.postgresql.org/)** - Relational database

### **State Management**

- **[TanStack React Query](https://tanstack.com/query)** - Server state management
- **[React Hook Form](https://react-hook-form.com/)** - Form handling
- **[Zod](https://zod.dev/)** - Schema validation

### **Rich Text Editing**

- **[Tiptap](https://tiptap.dev/)** - Headless rich text editor
- **[DOMPurify](https://github.com/cure53/DOMPurify)** - HTML sanitization

### **Development Tools**

- **[ESLint](https://eslint.org/)** - Code linting
- **[Prettier](https://prettier.io/)** - Code formatting
- **[Husky](https://typicode.github.io/husky/)** - Git hooks (optional)

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and npm/yarn
- **PostgreSQL** database
- **Git** for version control

### 1. Clone Repository

```bash
git clone https://github.com/IsnuMdr/notes-app.git
cd notes-app
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Environment Setup

Create `.env.local` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/notes_db"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Optional: Generate secret with: openssl rand -base64 32
```

### 4. Database Setup

```bash
# Generate Prisma client
npm run db:generate

# Run database migrations
npm run db:migrate

# (Optional) Seed database with sample data
npm run db:seed
```

### 5. Run Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
prisma/                           # Database schema
src/
├── app/                          # Next.js 13+ App Router
│   ├── (auth)/                   # Authentication pages
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── api/                      # API endpoints
│   │   ├── auth/[...nextauth]/
│   │   ├── register/
│   │   ├── notes/
│   │   └── comments/
│   ├── (root)/                   # Main Pages
│   │   ├── my-notes
│   │   ├── notes
│   │   ├── public-notes
│   │   ├── shared-notes
│   │   ├── page.tsx
│   │   └── layout.tsx
│   └── layout.tsx                # Root layout
├── components/                   # Reusable components
│   ├── auth/                     # Auth components
│   ├── comments/                 # Comment components
│   ├── common/                   # Shared components
│   ├── notes/                    # Note components
│   └── ui/                       # Base UI components
├── hooks/                        # Custom React hooks
├── lib/                          # Utilities
├── providers/                    # React contexts
├── services/                     # API services
├── types/                        # TypeScript types
└── middleware.ts                 # Middleware authentication
```

## 🗄️ Database Schema

```sql
-- Users table
Users {
  id          String   @id @default(cuid())
  email       String   @unique
  fullname    String
  password    String   (hashed)
  createdAt   DateTime
  updatedAt   DateTime
}

-- Notes table
Notes {
  id          String   @id
  title       String
  content     String   (HTML)
  isPublic    Boolean  @default(false)
  authorId    String   (FK → Users.id)
  createdAt   DateTime
  updatedAt   DateTime
}

-- Comments table
Comments {
  id          String   @id
  content     String
  noteId      String   (FK → Notes.id)
  authorId    String   (FK → Users.id)
  createdAt   DateTime
  updatedAt   DateTime
}

-- Note sharing junction table
NoteShares {
  id             String   @id
  noteId         String   (FK → Notes.id)
  sharedWithId   String   (FK → Users.id)
  createdAt      DateTime
}
```

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Database
npm run db:generate  # Generate Prisma client
npm run db:migrate   # Run database migrations
npm run db:studio    # Open Prisma Studio
npm run db:seed      # Seed database
npm run db:reset     # Reset database
```

## 🌟 Key Features Demo

### Authentication Flow

- ✅ **Login** with email
- ✅ **Session Management** with automatic logout

### Note Management

- ✅ **Rich Text Editor** with formatting options
- ✅ **Auto-save** during editing
- ✅ **Search & Filter** notes by title, content, author
- ✅ **Pagination** for large note collections

### Collaboration

- ✅ **Share notes** via email invitation
- ✅ **Public sharing** with shareable links
- ✅ **Comments system** with real-time updates
- ✅ **Permission management** (view/edit)

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub**
2. **Connect to Vercel**
3. **Set Environment Variables**
4. **Deploy**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/IsnuMdr/notes-app)

### Environment Variables for Production

```env
DATABASE_URL="your-production-database-url"
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="your-production-secret"
```

### Database Hosting

- **[Neon](https://neon.tech/)** - Serverless PostgreSQL (recommended)

## 📊 Performance

- 📱 **Mobile-First**: Optimized for all devices
- 🔍 **SEO Optimized**: Server-side rendering

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Guidelines

- Follow **TypeScript** best practices
- Write **meaningful commit messages**
- Add **tests** for new features
- Update **documentation** as needed
- Follow **ESLint** and **Prettier** rules

## 📝 API Documentation

### Authentication Endpoints

```
POST /api/register          # User registration
POST /api/auth/signin       # User login
POST /api/auth/signout      # User logout
```

### Notes Endpoints

```
GET    /api/notes           # Get paginated notes
POST   /api/notes           # Create new note
GET    /api/notes/[id]      # Get specific note
PUT    /api/notes/[id]      # Update note
DELETE /api/notes/[id]      # Delete note
POST   /api/notes/share     # Share note with user
```

### Comments Endpoints

```
POST   /api/comments        # Create comment
PUT    /api/comments/[id]   # Update comment
DELETE /api/comments/[id]   # Delete comment
```

## 🐛 Known Issues

- [ ] Offline functionality not yet implemented
- [ ] File attachments support pending
- [ ] Advanced team management features in development

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Your Name** - _Initial work_ - [@IsnuMdr](https://github.com/IsnuMdr)

## 🙏 Acknowledgments

- **[Next.js Team](https://nextjs.org/)** - Amazing React framework
- **[Vercel](https://vercel.com/)** - Excellent deployment platform
- **[ShadCN](https://ui.shadcn.com/)** - Beautiful UI components
- **[Tiptap](https://tiptap.dev/)** - Powerful rich text editor

## 📞 Support

- 📧 **Email**: your.email@example.com
- 💬 **Discord**: [Join our community](https://discord.gg/yourserver)
- 🐛 **Issues**: [GitHub Issues](https://github.com/IsnuMdr/notes-app/issues)
- 📖 **Documentation**: [Wiki](https://github.com/IsnuMdr/notes-app/wiki)

---

<div align="center">

**⭐ Star this repo if you find it helpful!**

[Demo](https://your-demo-link.vercel.app) • [Documentation](https://github.com/IsnuMdr/notes-app/wiki) • [Report Bug](https://github.com/IsnuMdr/notes-app/issues) • [Request Feature](https://github.com/IsnuMdr/notes-app/issues)

Made with ❤️ by [Isnu Munandar](https://github.com/IsnuMdr)

</div>
