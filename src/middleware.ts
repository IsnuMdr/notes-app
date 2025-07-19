import { withAuth } from 'next-auth/middleware';

export default withAuth(
  function middleware(req) {
    console.log(req.nextUrl.pathname);
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  },
);

export const config = {
  matcher: ['/', '/notes/:path*', '/api/notes/:path*', '/api/comments/:path*'],
};
