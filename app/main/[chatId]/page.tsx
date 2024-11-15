// Todo: Fetch relevant data as Chat Info and Messages...

import axios from "axios";
import { Chat } from "@/types";
import ChatSession from "./chat-session";
import { notFound } from "next/navigation";

async function fetchChat(chatId: string): Promise<Chat> {
    const res = await axios.get(`http://localhost:3000/api/chats/${chatId}`);
    if ("message" in res.data) notFound();
    return res.data as Chat
}

export default async function ServerProps({ params }: { params: Promise<{ chatId: string }> }) {
    const { chatId } = (await params);
    // Fetch relevant data as Chat Info and Messages...
    const chat = await fetchChat(chatId);
    // Upon success render the chat container
    return <ChatSession chat={chat} />
}

