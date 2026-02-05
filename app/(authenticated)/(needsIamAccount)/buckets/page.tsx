import ReturnHome from "@/components/return-home";
import { Button } from "@/components/ui/button";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item";
import { getUserBuckets } from "@/lib/actions/buckets";
import { Bucket } from "@aws-sdk/client-s3";
import { PlusIcon } from "lucide-react";
import Link from "next/link";

export default async function Page() {
  const res: any = await getUserBuckets();

  return (
    <div>
      <ReturnHome />
      <div className="flex justify-between items-center my-4">
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
      <div className="flex flex-col">
        {res.Buckets.map((b: Bucket) => (
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
