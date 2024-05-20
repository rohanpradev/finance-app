import client from "@/lib/eden-client";
import { useQuery } from "@tanstack/react-query";

export const useGetAccount = () => {
  useQuery({
    queryKey: ["accounts"],
    queryFn: async () => {
      try {
        const { data, error } = await client.api.accounts.index.get();
        if (error) throw error;
        return data;
      } catch (error) {
        throw error;
      }
    },
  });
};
