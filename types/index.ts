export interface Chat {
    id: string,
    title: string,
    createdAt: Date,
    updatedAt: Date,
    messages: Message[],
}

export interface User {
    id: string,
    fullName: string,
    username: string,
    passwordHash: string,
}

export interface Message {
    chatId: string,
    createdAt: Date,
    content: string,
    type: "reply" | "message" | "loading"
}