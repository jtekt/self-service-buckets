import ReturnTo from "@/components/return-to";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { getUserKeys } from "@/lib/actions/users";
import { keyStatusVariant } from "@/lib/keys";
import { ChevronRightIcon, KeyIcon, PlusIcon } from "lucide-react";
import Link from "next/link";

export default async function Page() {
  const keys = await getUserKeys();

  const isLimitReached = keys && keys.length >= 2;

  return (
    <div className="space-y-4">
      <ReturnTo to="/" />

      {isLimitReached && (
        <Alert variant="warning">
          <AlertTitle>Key limit reached</AlertTitle>
          <AlertDescription>
            You have reached the maximum number of access keys (2). To create a
            new key, delete an existing one first.
          </AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-3xl font-bold tracking-tight">My Keys</h2>
        {isLimitReached ? (
          <Button disabled>
            <PlusIcon className="size-4" />
            <span>Create Key</span>
          </Button>
        ) : (
          <Button asChild>
            <Link href="/keys/new">
              <PlusIcon className="size-4" />
              <span>Create Key</span>
            </Link>
          </Button>
        )}
      </div>

      <div className="flex flex-col gap-1">
        {keys && keys.length > 0 ? (
          keys.map((k) => (
            <Item
              variant="outline"
              key={k.AccessKeyId}
              asChild
              className="group"
            >
              <Link
                href={"/keys/" + k.AccessKeyId}
                className="flex items-center p-4"
              >
                <ItemMedia>
                  <KeyIcon className="size-5" />
                </ItemMedia>

                <ItemContent className="flex-1">
                  <ItemTitle className="text-base font-semibold">
                    {k.AccessKeyId}
                  </ItemTitle>
                  <ItemDescription className="mt-1">
                    Creation date: {k.CreateDate?.toDateString()}
                  </ItemDescription>
                </ItemContent>

                <ItemActions>
                  <Badge
                    variant={k.Status ? keyStatusVariant[k.Status] : undefined}
                  >
                    {k.Status}
                  </Badge>
                  <ChevronRightIcon className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                </ItemActions>
              </Link>
            </Item>
          ))
        ) : (
          <Empty className="border-2 border-dashed bg-transparent py-12">
            <EmptyHeader>
              <EmptyMedia variant="icon" className="bg-muted">
                <KeyIcon className="h-10 w-10 text-muted-foreground" />
              </EmptyMedia>
              <EmptyTitle className="text-xl">No keys found</EmptyTitle>
              <EmptyDescription className="max-w-sm mx-auto">
                You haven&apos;t created any access keys yet. Create one to
                start using your buckets.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button asChild variant="outline" className="mt-4">
                <Link href="/keys/new">
                  <PlusIcon className="mr-2 size-4" />
                  Create your first key
                </Link>
              </Button>
            </EmptyContent>
          </Empty>
        )}
      </div>
    </div>
  );
}
