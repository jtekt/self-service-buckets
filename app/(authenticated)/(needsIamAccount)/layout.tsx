import { Button } from "@/components/ui/button";
import { getIamUser } from "@/lib/actions/users";
import Link from "next/link";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const iamUser = await getIamUser();

  return (
    <>
      {iamUser ? (
        children
      ) : (
        <div>
          <div>You need an IAM account to proceed</div>
          <div>
            <Button asChild>
              <Link href="/accounts/new">Create IAM</Link>
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
