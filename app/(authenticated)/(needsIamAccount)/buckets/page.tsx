import Link from "next/link";
import { PlusIcon } from "lucide-react";
import ReturnTo from "@/components/return-to";
import { Button } from "@/components/ui/button";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item";
import DeleteBucket from "@/components/delete-bucket-btn";
import { getUserBuckets } from "@/lib/actions/buckets";

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
            <ItemActions>
              {b.Name && <DeleteBucket name={b.Name} />}
            </ItemActions>
          </Item>
        ))}
      </div>
    </div>
  );
}
