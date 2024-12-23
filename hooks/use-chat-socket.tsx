'use client';

import { Message } from "@/types";
import { useWebSocket } from "next-ws/client";
import { useEffect, useState } from 'react';


export default function useChatSocket(chatId: string, previousMessages: Message[] = []) {
  const ws = useWebSocket();
  const [messages, setMessages] = useState<Message[]>(previousMessages);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isProcessingMessage, setIsProcessingMessage] = useState<boolean>(false);

  useEffect(() => {
    // Happens when the client recieves a message
    async function onMessage(event: MessageEvent) {
      const content =
        typeof event.data === 'string' ? event.data : await event.data.text();
      const message: Message = {
        content,
        chatId,
        createdAt: new Date(Date.now()),
        type: "reply",
      };
      console.log(message);

      // TODO: Save server message on database

      setMessages((p) => {
        const filteredPrerviousMessages = p.filter(message => message.type !== "loading");
        return [...filteredPrerviousMessages, message];
      });
      setIsProcessingMessage(false);
    }

    function onConnection() {
      console.log(`Connected to chat session: ${chatId}`)
      setIsConnected(true);
    }

    ws?.addEventListener('open', onConnection);
    ws?.addEventListener("message", onMessage);
    return () => {
      ws?.removeEventListener("open", onConnection);
      ws?.removeEventListener("message", onMessage);
    };
  }, [ws])


  function sendMessage(content: string) {
    setIsProcessingMessage(true);
    setMessages(prev => [...prev, newMessage]);
    // TODO: POST message to database...
    setMessages(prev => [...prev, { chatId, content: "", createdAt: new Date(), type: "loading", }])
    ws?.send(content);
    const newMessage: Message = { chatId, createdAt: new Date(Date.now()), content, type: "message" };
  }

  function sendLastMessage(msg: Message) {
    setIsProcessingMessage(true);
    setMessages(prev => [...prev, { chatId, content: "", createdAt: new Date(), type: "loading" }])
    ws?.send(msg.content);
  }


  return { messages, sendMessage, sendLastMessage ,isConnected, isProcessingMessage };
}