import client from "@/lib/eden-client";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

export const useGetTransactions = () => {
  const params = useSearchParams();
  const from = params.get("from") ?? "";
  const to = params.get("to") ?? "";
  const accountId = params.get("accountId") ?? "";

  const query = useQuery({
    queryKey: ["transactions", { from, to, accountId }],
    queryFn: async () => {
      try {
        const { data, error } = await client.api.transactions.index.get({
          query: { accountId, from, to },
        });
        if (error) throw error;
        return data;
      } catch (error) {
        throw error;
      }
    },
  });
  return query;
};
