import type { transactions } from "@/db/schema";
import client from "@/lib/eden-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { InferInsertModel } from "drizzle-orm";
import { toast } from "sonner";

export const useCreateTransaction = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (values: InferInsertModel<typeof transactions>) => {
      try {
        const { data, error } = await client.api.transactions.index.post(values as any);
        if (error) throw error;
        return data;
      } catch (error) {
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      toast.success("Transaction created");
    },
    onError: () => {
      toast.error("Failed to create transaction");
    },
  });

  return mutation;
};
