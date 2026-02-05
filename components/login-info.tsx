"use client";
import { useSession } from "next-auth/react";
import { Button } from "./ui/button";
import { UserIcon } from "lucide-react";
import { LogOutIcon } from "lucide-react";
import Link from "next/link";

export default function LoginInfo() {
  const { data: session, status } = useSession();
  return (
    <Button asChild variant="outline">
      <Link href="/login">
        {" "}
        {session?.user ? (
          <>
            {" "}
            <UserIcon /> <span>{session?.user?.preferredUsername}</span>{" "}
          </>
        ) : (
          <>
            <LogOutIcon />
            <span>Login</span>
          </>
        )}
      </Link>
    </Button>
  );
}
