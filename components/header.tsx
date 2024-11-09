"use client";

import logo from "@/assets/favicon.png";
import Link from "next/link";
import Image from "next/image";
import PressableIcon from "./pressable-icon";
import { MenuIcon } from "lucide-react";
import { useState } from "react";
import ChatsSheet from "./chats-sheet";
import ThemeToggle from "./theme-toggle";
import { useUser } from "@/context/user-provider";

export default function Header() {
    const [sheet, setSheet] = useState<boolean>(false);
    const handleSheetToggle = (open: boolean) => {
        setSheet(open);
    };
    const user = useUser();
    return (
        <div className="w-full h-full ">
            <ChatsSheet open={sheet} onOpenChange={handleSheetToggle} />
            <div className="flex flex-row justify-between items-center py-4">
                <Link
                    href="/"
                    className="flex flex-row justify-center items-center gap-x-4 "
                >
                    <Image
                        className="w-16 h-16 align-middle pointer-events-none shadow-md rounded-full"
                        src={logo}
                        alt="לוגו של החטל"
                    />
                    <h1 className="text-4xl md:text-6xl font-bold text-white">
                        דמ"צBot
                    </h1>
                </Link>
                <div className="flex flex-row items-center gap-x-2">
                    {user && (
                        <span className="text-white text-lg font-bold">
                            שלום, {user.fullName}
                        </span>
                    )}
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
