import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trash } from "lucide-react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { z } from "zod";

const zodSchema = z.object({
  name: z.string(),
});

type FormSchema = z.infer<typeof zodSchema>;

type Props = {
  id?: string;
  defaultValues?: FormSchema;
  onSubmit: (v: FormSchema) => void;
  onDelete?: () => void;
  disabled?: boolean;
};

export const CategoryForm = ({ onSubmit, id, defaultValues, disabled, onDelete }: Props) => {
  const form = useForm<FormSchema>({
    defaultValues,
    resolver: zodResolver(zodSchema),
  });

  const handleSubmit = (values: FormSchema) => {
    onSubmit(values);
  };

  const handleDelete = () => {
    onDelete?.();
  };

  return (
    <Form {...form}>
      <form className="space-y-4 pt-4" onSubmit={form.handleSubmit(handleSubmit)}>
        <FormField
          name="name"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input disabled={disabled} placeholder="e.g. Food, Travel etc." {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <Button className="w-full" disabled={disabled}>
          {id ? "Save changes" : "Create category"}
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
            Delete category
          </Button>
        )}
      </form>
    </Form>
  );
};
