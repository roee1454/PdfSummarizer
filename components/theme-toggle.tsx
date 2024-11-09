"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { Button } from "./ui/button";

export default function ThemeToggle() {
    const { theme, setTheme } = useTheme();

    const toggleTheme = () => {
        setTheme(theme === "dark" ? "light" : "dark");
    };

    return (
        <Button
            onClick={toggleTheme}
            variant="ghost"
            size="icon"
            className="p-3 rounded-full transition-all"
        >
            {theme === "dark" ? (
                <Sun className="w-8 h-8 text-yellow-500" />
            ) : (
                <Moon className="w-8 h-8 text-white" />
            )}
        </Button>
    );
}
