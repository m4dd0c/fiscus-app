"use client";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import React, { useState, useCallback } from "react";
import { createContext } from "react";
import { toast } from "sonner";
import { transferSchema } from "@/lib/Schema/schema";
import { z } from "zod";

interface iStoreContext {
  user: any;
  accounts: any[];
  fetchAccounts: () => Promise<void>;
  loading: boolean;
  transactions: any[];
  fetchTransactions: () => Promise<void>;
  transferFunds: (data: z.infer<typeof transferSchema>) => Promise<void>;
}

const StoreContext = createContext<iStoreContext | null>(null);

const StoreProvider = ({ children }: { children: React.ReactNode }) => {
  const user = useUser();

  const [loading, setLoading] = useState(false);

  const [accounts, setAccounts] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);

  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/plaid/transactions");
      setTransactions(response.data.transactions);
    } catch (error) {
      toast("Error Fetching transactions");
    } finally {
      setLoading(false);
    }
  }, []);

  const transferFunds = useCallback(
    async (data: z.infer<typeof transferSchema>) => {
      try {
        console.log(data);
        await axios.post("/api/transfer", data);
      } catch (error) {
        toast("Error Fetching transactions");
      }
    },
    [],
  );

  const fetchAccounts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/plaid/accounts");
      setAccounts(response.data.accounts);
    } catch (err) {
      toast("Error Fetching Accounts.");
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <StoreContext
      value={{
        user,
        loading,
        accounts,
        fetchAccounts,
        transactions,
        transferFunds,
        fetchTransactions,
      }}
    >
      {children}
    </StoreContext>
  );
};

export { StoreContext, StoreProvider };
