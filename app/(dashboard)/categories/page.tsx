"use client";

import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useDeleteCategory } from "@/features/categories/api/use-delete-category";
import { useGetCategories } from "@/features/categories/api/use-get-categories";
import { useNewCategory } from "@/features/categories/hooks/use-new-category";
import { Loader2, Plus } from "lucide-react";
import { columns } from "./columns";

const CategoriesPage = () => {
  const { onOpen } = useNewCategory();
  const categoriesQuery = useGetCategories();
  const deleteCategories = useDeleteCategory();

  const isDisabled = categoriesQuery.isLoading || deleteCategories.isPending;

  if (categoriesQuery.isLoading) {
    return (
      <div className="-mt-24 mx-auto w-full max-w-screen-2xl pb-10">
        <Card className="border-none drop-shadow-sm">
          <CardHeader>
            <Skeleton className="h-8 w-48" />
          </CardHeader>
          <CardContent>
            <div className="flex h-[500px] w-full items-center justify-center">
              <Loader2 className="size-6 animate-spin text-slate-300" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="-mt-24 mx-auto w-full max-w-screen-2xl pb-10">
      <Card className="border-none drop-shadow-sm">
        <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
          <CardTitle className="line-clamp-1 text-xl">Categories page</CardTitle>
          <Button size="sm" onClick={onOpen}>
            <Plus className="mr-2 size-4" />
            Add new
          </Button>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={categoriesQuery.data ?? []}
            filterKey="name"
            disabled={isDisabled}
            onDelete={rows => {
              const idList = rows.map(({ original: { id } }) => id);
              deleteCategories.mutate({ idList });
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default CategoriesPage;
