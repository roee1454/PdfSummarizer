import { createChatSession } from "@/services/server";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    return createChatSession(request)
}