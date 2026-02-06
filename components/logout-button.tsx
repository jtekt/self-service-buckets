"use client";

import { Button } from "@/components/ui/button";
import { LogOutIcon } from "lucide-react";
import { signOut, useSession } from "next-auth/react";

export function LogoutButton() {
  const { status } = useSession();

  if (status === "unauthenticated" || status === "loading") return null;

  return (
    <Button
      onClick={() => signOut()}
      variant="outline"
      size="icon"
    >
      <LogOutIcon />
    </Button>
  );
}
