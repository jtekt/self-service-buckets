"use client";

import { Button } from "@/components/ui/button";
import { LogInIcon } from "lucide-react";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  return (
    <div className="max-w-sm w-full mx-auto flex flex-col items-center justify-center gap-6 flex-1">
      <h2 className="text-2xl">Login</h2>
      <Button onClick={() => signIn("keycloak")}>
        <LogInIcon />
        Continue with Keycloak
      </Button>
    </div>
  );
}
