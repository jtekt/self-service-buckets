import { Button } from "@/components/ui/button";
import { CylinderIcon, KeyIcon, UserPlusIcon } from "lucide-react";
import Link from "next/link";

export default function Page() {
  return (
    <>
      <h2 className="text-2xl my-2">Home</h2>

      <div className="flex flex-col gap-2">
        <Button asChild>
          <Link href="/accounts/new">
            <UserPlusIcon />
            <span>Create account</span>
          </Link>
        </Button>
        <Button asChild>
          <Link href="/buckets/new">
            <CylinderIcon />
            <span>Create bucket</span>
          </Link>
        </Button>
        <Button asChild>
          <Link href="/keys/new">
            <KeyIcon />
            <span>Create key</span>
          </Link>
        </Button>
      </div>
    </>
  );
}
