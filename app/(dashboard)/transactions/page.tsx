"use client";

import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useDeleteTransactions } from "@/features/transactions/api/use-delete-transactions";
import { useGetTransactions } from "@/features/transactions/api/use-get-transactions";
import { useNewTransaction } from "@/features/transactions/hooks/use-new-transaction";
import { Loader2, Plus } from "lucide-react";
import { columns } from "./columns";

const TransactionsPage = () => {
  const { onOpen } = useNewTransaction();
  const transactionsQuery = useGetTransactions();
  const deleteTransactions = useDeleteTransactions();

  const isDisabled = transactionsQuery.isLoading || deleteTransactions.isPending;

  if (transactionsQuery.isLoading) {
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
          <CardTitle className="line-clamp-1 text-xl">Transactions History</CardTitle>
          <Button size="sm" onClick={onOpen}>
            <Plus className="mr-2 size-4" />
            Add new
          </Button>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={transactionsQuery.data ?? []}
            filterKey="payee"
            disabled={isDisabled}
            onDelete={rows => {
              const idList = rows.map(({ original: { id } }) => id);
              deleteTransactions.mutate(idList);
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionsPage;
