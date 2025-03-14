"use client";
import { InvoiceCard } from "@/components/dashboard/InvoiceCard";
import { useStore } from "@/hook/useStore";
import React, { useEffect } from "react";

const Page = () => {
  const { fetchInvoices, invoices } = useStore();

  useEffect(() => {
    (async () => {
      await fetchInvoices();
    })();
  }, [fetchInvoices]);
  return (
    <div className="grid grid-cols-2 max-md:grid-cols-1 gap-3 p-10 container mx-auto overflow-y-auto h-screen pb-24">
      {invoices &&
        invoices?.length > 0 &&
        invoices.map((invoice) => (
          <InvoiceCard
            destinationAccountId={invoice.destinationAccountId}
            sourceAccountId={invoice.sourceAccountId}
            sourceUsername={invoice.sourceUser.username}
            destinationUsername={invoice.destinationUser.username}
            transferId={invoice.transferId}
            amount={invoice.amount}
            createdAt={invoice.createdAt.toLocaleString()}
            key={invoice.id}
          />
        ))}
    </div>
  );
};

export default Page;
