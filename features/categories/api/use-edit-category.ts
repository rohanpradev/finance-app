import client from "@/lib/eden-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useEditCategory = (id: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (values: { name: string }) => {
      try {
        const { data, error } = await client.api.categories({ id }).patch(values);
        if (error) throw error;
        return data;
      } catch (error) {
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category updated");
    },
    onError: () => {
      toast.error("Failed to edit category");
    },
  });

  return mutation;
};
