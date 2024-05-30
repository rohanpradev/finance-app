import client from "@/lib/eden-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useDeleteTransactions = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (idList: string[]) => {
      try {
        const { data, error } = await client.api.transactions["bulk-delete"].delete({ idList });
        if (error) throw error;
        return data;
      } catch (error) {
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["transaction", { id }] });
      toast.success("Accounts deleted");
    },
    onError: () => {
      toast.error("Failed to delete accounts");
    },
  });

  return mutation;
};
