import ReturnTo from "@/components/return-to";
import { Button } from "@/components/ui/button";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item";
import { getUserBuckets } from "@/lib/actions/buckets";
import { PlusIcon } from "lucide-react";
import Link from "next/link";

export default async function Page() {
  const res = await getUserBuckets();
  
  return (
    <div className="space-y-4">
      <ReturnTo to="/" />
      <div className="flex justify-between items-center">
        <h2 className="text-2xl">My buckets</h2>
        <div>
          <Button asChild>
            <Link href="/buckets/new">
              <PlusIcon />
              <span>Create</span>
            </Link>
          </Button>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        {res.Buckets?.map((b) => (
          <Item variant="outline" key={b.BucketArn}>
            <ItemContent>
              <ItemTitle>{b.Name}</ItemTitle>
              <ItemDescription>Region: {b.BucketRegion}</ItemDescription>
            </ItemContent>
          </Item>
        ))}
      </div>
    </div>
  );
}
