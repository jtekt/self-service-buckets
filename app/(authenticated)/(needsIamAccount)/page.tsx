import { getIamUser } from "@/lib/actions/users";
import { Button } from "@/components/ui/button";
import {
  CylinderIcon,
  KeyIcon,
  UserCheckIcon,
  UserPlusIcon,
} from "lucide-react";
import Link from "next/link";

export default async function Page() {
  return (
    <>
      <h2 className="text-2xl my-2">Home</h2>

      <div className="flex flex-col gap-2">
        <Button asChild>
          <Link href="/keys">
            <KeyIcon />
            <span>Keys</span>
          </Link>
        </Button>

        <Button asChild>
          <Link href="/buckets">
            <CylinderIcon />
            <span>Buckets</span>
          </Link>
        </Button>
      </div>
    </>
  );
}
