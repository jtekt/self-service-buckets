"use client";
import { useSession } from "next-auth/react";

export default function LoginInfo() {
  const { data: session, status } = useSession();
  return <a href="/login">{session?.user?.name || "not logged in"}</a>;
}
