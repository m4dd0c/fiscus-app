import React from "react";
import { Loader as Loading } from "lucide-react";

const Loader = () => {
 return (
  <div className="h-screen w-full grid place-items-center">
   <Loading className="animate-spin" />
  </div>
 );
};

export default Loader;
