export interface Chat {
    id: string,
    title: string,
    createdAt: Date,
    updatedAt: Date,
    prompts: Prompt[],
}

export interface Prompt {
    question: string,
    response: string,
    createdAt: Date,
    updatedAt: Date,
}

export interface User {
    id: string,
    fullName: string,
    username: string,
    passwordHash: string,
    chats: Chat[],
    prompts: Prompt[],
}


export type Prompts = Prompt[];
