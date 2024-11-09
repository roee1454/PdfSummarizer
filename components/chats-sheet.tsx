"use client";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "./ui/skeleton";
import Link from "next/link";
import { MessageCircleCode } from "lucide-react";
import axios from "axios";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

interface ChatsSheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => any;
}

export default function ChatsSheet({ open, onOpenChange }: ChatsSheetProps) {
    const SkeletonLoader = () => {
        return <Skeleton className="w-full h-full p-6"></Skeleton>;
    };

    const router = useRouter();

    const isLoading = false;
    const chats = [
        { id: 1, title: "Chat 1" },
        { id: 2, title: "Chat 2" },
    ];

    const handleLogout = async () => {
        try {
            await axios.post("/api/auth/logout");

            toast({
                title: "התנתקות בוצעה בהצלחה",
                description: "התנתקות בוצעה בהצלחה.",
                variant: "default",
            });

            router.refresh();
        } catch (error) {
            console.error("Logout failed", error);
            toast({
                title: "התנתקות נכשלה",
                description: "אנא נסה להתנתק מאוחר יותר.",
                variant: "destructive",
            });
        }
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent dir="rtl" className="w-full h-full" side={"left"}>
                <SheetHeader>
                    <SheetTitle>צ'אטים אחרונים</SheetTitle>
                    <SheetDescription>
                        כל הצ'אטים האחרונים שהתרחשו במערכת
                    </SheetDescription>
                </SheetHeader>
                {isLoading ? (
                    <SkeletonLoader />
                ) : (
                    <div className="w-full h-full flex flex-col py-4 justify-start items-center">
                        {chats && chats.length > 0 ? (
                            chats.map((chat, index) => {
                                return (
                                    <Link
                                        onClick={() => onOpenChange(!open)}
                                        key={index}
                                        href={`/chat/${chat.id}`}
                                        className="cursor-pointer flex flex-row justify-between items-center p-2 transition-all hover:bg-slate-300 hover:bg-opacity-50 rounded-md w-full"
                                    >
                                        <div className="font-bold">
                                            {chat.title.slice(0, 20) + "..."}
                                        </div>
                                        <MessageCircleCode size={32} />
                                    </Link>
                                );
                            })
                        ) : (
                            <div className="text-xl text-muted-foreground">
                                אין צ'אטים קיימים כרגע
                            </div>
                        )}
                        <button
                            onClick={handleLogout}
                            className="w-full mt-4 p-2 bg-red-500 text-white rounded-md"
                        >
                            התנתק
                        </button>
                    </div>
                )}
            </SheetContent>
        </Sheet>
    );
}
