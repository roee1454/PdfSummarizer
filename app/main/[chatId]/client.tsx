// Todo: Client for chat bot UI + Socket Integration
"use client";

import { Chat, Message } from "@/types";
import { Button, buttonVariants } from "@/components/ui/button";
import useChatSocket from "@/hooks/use-chat-socket";
import { CornerDownLeft, Paperclip } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatInput } from "@/components/ui/chat/chat-input";
import MessagesContainer from "@/components/message-container";
import { InputFormSchema, InputFormValues, validateFile } from "@/lib/files";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import FileCard from "@/components/file-card";
import { useEffect } from "react";

interface ChatContainerProps {
    chat: Chat;
}

export default function ChatContainer({ chat }: ChatContainerProps) {
    // Upon enter, check whether the last messsage is type "message", if so, prompt it to the socket server for response (useful for first page entrence)
    const { messages, sendMessage, sendLastMessage ,isConnected, isProcessingMessage } =
        useChatSocket(chat.id, chat.messages);

    const form = useForm<InputFormValues>({
        resolver: zodResolver(InputFormSchema),
        defaultValues: {
            question: "",
            file: null,
        },
    });

    const currentFile = form.watch("file");

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        form.clearErrors("file");
        const files: FileList = e.target.files!;
        if (files === undefined || files === null || files.length < 1) {
            return form.setError("file", {
                message: "נכשל בבחירת תקייה, רענן ונסה שוב",
            });
        }
        const result = validateFile(files[0]);
        if (!(result instanceof Error)) return form.setValue("file", files[0]);
        else return form.setError("file", { message: result.message });
    }

    function handleFileRemove() {
        form.setValue("file", null);
    }

    async function handleSubmit(values: InputFormValues) {
        try {
            const { question } = values;
            sendMessage(question);
        } catch (err) {
            console.error(err);
        } finally {
            form.reset();
        }
    }

    useEffect(() => {
        console.log(isConnected);
        if (isConnected && messages[0].type === "message") {
            sendLastMessage(messages[0]);
        }
    }, [isConnected]);

    return (
        <div className="w-full h-screen">
            <div className="font-extrabold text-3xl sm:text-3xl md:text-5xl lg:text-6xl text-white text-center [text-shadow:_0_1px_0_rgb(0_0_0_/_40%)]">
                {chat.title}
            </div>
            <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] sm:w-[300px] sm:h-[400px] md:w-[600px] md:h-[400px] lg:w-[800px] lg:h-[600px] bg-background rounded-md shadow-xl">
                <ScrollArea className="p-6">
                    <MessagesContainer
                        messages={[...messages]}
                    />
                </ScrollArea>
                <form
                    className="w-full absolute bottom-0 rounded-t-none rounded-b-md border bg-background focus-within:ring-1 focus-within:ring-ring p-1"
                    onSubmit={form.handleSubmit(handleSubmit)}
                >
                    <ChatInput
                        disabled={isProcessingMessage}
                        {...form.register("question")}
                        placeholder="הקלד תשובה כאן..."
                        className="min-h-12 resize-none rounded-lg bg-background border-0 outline-none p-3 shadow-none focus-visible:ring-0"
                    />

                    <div className="flex items-center p-3 pt-0">
                        <Label
                            className={buttonVariants({
                                size: "icon",
                                variant: "ghost",
                            })}
                            htmlFor="file"
                        >
                            <Input
                                disabled={isProcessingMessage}
                                type="file"
                                id="file"
                                className="hidden"
                                onChange={handleFileChange}
                            />
                            <Paperclip className="size-4" />
                            <span className="sr-only">Attach file</span>
                        </Label>

                        {currentFile && (
                            <FileCard
                                file={currentFile}
                                handleRemove={handleFileRemove}
                            />
                        )}

                        <Button
                            disabled={isProcessingMessage}
                            size="sm"
                            className="mr-auto gap-1.5 text-white font-bold"
                        >
                            שלח תשובתך
                            <CornerDownLeft className="size-3.5" />
                        </Button>
                    </div>
                </form>
            </div>
            {form.formState.errors.question && (
                <p className="text-red-500 text-lg text-center">
                    {form.formState.errors.question.message}
                </p>
            )}
            {form.formState.errors.file && (
                <p className="text-red-500 text-lg text-center">
                    {form.formState.errors.file.message}
                </p>
            )}
        </div>
    );
}
