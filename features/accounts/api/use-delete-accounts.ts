import client from "@/lib/eden-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useDeleteAccount = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (values: { idList: string[] }) => {
      try {
        const { data, error } = await client.api.accounts.index.delete(values);
        if (error) throw error;
        return data;
      } catch (error) {
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      toast.success("Accounts deleted");
    },
    onError: () => {
      toast.error("Failed to delete accounts");
    },
  });

  return mutation;
};
