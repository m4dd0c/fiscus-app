"use client";
import { InvoiceCard } from "@/components/dashboard/InvoiceCard";
import { useStore } from "@/hook/useStore";
import React, { useEffect } from "react";

const Page = () => {
  const { fetchInvoices, invoices } = useStore();
  const data = {
    sourceUsername: "m4dd0c",
    destinationUsername: "og_nitesh",
    amount: 100,
    transferId: `https://sandbox-api.opennode.co/v1/withdrawal/${crypto.randomUUID()}`,
    sourceAccountId: crypto.randomUUID(),
    destinationAccountId: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };

  useEffect(() => {
    (async () => {
      await fetchInvoices();
    })();
  }, [fetchInvoices]);
  return (
    <div className="grid grid-cols-2 max-md:grid-cols-1 gap-3 p-10 container mx-auto overflow-y-auto h-screen pb-24">
      <InvoiceCard {...data} />
    </div>
  );
};

export default Page;
