'use client';
import { Chat } from "@/types";
import { WebSocketProvider } from "next-ws/client";
import ChatContainer from "./client";

interface ChatSessionProps {
    chat: Chat
}

export default function ChatSession({ chat }: ChatSessionProps) {
    return (
        <WebSocketProvider url="ws://localhost:5000">
            <ChatContainer chat={chat} />
        </WebSocketProvider>
    )
}