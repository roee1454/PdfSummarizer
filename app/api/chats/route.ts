import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/prisma'

// Handler for GET requests on Chats
export async function GET(req: NextRequest) {
  try {
    const chats = await prisma.chat.findMany();
    return NextResponse.json(chats, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching chats' }, { status: 500 });
  }
}

// Handler for POST requests on Chats
export async function POST(req: NextRequest) {
  try {
    const { title, userId } = await req.json();
    const newChat = await prisma.chat.create({
      data: {
        title,
        userId,
      },
    });
    return NextResponse.json(newChat, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Error creating chat' }, { status: 500 });
  }
}

// Handler for PUT requests on Chats
export async function PUT(req: NextRequest) {
  try {
    const { id, title } = await req.json();
    const updatedChat = await prisma.chat.update({
      where: { id },
      data: { title },
    });
    return NextResponse.json(updatedChat, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Error updating chat' }, { status: 500 });
  }
}

// Handler for DELETE requests on Chats
export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    await prisma.chat.delete({
      where: { id },
    });
    return NextResponse.json(null, { status: 204 });
  } catch (error) {
    return NextResponse.json({ error: 'Error deleting chat' }, { status: 500 });
  }
}

