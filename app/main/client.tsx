"use client";

import { Paperclip, Send, Loader } from "lucide-react";
import FileCard from "@/components/file-card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button, buttonVariants } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { useUser } from "@/context/user-provider";
import { Chat, Message } from "@/types";
import { InputFormSchema, InputFormValues, validateFile } from '@/lib/files'

export default function Client() {

    const user = useUser();

    const form = useForm<InputFormValues>({
        resolver: zodResolver(InputFormSchema),
        defaultValues: {
            question: "",
            file: null
        }
    });

    const { replace } = useRouter();

    const [loading, setLoading] = useState<boolean>(false);

    const currentFile = form.watch("file");

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        form.clearErrors("file");
        const files: FileList = e.target.files!;
        if (files === undefined || files === null || files.length < 1) return form.setError("file", { message: "נכשל בבחירת תקייה, רענן ונסה שוב" });
        const result = validateFile(files[0])
        console.log(result)
        if (!(result instanceof Error)) return form.setValue("file", files[0]);
        else return form.setError("file", { message: result.message })
    }

    function handleFileRemove() {
        form.setValue("file", null);
    }

    async function handleFirstPrompt(values: InputFormValues) {
        const { file, question } = values;
        const formData = new FormData();
        formData.set("question", question);
        if (file) formData.set('file', file);
        setLoading(true);
        try {
            const chatData = { title: question.substring(0, 25).concat("..."), id: user?.id }
            const { data: chat } = await axios.post<Chat>("/api/chats", { ...chatData });
            await axios.put<Message>(`/api/chats/${chat.id}`, formData);
            replace(`/main/${chat.id}`)
        } catch (err) {
            console.error(`Error submitting prompt`)
        } finally {
            setLoading(false);
            form.reset();
        }

    }

    return <div className="w-full h-[70vh] text-white py-4">
        <div className="w-full h-full flex flex-col justify-center items-center space-y-4">
            <h1 className="text-center font-bold text-3xl sm:text-4xl md:text-6xl lg:text-7xl [text-shadow:_0_1px_0_rgb(0_0_0_/_40%)]">ניתן לעבוד על הדמ"צ כבר עכשיו</h1>
            <p className="font-normal text-xl max-sm:text-sm text-destructive-foreground dark:text-muted-foreground [text-shadow:_0_1px_0_rgb(0_0_0_/_40%)]">תתחילו בכך שתיתנו לנו דרישות התחלתיות לדמ"צ שלכם</p>
            <form className="min-w-[300px] max-w-[400px] flex flex-col gap-6" onSubmit={form.handleSubmit(handleFirstPrompt as any)}>
                <div className="relative">
                    <Input disabled={loading} placeholder="הקלידו את הדרישה ההתחלתית" className="pl-24 resize-none rounded-full shadow-xl focus-visible:ring-none focus-visible:border-none text-black dark:text-white" { ...form.register("question", { required: true }) } />
                    <Input disabled={loading} onChange={handleFileChange} id="files" type="file" className="hidden" />
                    {form.formState.errors.question && <p className="text-red-500 text-lg text-center">{form.formState.errors.question.message}</p>}
                    {form.formState.errors.file && <p className="text-red-500 text-lg text-center">{form.formState.errors.file.message}</p>}
                    <Label htmlFor="files" className={buttonVariants({
                        variant: "ghost",
                        className: "absolute top-0 left-10 cursor-pointer"
                    })}><Paperclip className="w-5 h-5 text-black dark:text-white" /></Label>    
                    <Button disabled={loading} variant={"ghost"} className="absolute top-0 left-0 rounded-full " type="submit">{ loading ? <Loader className="w-5 h-5 text-black dark:text-white" /> : <Send className="w-5 h-5 text-black dark:text-white" /> }</Button>
                </div>        
                { currentFile && <FileCard file={currentFile} handleRemove={handleFileRemove} /> }    
            </form>
        </div>
    </div>
}