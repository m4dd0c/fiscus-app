import React from "react";
import { Typewriter } from "@/components/home/Typewriter";
import { WhatWeDo } from "@/components/home/WhatWeDo";
import { Hero } from "@/components/home/Hero";

export default function Home() {
  return (
    <>
      <Hero />
      <WhatWeDo />
      <Typewriter />
    </>
  );
}
