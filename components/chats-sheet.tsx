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
import { useEffect, useState, useMemo } from "react";
import { Chat } from "@/types";
import { useUser } from "@/context/user-provider";

interface ChatsSheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => any;
}

const SkeletonLoader = () => {
    return <Skeleton className="w-full h-12 p-6"></Skeleton>;
};

export default function ChatsSheet({ open, onOpenChange }: ChatsSheetProps) {
    
    const [chats, setChats] = useState<Chat[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const user = useUser();

    useEffect(() => {
        if (user && user.id) {
            async function fetchChats() {
                setIsLoading(true)
                const res = await axios.get(`/api/chats?userId=${user?.id}`)
                if (res.status !== 200 || !res.data) return []
                setChats(res.data.chats.toSorted((a: Chat, b: Chat) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
                setIsLoading(false)
            }
            fetchChats()
        }
    }, [user])

    const router = useRouter();

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
            <SheetContent dir="rtl" className="w-full h-full bg-gradient-to-r from-blue-800 to-purple-900 dark:bg-gradient-to-r dark:from-background dark:to-indigo-900 text-white border-none" side={"left"}>
                <SheetHeader>
                    <SheetTitle className="text-white">צ'אטים אחרונים</SheetTitle>
                    <SheetDescription className="text-white">
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
                                        href={`/main/${chat.id}`}
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
