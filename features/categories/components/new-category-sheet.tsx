import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useCreateCategory } from "@/features/categories/api/use-create-category";
import { CategoryForm } from "@/features/categories/components/category-form";
import { useNewCategory } from "@/features/categories/hooks/use-new-category";

export const NewCategorySheet = () => {
  const { isOpen, onClose } = useNewCategory();
  const mutation = useCreateCategory();

  const onSubmit = (v: { name: string }) => {
    mutation.mutate(v, {
      onSuccess: () => onClose(),
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>New Category</SheetTitle>
          <SheetDescription>Create a new category to track your transactions.</SheetDescription>
        </SheetHeader>
        <CategoryForm
          defaultValues={{ name: "" }}
          onSubmit={onSubmit}
          disabled={mutation.isPending}
        />
      </SheetContent>
    </Sheet>
  );
};
