"use client";
import {
  Dispatch,
  createContext,
  SetStateAction,
  useState,
  useEffect,
} from "react";

interface iThemeContext {
  mode: string;
  setMode: Dispatch<SetStateAction<string>>;
}

const ThemeContext = createContext<iThemeContext | null>(null);

const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [mode, setMode] = useState("dark");
  const handleChangeMode = () => {
    if (
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      setMode("dark");
      document.documentElement.classList.add("dark");
    } else {
      setMode("light");
      document.documentElement.classList.remove("dark");
    }
  };
  useEffect(() => {
    handleChangeMode();
  }, [mode]);

  return <ThemeContext value={{ mode, setMode }}>{children}</ThemeContext>;
};

export { ThemeProvider, ThemeContext };
