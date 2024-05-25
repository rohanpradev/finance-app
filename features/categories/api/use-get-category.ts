import client from "@/lib/eden-client";
import { useQuery } from "@tanstack/react-query";

export const useGetCategory = (id?: string) => {
  const query = useQuery({
    enabled: !!id,
    queryKey: ["category", { id }],
    queryFn: async () => {
      try {
        const { data, error } = await client.api.categories({ id: id as string }).get();
        if (error) throw error;
        return data;
      } catch (error) {
        throw error;
      }
    },
  });
  return query;
};
