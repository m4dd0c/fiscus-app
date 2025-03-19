"use client";
import AreaChart from "@/components/dashboard/AreaChart";
import Notifier from "@/components/dashboard/Notifier";
import PieChart from "@/components/dashboard/PieChart";
import LilHeading from "@/components/shared/LilHeading";
import Loader from "@/components/shared/Loader";
import { useStore } from "@/hook/useStore";
import { useEffect } from "react";

export default function Dashboard() {
  const { transactions, fetchTransactions, loading, accounts, fetchAccounts } =
    useStore();

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  useEffect(() => {
    if (accounts.length === 0) fetchAccounts();
  }, [accounts, fetchAccounts]);

  return loading ? (
    <Loader />
  ) : accounts.length === 0 ? (
    <div className="place-items-center grid">No Bank Account Added Yet.</div>
  ) : (
    <div className="w-11/12 py-5 mx-auto">
      <LilHeading title="Insight" subTitle="Get overview of your Accounts" />
      <div className="flex flex-wrap justify-evenly gap-2 my-2">
        <PieChart transactions={transactions} />
        <Notifier />
      </div>
      <div>
        <AreaChart transactions={transactions} />
      </div>
    </div>
  );
}
