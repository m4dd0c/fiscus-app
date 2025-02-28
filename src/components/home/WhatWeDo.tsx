import { Box, Lock, Search, Settings, Sparkles } from "lucide-react";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import Heading from "../shared/Heading";

export function WhatWeDo() {
 return (
  <div className="p-4 space-y-2 bg-black">
   <Heading>What we do</Heading>
   <ul className="grid grid-cols-1 grid-rows-none gap-4 md:grid-cols-12 md:grid-rows-3 lg:gap-4 xl:max-h-[34rem] xl:grid-rows-2">
    <GridItem
     area="md:[grid-area:1/1/2/7] xl:[grid-area:1/1/2/5]"
     icon={<Box className="h-4 w-4 text-black dark:text-neutral-400" />}
     title="📊 See all your family’s finances in one place."
     description="Track bank accounts, properties, and investments with real-time updates, ensuring complete financial clarity."
    />

    <GridItem
     area="md:[grid-area:1/7/2/13] xl:[grid-area:2/1/3/5]"
     icon={<Settings className="h-4 w-4 text-black dark:text-neutral-400" />}
     title="🤖 Make better financial decisions with AI."
     description="Get personalized recommendations on budgeting, spending, and investments to grow your family’s wealth efficiently."
    />

    <GridItem
     area="md:[grid-area:2/1/3/7] xl:[grid-area:1/5/3/8]"
     icon={<Lock className="h-4 w-4 text-black dark:text-neutral-400" />}
     title="⏰ Never miss an important financial deadline."
     description="Receive notifications for bill payments, tax deadlines, and policy renewals, so you always stay ahead."
    />

    <GridItem
     area="md:[grid-area:2/7/3/13] xl:[grid-area:1/8/2/13]"
     icon={<Sparkles className="h-4 w-4 text-black dark:text-neutral-400" />}
     title="🔒 Control who sees what."
     description="Admins, family members, and accountants get customized access, ensuring privacy while keeping finances organized."
    />

    <GridItem
     area="md:[grid-area:3/1/4/13] xl:[grid-area:2/8/3/13]"
     icon={<Search className="h-4 w-4 text-black dark:text-neutral-400" />}
     title="🔗 Stay updated with real-time financial data."
     description="Seamlessly integrate with banks, Google Sheets, and cloud storage for up-to-date transactions and records."
    />
   </ul>
  </div>
 );
}

interface GridItemProps {
 area: string;
 icon: React.ReactNode;
 title: string;
 description: React.ReactNode;
}

const GridItem = ({ area, icon, title, description }: GridItemProps) => {
 return (
  <li className={`min-h-[14rem] list-none ${area}`}>
   <div className="relative h-full rounded-2.5xl border  p-2  md:rounded-3xl md:p-3">
    <GlowingEffect
     spread={40}
     glow={true}
     disabled={false}
     proximity={64}
     inactiveZone={0.01}
    />
    <div className="relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-xl border-0.75 p-6  dark:shadow-[0px_0px_27px_0px_#2D2D2D] md:p-6">
     <div className="relative flex flex-1 flex-col justify-between gap-3">
      <div className="w-fit rounded-lg border border-gray-600 p-2 ">{icon}</div>
      <div className="space-y-3">
       <h3 className="pt-0.5 text-xl/[1.375rem] font-semibold font-sans -tracking-4 md:text-2xl/[1.875rem] text-balance text-black dark:text-white">
        {title}
       </h3>
       <h2
        className="[&_b]:md:font-semibold [&_strong]:md:font-semibold font-sans text-sm/[1.125rem] 
              md:text-base/[1.375rem]  text-black dark:text-neutral-400"
       >
        {description}
       </h2>
      </div>
     </div>
    </div>
   </div>
  </li>
 );
};
