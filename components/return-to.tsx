import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ReturnTo({ to }: { to: string }) {
  return (
    <Link href={to} className="inline-flex items-center gap-1">
      <ArrowLeft />
      <span>Return</span>
    </Link>
  );
}
