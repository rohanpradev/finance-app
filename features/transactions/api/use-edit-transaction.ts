import type { transactions } from "@/db/schema";
import client from "@/lib/eden-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { InferInsertModel } from "drizzle-orm";
import { toast } from "sonner";

export const useEditTransaction = (id: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (values: Partial<InferInsertModel<typeof transactions>>) => {
      try {
        const { data, error } = await client.api.transactions({ id }).patch(values as any);
        if (error) throw error;
        return data;
      } catch (error) {
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      toast.success("Transaction updated");
    },
    onError: () => {
      toast.error("Failed to edit transaction");
    },
  });

  return mutation;
};
