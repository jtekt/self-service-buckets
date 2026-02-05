import { getIamUser } from "@/app/actions";
import { Button } from "@/components/ui/button";
import {
  CylinderIcon,
  KeyIcon,
  UserCheckIcon,
  UserPlusIcon,
} from "lucide-react";
import Link from "next/link";

export default async function Page() {
  // TODO: typing, caching
  const iamUser: any = await getIamUser();

  return (
    <>
      <h2 className="text-2xl my-2">Home</h2>

      <div className="flex flex-col gap-2">
        {iamUser ? (
          <>
            <Button disabled>
              <UserCheckIcon />
              <span>{iamUser.UserName}</span>
            </Button>

            <Button asChild>
              <Link href="/keys/new">
                <KeyIcon />
                <span>Create key</span>
              </Link>
            </Button>

            <Button asChild>
              <Link href="/buckets/new">
                <CylinderIcon />
                <span>Create bucket</span>
              </Link>
            </Button>
          </>
        ) : (
          <>
            <Button asChild>
              <Link href="/accounts/new">
                <UserPlusIcon />
                <span>Create account</span>
              </Link>
            </Button>

            <Button disabled>
              <KeyIcon />
              <span>Create key</span>
            </Button>

            <Button disabled>
              <CylinderIcon />
              <span>Create bucket</span>
            </Button>
          </>
        )}
      </div>
    </>
  );
}
