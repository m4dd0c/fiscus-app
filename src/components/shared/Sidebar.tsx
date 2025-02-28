"use client";
import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "../ui/sidebar";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import Loader from "./Loader";
import { MdDashboard, MdInsights, MdAttachMoney } from "react-icons/md";
import { LuBot } from "react-icons/lu";
import { CiBank } from "react-icons/ci";
import { FaFileInvoiceDollar } from "react-icons/fa6";
import { AiOutlineTransaction } from "react-icons/ai";

const links = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: (
      <MdDashboard className="text-neutral-701 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
    ),
  },
  {
    label: "Insight",
    href: "/insight",
    icon: (
      <MdInsights className="text-neutral-701 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
    ),
  },
  {
    label: "Fiscus Ai",
    href: "/ai",
    icon: (
      <LuBot className="text-neutral-701 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
    ),
  },
  {
    label: "Transactions",
    href: "/transactions",
    icon: (
      <AiOutlineTransaction className="text-neutral-701 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
    ),
  },
  {
    label: "Accounts",
    href: "/accounts",
    icon: (
      <CiBank className="text-neutral-701 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
    ),
  },
  {
    label: "Transfer Funds",
    href: "/transfer",
    icon: (
      <MdAttachMoney className="text-neutral-701 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
    ),
  },
  {
    label: "Invoices",
    href: "/invoices",
    icon: (
      <FaFileInvoiceDollar className="text-neutral-701 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
    ),
  },
];

export function MainSidebar({ children }: { children: React.ReactNode }) {
  const { user, isLoaded } = useUser();
  const [open, setOpen] = useState(false);
  if (!user) return null;
  return !isLoaded ? (
    <Loader />
  ) : (
    <div
      className={cn(
        "flex flex-col md:flex-row w-full flex-1 mx-auto overflow-hidden",
        "h-[91vh]",
      )}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-11">
          <div className="flex flex-col flex-2 overflow-y-auto overflow-x-hidden">
            <div className="flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
          <div>
            <SidebarLink
              link={{
                label: user?.username || "Unknown",
                href: "#",
                icon: (
                  <Image
                    src={user.imageUrl}
                    className="h-8 w-7 flex-shrink-0 rounded-full"
                    width={49}
                    height={49}
                    alt="Avatar"
                  />
                ),
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>
      {children}
    </div>
  );
}
