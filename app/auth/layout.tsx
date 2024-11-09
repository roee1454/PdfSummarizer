"use client";

import { ReactNode, useState } from "react";
import { CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import ThemeToggle from "@/components/theme-toggle"; // Import the ThemeToggle component
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog"; // Import Dialog components
import { Mail } from "lucide-react";

interface AuthLayoutProps {
    children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const openDialog = () => setIsDialogOpen(true);
    const closeDialog = () => setIsDialogOpen(false);

    return (
        <div className="min-h-screen flex flex-col">
            <header className="py-4">
                <div className="container mx-auto flex justify-between items-center px-4">
                    <div className="flex items-center">
                        <Link href="/auth/login" className="mr-4">
                            <Image
                                src="/logos/hatal.png"
                                alt="Logo"
                                width={64}
                                height={64}
                                draggable={false}
                                className="shadow-md rounded-full select-none transition-transform duration-200 ease-in-out transform hover:scale-110 active:scale-90"
                                onMouseDown={(e) => {
                                    const target =
                                        e.currentTarget as HTMLImageElement;
                                    if (target.dataset.pressTimer) {
                                        clearTimeout(
                                            Number(target.dataset.pressTimer)
                                        );
                                    }
                                    const pressTimer = setTimeout(() => {
                                        target.style.transition =
                                            "transform 1s";
                                        target.style.transform =
                                            "rotate(360deg)";
                                    }, 5000);
                                    target.dataset.pressTimer =
                                        pressTimer.toString();
                                }}
                                onMouseUp={(e) => {
                                    const target =
                                        e.currentTarget as HTMLImageElement;
                                    clearTimeout(
                                        Number(target.dataset.pressTimer)
                                    );
                                }}
                                onMouseLeave={(e) => {
                                    const target =
                                        e.currentTarget as HTMLImageElement;
                                    clearTimeout(
                                        Number(target.dataset.pressTimer)
                                    );
                                }}
                            />
                        </Link>
                    </div>
                    <div className="flex items-center space-x-4">
                        <Link href="/auth/login">
                            <Button variant="ghost" className="text-white">
                                התחברות
                            </Button>
                        </Link>
                        <Button
                            variant="ghost"
                            className="text-white"
                            onClick={openDialog}
                        >
                            עזרה
                        </Button>
                        <ThemeToggle />
                    </div>
                </div>
            </header>
            <main className="flex-grow">{children}</main>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>תמיכה טכנית</DialogTitle>
                        <div className="flex flex-col items-center space-y-4">
                            <p>אם אתה נתקל בבעיות טכניות, אנא שלח מייל ל:</p>
                            <div className="flex items-center space-x-2">
                                <Mail className="w-5 h-5 text-gray-500" />
                                <span>s9198207@army.org.il</span>
                            </div>
                            <Button
                                variant="outline"
                                className="flex items-center space-x-2"
                                onClick={() =>
                                    (window.location.href =
                                        "mailto:s9198207@army.org.il")
                                }
                            >
                                <Mail className="w-4 h-4" />
                                <span>שלח מייל</span>
                            </Button>
                        </div>
                    </DialogHeader>
                    <DialogFooter>
                        <Button onClick={closeDialog}>Close</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
