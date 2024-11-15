"use server";

import { prisma } from "@/prisma";
import { Chat, Message } from "@/types";

export async function getChatById(chatId: string): Promise<Chat | null> {
  try {
    const chat = await prisma.chat.findFirst({ where: { id: chatId } });

    if (chat === undefined || !chat) return null;

    const messages = await prisma.message.findMany({
      where: { chatId },
      orderBy: { createdAt: "desc" },
    });

    return { ...chat, messages: messages as Message[], updatedAt: new Date() };
  } catch (err) {
    console.error(err);
    return null;
  }
}
