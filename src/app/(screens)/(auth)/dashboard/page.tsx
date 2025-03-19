"use client";
import React, { useEffect, useState } from "react";
import { CiBank, CiStopwatch } from "react-icons/ci";
import { GoGraph } from "react-icons/go";
import { FaHome } from "react-icons/fa";
import { useStore } from "@/hook/useStore";
import Loader from "@/components/shared/Loader";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import LilHeading from "@/components/shared/LilHeading";
import {
  AccountDetail,
  AlertCard,
  SummaryCard,
} from "@/components/dashboard/Cards";

const Page = () => {
  const [summaryData, setSummaryData] = useState({
    totalBal: 99.99,
    investments: 99.99,
    propVal: 99.99,
  });
  const { fetchAccounts, transactions, fetchTransactions, accounts, loading } =
    useStore();

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  useEffect(() => {
    if (accounts && accounts.length > 0) {
      const totalBal = accounts.reduce(
        (prev, curr) => (prev += curr.balances.current),
        0,
      );
      setSummaryData((prev) => ({ ...prev, totalBal }));
    }
  }, [accounts]);

  const summary = [
    {
      title: "Total Balance",
      balance: summaryData.totalBal,
      icon: <CiBank size={18} />,
    },
    {
      title: "Investments",
      balance: summaryData.investments,
      icon: <GoGraph size={18} />,
    },
    {
      title: "Property Value",
      balance: summaryData.propVal,
      icon: <FaHome size={18} />,
    },
  ];

  return loading ? (
    <Loader />
  ) : (
    <div className="p-4 w-5/6 mx-auto mt-5 ">
      <LilHeading
        title="Financial Summary"
        subTitle="See your Financial Report."
      />
      <article className="space-y-10">
        <section className="grid grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1 gap-5">
          {summary.map((el) => (
            <SummaryCard
              key={el.title}
              title={el.title}
              balance={el.balance.toString()}
              icon={el.icon}
            />
          ))}
        </section>
        <section className="flex flex-wrap justify-center gap-4 border p-4 rounded-xl">
          <div className="w-full h-full">
            <LilHeading title="Accounts" subTitle="See your Linked Accounts." />
            {accounts.length === 0 ? (
              <div className="grid place-items-center h-full w-full">
                No Bank Account Added Yet!
              </div>
            ) : (
              accounts.map((account) => (
                <AccountDetail key={account.account_id} data={account} />
              ))
            )}
          </div>
          <div className="w-full">
            <LilHeading
              title="Transactions"
              subTitle="See your Recent Transactions."
            />
            <div className="border rounded-xl overflow-y-auto h-[40vh]">
              {accounts.length === 0 ? (
                <div className="grid place-items-center h-full w-full">
                  No Bank Account Added Yet!
                </div>
              ) : (
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
              )}
            </div>
          </div>
        </section>
        <section>
          <LilHeading
            title="Alerts & Reminders"
            subTitle="Take a look at Alerts & Reminders."
          />
          <div className="space-y-2">
            {alertsData.map((el) => (
              <AlertCard key={el.title} data={el} />
            ))}
          </div>
        </section>
      </article>
    </div>
  );
};

const alertsData = [
  {
    icon: <CiStopwatch size={25} />,
    title: "Credit Card Payment",
    desc: "Due in 1 days - March 9, 2025",
  },
  {
    icon: <FaHome size={25} />,
    title: "Home loan Deadline",
    desc: "Due in 5 days - March 14, 2025",
  },
  {
    icon: <CiStopwatch size={25} />,
    title: "Unusual Transaction detected",
    desc: "Amazon Purchase - $499.00",
  },
];

export default Page;
