import { MainSidebar } from "@/components/shared/Sidebar";
import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
 return (
  <MainSidebar>
   <div className="w-full h-screen">{children}</div>
  </MainSidebar>
 );
};

export default layout;
