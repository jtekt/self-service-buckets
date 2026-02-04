"use client";

import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { data: session, status } = useSession();

  return (
    <>
      {session?.user ? (
        children
      ) : (
        <div>
          <div>You must be authenticated to see this resource</div>
          <div>
            <Button asChild>
              <Link href="/login">Login</Link>
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
