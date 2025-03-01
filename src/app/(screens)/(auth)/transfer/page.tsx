"use client";
import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { transferSchema } from "@/lib/Schema/schema";
import { useStore } from "@/hook/useStore";
import Loader from "@/components/shared/Loader";
import LilHeading from "@/components/shared/LilHeading";

function Page() {
  const { fetchAccounts, accounts, loading: accountLoading } = useStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const form = useForm<z.infer<typeof transferSchema>>({
    resolver: zodResolver(transferSchema),
    defaultValues: {
      from: "",
      to: "",
      amount: 0,
    },
  });

  const onSubmit = async (data: z.infer<typeof transferSchema>) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSuccess("Transfer successful!");
      form.reset();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (accounts.length === 0) fetchAccounts();
  }, [fetchAccounts, accounts]);

  return accountLoading ? (
    <Loader />
  ) : accounts.length === 0 ? (
    <div className="h-[91vh] grid place-items-center">
      No Bank Account Added Yet.
    </div>
  ) : (
    <div className="w-full h-[91vh] grid place-items-center">
      <div className="w-5/6 mx-auto border rounded-xl p-4">
        <LilHeading
          title="Transfer funds"
          subTitle="Transfer funds securely from one account to another."
        />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="from"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>From</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an account to transfer funds from." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {accounts.map((account) => (
                        <SelectItem
                          key={account.account_id}
                          value={account.account_id}
                        >
                          {account.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="to"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>To Account ID</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter an account ID to receive funds in."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount (USD)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Amount in USD"
                      type="number"
                      {...field}
                      onChange={(e) =>
                        field.onChange(Number(e.target.value) || 0)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={loading}>
              {loading ? "Processing..." : "Initiate Transfer"}
            </Button>
            {error && <p className="text-red-500">{error}</p>}
            {success && <p className="text-green-500">{success}</p>}
          </form>
        </Form>
      </div>
    </div>
  );
}

export default Page;
