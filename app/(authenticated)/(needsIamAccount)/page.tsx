import { getIamUser } from "@/lib/actions/users";
import { Button } from "@/components/ui/button";
import { CylinderIcon, KeyIcon } from "lucide-react";
import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }

  const iam = await getIamUser();
  if (!iam) {
    redirect("/accounts/new");
  }

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h2 className="text-2xl font-semibold">
          Welcome, {session.user.name}
        </h2>
        <p className="text-sm text-muted-foreground">
          This self‑service portal lets you manage storage resources securely.
        </p>
      </header>

      {/* Actions */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-muted-foreground">
          Available actions
        </h3>

        <div className="flex flex-col gap-2">
          <Button asChild variant="outline">
            <Link href="/keys" className="flex items-center gap-2">
              <KeyIcon className="h-4 w-4" />
              <span>Manage access keys</span>
            </Link>
          </Button>

          <Button asChild variant="outline">
            <Link href="/buckets" className="flex items-center gap-2">
              <CylinderIcon className="h-4 w-4" />
              <span>Manage buckets</span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}