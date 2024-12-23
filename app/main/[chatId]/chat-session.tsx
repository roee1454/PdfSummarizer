'use client';
import { Chat } from "@/types";
import { WebSocketProvider } from "next-ws/client";
import ChatContainer from "./client";

interface ChatSessionProps {
    chat: Chat
}

export default function ChatSession({ chat }: ChatSessionProps) {

    const url = process.env.NODE_WEB_SOCKET_URL || "ws://localhost:5000"

    return (
        <WebSocketProvider url={url}>
            <ChatContainer chat={chat} />
        </WebSocketProvider>
    )
}