'use client';

import { useSession } from 'next-auth/react';
import { getSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import type { Session } from 'next-auth';

export default function TestSession() {
  const { data: session, status } = useSession();
  const [clientSession, setClientSession] = useState<Session | null>(null);

  useEffect(() => {
    getSession().then(setClientSession);
  }, []);

  return (
    <div className="p-8">
      <h1>Session Debug</h1>
      <p>Status: {status}</p>
      <p>useSession: {JSON.stringify(session, null, 2)}</p>
      <p>getSession: {JSON.stringify(clientSession, null, 2)}</p>
    </div>
  );
}
