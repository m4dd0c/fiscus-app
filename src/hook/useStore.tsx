import { StoreContext } from "@/context/StoreContext";
import { useContext } from "react";

export const useStore = () => {
 const context = useContext(StoreContext);
 if (!context) {
  throw new Error("useStore must be used within StoreProvider!");
 }
 return context;
};
