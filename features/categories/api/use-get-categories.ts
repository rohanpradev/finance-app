import client from "@/lib/eden-client";
import { useQuery } from "@tanstack/react-query";

export const useGetCategories = () => {
  const query = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      try {
        const { data, error } = await client.api.categories.index.get();
        if (error) throw error;
        return data;
      } catch (error) {
        throw error;
      }
    },
  });
  return query;
};
