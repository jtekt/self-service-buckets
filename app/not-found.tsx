import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
import { HomeIcon } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function NotFound() {
  const session = await auth();

  if (!session) redirect("/login");

  return (
    <Empty>
      <EmptyHeader>
        <EmptyTitle className="text-6xl">404</EmptyTitle>
        <EmptyDescription>Page not found</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button asChild>
          <Link href="/">
            <HomeIcon />
            Go to home
          </Link>
        </Button>
      </EmptyContent>
    </Empty>
  );
}
