"use client";

import { Button } from "@/components/ui/button";
import { LogOutIcon } from "lucide-react";
import { signOut } from "next-auth/react";

export function LogoutButton() {
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
