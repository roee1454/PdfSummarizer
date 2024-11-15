import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma";
import { getChat } from "@/services/server";

export async function GET(request: NextRequest, { params }: any) {
  return getChat(request, params);
}

export async function PUT(request: NextRequest, { params }: any) {
  const formData = await request.formData();

  try {
    const message = await prisma.message.create({
      data: {
        chatId: (await params).chatId,
        content: formData.get("question") as string,
        type: "message",
        createdAt: new Date(Date.now()),
      },
    });

    return NextResponse.json({ ...message }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Failed to create chat!" },
      { status: 500 }
    );
  }
}
