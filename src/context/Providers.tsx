"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "./ThemeContext";
import { dark } from "@clerk/themes";
import { StoreProvider } from "./StoreContext";

export default function Providers({ children }: { children: React.ReactNode }) {
 return (
  <ClerkProvider appearance={{ baseTheme: dark }}>
   <ThemeProvider>
    <StoreProvider>{children}</StoreProvider>
   </ThemeProvider>
  </ClerkProvider>
 );
}
