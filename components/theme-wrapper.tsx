"use client";

import * as React from "react";
import { ThemeProvider } from "@/context/theme-provider";

export function ThemeWrapper({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = React.useState("dark");

    React.useEffect(() => {
        const storedTheme = window.localStorage.getItem("theme");
        if (storedTheme) {
            setTheme(storedTheme);
        }
    }, []);

    return (
        <ThemeProvider
            attribute="class"
            defaultTheme={theme}
            enableSystem
            disableTransitionOnChange
        >
            {children}
        </ThemeProvider>
    );
}
