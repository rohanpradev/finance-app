import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { accounts, categories, transactions } from "@/db/schema";
import { useCreateAccount } from "@/features/accounts/api/use-create-account";
import { useGetAccounts } from "@/features/accounts/api/use-get-accounts";
import { useCreateCategory } from "@/features/categories/api/use-create-category";
import { useGetCategories } from "@/features/categories/api/use-get-categories";
import { useDeleteTransaction } from "@/features/transactions/api/use-delete-transaction";
import { useEditTransaction } from "@/features/transactions/api/use-edit-transaction";
import { useGetTransaction } from "@/features/transactions/api/use-get-transaction";
import { TransactionForm } from "@/features/transactions/components/transaction-form";
import { useOpenTransaction } from "@/features/transactions/hooks/use-open-transaction";
import { useConfirm } from "@/hooks/use-confirm";
import { converAmountFromMiliUnits } from "@/lib/utils";
import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { Loader2 } from "lucide-react";

type Transaction = {
  categoryId: string;
  payee: string;
  amount: string;
  notes: string;
  accountId: string;
  date: Date;
};

type Category = InferSelectModel<typeof categories>;
type Account = InferSelectModel<typeof accounts>;

export const EditTransactionSheet = () => {
  const { isOpen, onClose, id } = useOpenTransaction();

  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure?",
    "You are about to delete this transaction",
  );

  const transactionQuery = useGetTransaction(id as string);
  const editMutation = useEditTransaction(id as string);
  const deleteMutation = useDeleteTransaction(id as string);

  const defaultValues = transactionQuery.data
    ? {
        accountId: transactionQuery.data.accountId,
        categoryId: transactionQuery.data.categoryId,
        amountInCents: converAmountFromMiliUnits(transactionQuery.data.amount as unknown as number),
        date: transactionQuery.data.date ? new Date(transactionQuery.data.date as any) : new Date(),
        payee: transactionQuery.data.payee,
        notes: transactionQuery.data.notes,
      }
    : {
        accountId: "",
        categoryId: "",
        amountInCents: "",
        date: new Date(),
        payee: "",
        notes: "",
      };

  const categoryQuery = useGetCategories();
  const categoryMutation = useCreateCategory();

  const accountQuery = useGetAccounts();
  const accountMutation = useCreateAccount();

  const onCreateAccount = (name: string) => {
    accountMutation.mutate({ name });
  };

  const onCreateCategory = (name: string) => {
    categoryMutation.mutate({ name });
  };

  const accountOptions = ((accountQuery.data as any) ?? []).map(({ name, id }: Account) => ({
    label: name,
    value: id,
  }));

  const categoryOptions = ((categoryQuery.data as any) ?? []).map(({ name, id }: Category) => ({
    label: name,
    value: id,
  }));

  const isPending =
    editMutation.isPending ??
    deleteMutation.isPending ??
    transactionQuery.isPending ??
    categoryMutation.isPending ??
    accountMutation.isPending;

  const onSubmit = (v: InferInsertModel<typeof transactions>) => {
    editMutation.mutate(v, {
      onSuccess: () => onClose(),
    });
  };

  const isLoading = transactionQuery.isLoading ?? categoryQuery.isLoading ?? accountQuery.isLoading;

  const handleDelete = async () => {
    const ok = await confirm();
    if (ok) {
      deleteMutation.mutate(undefined, {
        onSuccess: () => onClose(),
      });
    }
  };

  return (
    <>
      <ConfirmDialog />
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Edit Transaction</SheetTitle>
            <SheetDescription>Edit an exiting transaction.</SheetDescription>
          </SheetHeader>
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="size-4 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <TransactionForm
              id={id}
              defaultValues={defaultValues as any}
              onSubmit={onSubmit}
              disabled={isPending}
              categoryOptions={categoryOptions}
              onCreateCategory={onCreateCategory}
              accountOptions={accountOptions}
              onCreateAccount={onCreateAccount}
              onDelete={handleDelete}
            />
          )}
        </SheetContent>
      </Sheet>
    </>
  );
};
