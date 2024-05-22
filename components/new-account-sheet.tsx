import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useCreateAccount } from "@/features/accounts/api/use-create-account";
import { AccountForm } from "@/features/accounts/components/account-form";
import { useNewAccount } from "@/features/accounts/hooks/use-new-account";

export const NewAccountSheet = () => {
  const { isOpen, onClose } = useNewAccount();
  const mutation = useCreateAccount();

  const onSubmit = (v: { name: string }) => {
    mutation.mutate(v, {
      onSuccess: () => onClose(),
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>New Account</SheetTitle>
          <SheetDescription>Create a new account to track your transactions.</SheetDescription>
        </SheetHeader>
        <AccountForm
          defaultValues={{ name: "" }}
          onSubmit={onSubmit}
          disabled={mutation.isPending}
        />
      </SheetContent>
    </Sheet>
  );
};
