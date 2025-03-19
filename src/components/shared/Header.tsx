"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { SignedIn, UserButton } from "@clerk/nextjs";
import ConnectBank from "@/components/dashboard/ConnectBank";

const Header = () => {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <header className="bg-neutral-900 z-50 flex justify-between items-center fixed top-0 inset-x-0 p-4 gap-4 h-16">
      <Link className="space-x-4 flex items-center" href="/">
        <span className="font-bold text-orange-500 text-5xl">₹</span>
        <span className="font-semibold text-2xl">Fiscus</span>
      </Link>
      <div className="space-x-4">
        <SignedIn>
          <div className="flex justify-center items-center gap-2">
            <ConnectBank />
            <UserButton />
          </div>
        </SignedIn>
      </div>
    </header>
  );
};

export default Header;
