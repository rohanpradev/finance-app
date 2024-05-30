import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trash } from "lucide-react";
import { useForm } from "react-hook-form";

import { AmountInput } from "@/components/amount-input";
import { DatePicker } from "@/components/date-picker";
import { Select } from "@/components/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { transactions } from "@/db/schema";
import { converAmountToMiliUnits } from "@/lib/utils";
import type { InferInsertModel } from "drizzle-orm";
import { z } from "zod";

const zodSchema = z.object({
  date: z.coerce.date(),
  accountId: z.string(),
  categoryId: z.string().nullable().optional(),
  payee: z.string(),
  amountInCents: z.string(),
  notes: z.string().nullable().optional(),
});

type FormSchema = z.infer<typeof zodSchema>;

type Dropdown = Array<{ label: string; value: string }>;

type Props = {
  id?: string;
  defaultValues?: FormSchema;
  onSubmit: (v: InferInsertModel<typeof transactions>) => void;
  onDelete?: () => void;
  disabled?: boolean;
  accountOptions: Dropdown;
  categoryOptions: Dropdown;
  onCreateAccount: (name: string) => void;
  onCreateCategory: (name: string) => void;
};

export const TransactionForm = ({
  onSubmit,
  id,
  defaultValues,
  disabled,
  onDelete,
  categoryOptions,
  accountOptions,
  onCreateAccount,
  onCreateCategory,
}: Props) => {
  const form = useForm<FormSchema>({
    defaultValues,
    resolver: zodResolver(zodSchema),
  });

  const handleSubmit = (values: FormSchema) => {
    const amount = Number.parseFloat(values.amountInCents);
    const amountInMiliunits = converAmountToMiliUnits(amount);
    onSubmit({ ...values, amountInCents: amountInMiliunits });
  };

  const handleDelete = () => {
    onDelete?.();
  };

  return (
    <Form {...form}>
      <form className="space-y-4 pt-4" onSubmit={form.handleSubmit(handleSubmit)}>
        <FormField
          name="date"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <DatePicker disabled={disabled} onChange={field.onChange} value={field.value} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          name="accountId"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Account</FormLabel>
              <FormControl>
                <Select
                  options={accountOptions}
                  disabled={disabled}
                  placeholder="Select an account"
                  onCreate={onCreateAccount}
                  value={field.value as any}
                  onChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          name="categoryId"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <Select
                  options={categoryOptions}
                  disabled={disabled}
                  placeholder="Select a category"
                  onCreate={onCreateCategory}
                  value={field.value as any}
                  onChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          name="payee"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Payee</FormLabel>
              <FormControl>
                <Input disabled={disabled} placeholder="Add a payee" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          name="amountInCents"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <AmountInput disabled={disabled} placeholder="0.00" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          name="notes"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  disabled={disabled}
                  value={field.value ?? ""}
                  placeholder="Optional notes"
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button className="w-full" disabled={disabled}>
          {id ? "Save changes" : "Create account"}
        </Button>
        {!!id && (
          <Button
            type="button"
            disabled={disabled}
            onClick={handleDelete}
            className="w-full"
            variant="outline"
          >
            <Trash className="mr-2 size-4" />
            Delete acount
          </Button>
        )}
      </form>
    </Form>
  );
};
