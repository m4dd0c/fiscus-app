"use client";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import React, { useState, useCallback } from "react";
import { createContext } from "react";
import { toast } from "sonner";

interface iStoreContext {
  user: any;
  accounts: any[];
  fetchAccounts: () => Promise<void>;
  loading: boolean;
  transactions: any[];
  fetchTransactions: () => Promise<void>;
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
        fetchTransactions,
      }}
    >
      {children}
    </StoreContext>
  );
};

export { StoreContext, StoreProvider };
