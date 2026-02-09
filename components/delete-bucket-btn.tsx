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
import { Trash2Icon } from "lucide-react";
import { deleteBucket } from "@/lib/actions/buckets";
import { Spinner } from "@/components/ui/spinner";
import { startTransition, useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function DeleteBucket({ name }: { name: string }) {
  const [state, action, pending] = useActionState(deleteBucket, null);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  function onConfirm() {
    startTransition(() => action(name));
  }

  useEffect(() => {
    if (state?.data) {
      setOpen(false);
      toast.success(`Bucket "${name}" was deleted successfully.`);
      router.push("/buckets")
    }
  }, [state, router, name]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="destructive"
          aria-label="Delete bucket"
        >
          <Trash2Icon />
        </Button>
      </DialogTrigger>

      <DialogContent className="space-y-2 sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Delete bucket</DialogTitle>
          <DialogDescription className="space-y-2">
            You are about to permanently delete the following bucket
          </DialogDescription>
        </DialogHeader>
        <div className="font-mono rounded bg-accent p-2">{name}</div>

        <p className="text-destructive">
          The bucket must be empty. This action cannot be undone.
        </p>

        {/* ✅ Error handling inside dialog */}
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

          <Button variant="destructive" onClick={onConfirm} disabled={pending}>
            {pending ? (
              <span className="flex items-center gap-2">
                <Spinner data-icon="inline-start" />
                Deleting…
              </span>
            ) : (
              "Delete bucket"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
