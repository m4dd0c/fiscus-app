"use client";

import { useEffect } from "react";
import Loader from "@/components/shared/Loader";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useStore } from "@/hook/useStore";
import LilHeading from "@/components/shared/LilHeading";

const Transactions = () => {
  const { transactions, fetchTransactions, loading, accounts, fetchAccounts } =
    useStore();
  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  return (
    <div className="p-6">
      <LilHeading
        title="Transactions"
        subTitle="Take a look at your Transactions"
      />
      {loading ? (
        <Loader />
      ) : accounts.length === 0 ? (
        <div className="h-[91vh] grid place-items-center">
          No Bank Account Added Yet.
        </div>
      ) : (
        <div className="border rounded-xl overflow-y-scroll h-[80vh] shadow-md">
          <Table>
            <TableHeader>
              <TableRow className="">
                <TableHead className="w-1/4">Date</TableHead>
                <TableHead className="w-1/2">Description</TableHead>
                <TableHead className="w-1/4 text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((tx: any) => (
                <TableRow key={tx.transaction_id} className="">
                  <TableCell>{tx.date}</TableCell>
                  <TableCell>{tx.name}</TableCell>
                  <TableCell
                    className={`text-right ${tx.amount < 0 ? "text-red-500" : "text-green-500"}`}
                  >
                    ${tx.amount.toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default Transactions;
