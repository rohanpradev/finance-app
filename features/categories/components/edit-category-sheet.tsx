import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useDeleteCategory } from "@/features/categories/api/use-delete-category";
import { useEditCategory } from "@/features/categories/api/use-edit-category";
import { useGetCategory } from "@/features/categories/api/use-get-category";
import { CategoryForm } from "@/features/categories/components/category-form";
import { useOpenCategory } from "@/features/categories/hooks/use-open-category";
import { useConfirm } from "@/hooks/use-confirm";
import { Loader2 } from "lucide-react";

export const EditCategorySheet = () => {
  const { isOpen, onClose, id } = useOpenCategory();

  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure?",
    "You are about to delete this category",
  );

  const categoryQuery = useGetCategory(id as string);
  const editMutation = useEditCategory(id as string);
  const deleteMutation = useDeleteCategory();

  const defaultValues = (categoryQuery.data ? { name: categoryQuery.data.name } : { name: "" }) as {
    name: string;
  };

  const isPending = editMutation.isPending ?? deleteMutation.isPending;

  const onSubmit = (v: { name: string }) => {
    editMutation.mutate(v, {
      onSuccess: () => onClose(),
    });
  };

  const isLoading = categoryQuery.isLoading;

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
            <SheetTitle>Edit Category</SheetTitle>
            <SheetDescription>Edit an exiting category.</SheetDescription>
          </SheetHeader>
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="size-4 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <CategoryForm
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
