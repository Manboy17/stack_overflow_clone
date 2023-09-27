"use client";

import React, { useEffect, useState, createContext, useContext } from "react";

interface ThemeContextType {
  mode: string;
  setMode: (node: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState("");

  const handleChangeMode = () => {
    if (mode === "light") {
      setMode("light");
      document.documentElement.classList.add("light");
    } else {
      setMode("dark");
      document.documentElement.classList.add("dark");
    }
  };

  useEffect(() => {
    handleChangeMode();
  }, [mode]);

  return (
    <ThemeContext.Provider value={{ mode, setMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (context === undefined) {
    throw new Error("useTheme must be within a ThemeProvider");
  }

  return context;
}
