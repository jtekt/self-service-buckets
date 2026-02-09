import Link from "next/link";
import {
  ChevronRightIcon,
  DatabaseIcon,
  PlusIcon,
} from "lucide-react";
import ReturnTo from "@/components/return-to";
import { Button } from "@/components/ui/button";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { getUserBuckets } from "@/lib/actions/buckets";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

export default async function Page() {
  const buckets = await getUserBuckets();

  return (
    <div className="space-y-4">
      <ReturnTo to="/" />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-3xl font-bold tracking-tight">My Buckets</h2>
        <Button asChild className="shadow-sm">
          <Link href="/buckets/new">
            <PlusIcon className="mr-2 size-4" />
            <span>Create Bucket</span>
          </Link>
        </Button>
      </div>

      <div className="flex flex-col gap-1">
        {buckets && buckets.length > 0 ? (
          buckets.map((b) => (
            <Item variant="outline" key={b.BucketArn} asChild className="group">
              <Link
                href={"/buckets/" + b.Name}
                className="flex items-center p-4"
              >
                <ItemMedia>
                  <DatabaseIcon className="size-5" />
                </ItemMedia>

                <ItemContent className="flex-1">
                  <ItemTitle className="text-base font-semibold">
                    {b.Name}
                  </ItemTitle>
                  <ItemDescription className="mt-1">
                    {b.BucketRegion}
                  </ItemDescription>
                </ItemContent>

                <ItemActions>
                  <ChevronRightIcon className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                </ItemActions>
              </Link>
            </Item>
          ))
        ) : (
          /* Improved Empty State */
          <Empty className="border-2 border-dashed bg-transparent py-12">
            <EmptyHeader>
              <EmptyMedia variant="icon" className="bg-muted">
                <DatabaseIcon className="h-10 w-10 text-muted-foreground" />
              </EmptyMedia>
              <EmptyTitle className="text-xl">No buckets found</EmptyTitle>
              <EmptyDescription className="max-w-sm mx-auto">
                You haven&apos;t created any storage buckets yet. Create one to
                start uploading files.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button asChild variant="outline" className="mt-4">
                <Link href="/buckets/new">
                  <PlusIcon className="mr-2 size-4" />
                  Create your first bucket
                </Link>
              </Button>
            </EmptyContent>
          </Empty>
        )}
      </div>
    </div>
  );
}
