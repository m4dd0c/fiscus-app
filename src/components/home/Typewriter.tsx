import React from "react";
import { TypewriterEffectSmooth } from "../ui/typewriter-effect";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
export async function Typewriter() {
 const isAuth = await auth();
 const words = [
  {
   text: "Start",
  },
  {
   text: "Managing",
  },
  {
   text: "finance",
  },
  {
   text: "with",
  },
  {
   text: "Fiscus.",
   className: "text-blue-500 dark:text-blue-500",
  },
 ];
 return (
  <div className="flex flex-col items-center justify-center h-[40rem] bg-black">
   <p className="text-neutral-600 dark:text-neutral-200 text-xs sm:text-base  ">
    The road to freedom starts from here
   </p>
   <TypewriterEffectSmooth words={words} />
   <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 space-x-0 md:space-x-4">
    <Link
     className="w-40 h-10 rounded-xl grid place-items-center bg-white text-black border border-black text-sm"
     href={isAuth ? "/dashboard" : "/sign-up"}
    >
     Join Now
    </Link>
    <Link
     className="grid place-items-center w-40 h-10 rounded-xl bg-black border dark:border-white border-transparent text-white text-sm"
     href={isAuth ? "/ai" : "/sign-up"}
    >
     Ai ChatBot
    </Link>
   </div>
  </div>
 );
}
