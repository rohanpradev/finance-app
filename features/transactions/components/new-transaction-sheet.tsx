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
import { useCreateTransaction } from "@/features/transactions/api/use-create-transaction";
import { TransactionForm } from "@/features/transactions/components/transaction-form";
import { useNewTransaction } from "@/features/transactions/hooks/use-new-transaction";
import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { Loader2 } from "lucide-react";

type Category = InferSelectModel<typeof categories>;
type Account = InferSelectModel<typeof accounts>;

export const NewTransactionSheet = () => {
  const { isOpen, onClose } = useNewTransaction();
  const createMutation = useCreateTransaction();

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
    createMutation.isPending ?? categoryMutation.isPending ?? accountMutation.isPending;

  const isLoading = categoryQuery.isLoading ?? accountQuery.isLoading;

  const onSubmit = (v: InferInsertModel<typeof transactions>) => {
    createMutation.mutate(v, {
      onSuccess: () => onClose(),
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>New Transaction</SheetTitle>
          <SheetDescription>Create a new account to track your transactions.</SheetDescription>
        </SheetHeader>
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="size-4 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <TransactionForm
            onSubmit={onSubmit}
            disabled={isPending}
            categoryOptions={categoryOptions}
            onCreateCategory={onCreateCategory}
            accountOptions={accountOptions}
            onCreateAccount={onCreateAccount}
          />
        )}
      </SheetContent>
    </Sheet>
  );
};
