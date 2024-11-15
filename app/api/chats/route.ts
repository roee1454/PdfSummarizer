import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma";

export async function GET(request: NextRequest) {
    try {
        const url = new URL(request.url);
        const userId = url.searchParams.get("userId");

        if (!userId) {
            return NextResponse.json(
                { message: "User id not provided!" },
                { status: 400 },
            );
        }

        const chats = await prisma.chat.findMany({ where: { userId } });

        return NextResponse.json({ chats }, { status: 200 })
    } catch (err) {
        console.log(err);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 },
        );
    }
}

export async function POST(request: NextRequest) {
    const { title, id } = await request.json();

    try {
        const newChat = await prisma.chat.create({
            data: {
                title,
                createdAt: new Date(Date.now()),
                userId: id,
            },
        });

        return NextResponse.json({ ...newChat }, { status: 200 });
    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { message: "Failed to create chat!" },
            { status: 500 },
        );
    }
}
