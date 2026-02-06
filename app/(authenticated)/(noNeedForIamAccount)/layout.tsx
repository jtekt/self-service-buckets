import { getIamUser } from "@/lib/actions/users";
import { redirect } from "next/navigation";

export default async function IamAuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const iam = await getIamUser();
  if (iam) {
    redirect("/");
  }

  return children;
}
