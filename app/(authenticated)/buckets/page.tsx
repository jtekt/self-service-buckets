import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Page() {
  return (
    <div>
      <div className="flex justify-between items-center">
        <h2 className="text-2xl">Buckets</h2>
        <div>
          <Button asChild>
            <Link href="/buckets/new">Create new bucket</Link>
          </Button>
        </div>
      </div>
      <div>TODO: list of buckets here</div>
    </div>
  );
}
