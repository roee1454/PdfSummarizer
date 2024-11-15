"use client";


import Link from "next/link";
import Image from "next/image";
import PressableIcon from "./pressable-icon";
import { Mail, MenuIcon } from "lucide-react";
import { useState } from "react";
import ChatsSheet from "./chats-sheet";
import ThemeToggle from "./theme-toggle";
import { useUser } from "@/context/user-provider";
import { Button } from "./ui/button";
import { DialogHeader, DialogFooter, Dialog, DialogContent, DialogTitle } from "./ui/dialog";

export default function Header() {
    const [sheet, setSheet] = useState<boolean>(false);
    const handleSheetToggle = (open: boolean) => {
        setSheet(open);
    };

    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const openDialog = () => setIsDialogOpen(true);
    const closeDialog = () => setIsDialogOpen(false);

    const user = useUser();
    return (
        <div className="w-full h-full ">
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
            <ChatsSheet open={sheet} onOpenChange={handleSheetToggle} />
            <div className="flex flex-row justify-between items-center py-4">
                <Link href="/main" className="mr-4">
                    <Image
                        src="/logos/hatal.png"
                        alt="Logo"
                        width={64}
                        height={64}
                        draggable={false}
                        className="shadow-md rounded-full select-none transition-transform duration-200 ease-in-out transform hover:scale-110 active:scale-90"
                    />
                </Link>
                <div className="flex flex-row items-center gap-x-2">
                    {user && (
                        <span className="text-white text-lg font-bold max-sm:hidden">
                            שלום, {user.fullName}
                        </span>
                    )}
                    <Button
                            variant="ghost"
                            className="text-white"
                            onClick={openDialog}
                        >
                            עזרה
                        </Button>
                    <ThemeToggle />
                    <PressableIcon
                        onClick={() => handleSheetToggle(!sheet)}
                        type="button"
                        icon={<MenuIcon />}
                    />
                </div>
            </div>
        </div>
    );
}
