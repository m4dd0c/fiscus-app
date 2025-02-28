"use client";

import { useEffect } from "react";
import Loader from "@/components/shared/Loader";
import { useStore } from "@/hook/useStore";
import AccountCard from "@/components/shared/AccountCard";
import LilHeading from "@/components/shared/LilHeading";

const PlaidAccounts = () => {
  const { fetchAccounts, loading, accounts } = useStore();

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  return loading ? (
    <Loader />
  ) : (
    <div className="p-6 rounded-md shadow-md">
      <LilHeading
        title="Bank Accounts"
        subTitle="See your connected Bank Accounts."
      />

      <div className="flex flex-wrap justify-start gap-4 items-center">
        {accounts.length === 0 ? (
          <div className="h-[91vh] grid place-items-center">
            No Bank Account Added Yet!
          </div>
        ) : (
          accounts.map((account) => (
            <AccountCard account={account} key={account.account_id} />
          ))
        )}
      </div>
    </div>
  );
};
export default PlaidAccounts;
