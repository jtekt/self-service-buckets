import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ReturnHome() {
  return (
    <Link href="/" className="inline-flex items-center gap-1">
      <ArrowLeft />
      <span>Return</span>
    </Link>
  );
}
