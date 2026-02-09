"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash2Icon, KeyIcon } from "lucide-react";
import { deleteUserAccessKey } from "@/lib/actions/users";
import { Spinner } from "@/components/ui/spinner";
import { startTransition, useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function DeleteKey({
  accessKeyId,
}: {
  accessKeyId: string;
}) {
  const [state, action, pending] = useActionState(
    deleteUserAccessKey,
    null
  );
  const [open, setOpen] = useState(false);
  const router = useRouter();

  function onConfirm() {
    startTransition(() => action(accessKeyId));
  }

  useEffect(() => {
    if (state?.data) {
      setOpen(false);
      toast.success(
        `Access key "${accessKeyId}" was deleted successfully.`
      );
      router.push("/keys");
    }
  }, [state, router, accessKeyId]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="destructive"
          aria-label="Delete access key"
        >
          <Trash2Icon />
        </Button>
      </DialogTrigger>

      <DialogContent className="space-y-2 sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Delete access key</DialogTitle>
          <DialogDescription>
            You are about to permanently delete the following access key
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-2 rounded bg-accent p-2 font-mono">
          <KeyIcon className="h-4 w-4 text-muted-foreground" />
          {accessKeyId}
        </div>

        <p className="text-destructive">
          Applications using this key will immediately lose access.
          This action cannot be undone.
        </p>

        {state?.error && (
          <div className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
            {state.error}
          </div>
        )}

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={pending}
          >
            Cancel
          </Button>

          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={pending}
          >
            {pending ? (
              <span className="flex items-center gap-2">
                <Spinner data-icon="inline-start" />
                Deleting…
              </span>
            ) : (
              "Delete access key"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}