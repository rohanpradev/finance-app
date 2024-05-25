import client from "@/lib/eden-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (values: { name: string }) => {
      try {
        const { data, error } = await client.api.categories.index.post(values);
        if (error) throw error;
        return data;
      } catch (error) {
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category created");
    },
    onError: () => {
      toast.error("Failed to create a category");
    },
  });

  return mutation;
};
