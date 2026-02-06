import ReturnHome from "@/components/return-home";
import { Button } from "@/components/ui/button";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item";
import { getUserKeys } from "@/lib/actions/users";
import { PlusIcon } from "lucide-react";
import Link from "next/link";

export default async function Page() {
  const keys = await getUserKeys();

  return (
    <div>
      <ReturnHome />
      <div className="flex justify-between items-center">
        <h2 className="text-2xl my-4">My keys</h2>
        <div>
          <Button asChild>
            <Link href="/keys/new">
              <PlusIcon />
              <span>Create</span>
            </Link>
          </Button>
        </div>
      </div>
      <div className="flex flex-col">
        {keys &&
          keys.map((k) => (
            <Item variant="outline" key={k.AccessKeyId}>
              <ItemContent>
                <ItemTitle>{k.AccessKeyId}</ItemTitle>
                <ItemDescription>
                  Creation date: {k.CreateDate?.toDateString()}
                </ItemDescription>
              </ItemContent>
            </Item>
          ))}
      </div>
    </div>
  );
}
