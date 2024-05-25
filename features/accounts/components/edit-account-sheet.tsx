import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useDeleteAccount } from "@/features/accounts/api/use-delete-accounts";
import { useEditAccount } from "@/features/accounts/api/use-edit-account";
import { useGetAccount } from "@/features/accounts/api/use-get-account";
import { AccountForm } from "@/features/accounts/components/account-form";
import { useOpenAccount } from "@/features/accounts/hooks/use-open-account";
import { useConfirm } from "@/hooks/use-confirm";
import { Loader2 } from "lucide-react";

export const EditAccountSheet = () => {
  const { isOpen, onClose, id } = useOpenAccount();

  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure?",
    "You are about to delete this transaction",
  );

  const accountQuery = useGetAccount(id as string);
  const editMutation = useEditAccount(id as string);
  const deleteMutation = useDeleteAccount();

  const defaultValues = (accountQuery.data ? { name: accountQuery.data.name } : { name: "" }) as {
    name: string;
  };

  const isPending = editMutation.isPending ?? deleteMutation.isPending;

  const onSubmit = (v: { name: string }) => {
    editMutation.mutate(v, {
      onSuccess: () => onClose(),
    });
  };

  const isLoading = accountQuery.isLoading;

  const handleDelete = async () => {
    const ok = await confirm();
    if (ok) {
      deleteMutation.mutate(
        { idList: [id as string] },
        {
          onSuccess: () => onClose(),
        },
      );
    }
  };

  return (
    <>
      <ConfirmDialog />
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Edit Account</SheetTitle>
            <SheetDescription>Edit an exiting account.</SheetDescription>
          </SheetHeader>
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="size-4 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <AccountForm
              id={id}
              defaultValues={defaultValues}
              onSubmit={onSubmit}
              disabled={isPending}
              onDelete={handleDelete}
            />
          )}
        </SheetContent>
      </Sheet>
    </>
  );
};
