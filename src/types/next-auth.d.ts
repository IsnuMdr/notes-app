import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      fullname: string;
    } & DefaultSession['user'];
  }

  interface User {
    fullname: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    fullname: string;
  }
}
