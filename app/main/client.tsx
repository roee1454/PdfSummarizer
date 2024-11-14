"use client";

import { Paperclip, Send } from "lucide-react";
import FileCard from "@/components/file-card";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button, buttonVariants } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import axios from "axios";

const allowedExtensions = [
    ".js",
    ".ts",
    ".py",
    ".docx",
    ".pdf",
    ".xlsx",
    ".csv",
    ".txt",
    ".json",
];
const maxSizeMB = 10;
const maxSizeBytes = maxSizeMB * 1024 * 1024;

const validateFile = (file: File) => {
    if (!file) return;

    const fileExtension =
    "." +
    file.name
    .slice(((file.name.lastIndexOf(".") - 1) >>> 0) + 2)
    .toLowerCase();
    console.log(fileExtension);
    const fileSize = file.size;
    
    if (!allowedExtensions.includes(`${fileExtension}`)) {
        return new Error(
            `סוג קובץ לא נתמך, נא לעלות מהקבצים הבאים:\n${allowedExtensions.map(extension => `${extension}, `)}`
        );
    }
    
    if (fileSize > maxSizeBytes) {
        return new Error("גודל התקייה הוא מעל המותר (10MB).");
    }
};

const InputFormSchema = z.object({
    question: z
        .string()
        .min(1, { message: "יש לנסח הודעה ולא לשלוח משימה ריקה" })
        .max(2500, { message: "עברתם את האורך המקסימלי להודעה זו!" }),
    file: z.instanceof(File).nullable()
});

interface InputFormValues extends z.infer<typeof InputFormSchema> {}

export default function Client() {

    const form = useForm<InputFormValues>({
        resolver: zodResolver(InputFormSchema),
        defaultValues: {
            question: "",
            file: null
        }
    })

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
        formData.set("file", JSON.stringify(file));

        try {
            // Fetch for creating a prompt
            await axios.post("/api/chats", { ...formData })
            

        } catch (err) {
            console.error(`Error submitting prompt`)
        }

    }

    return <div className="w-full h-[70vh] text-white py-4">
        <div className="w-full h-full flex flex-col justify-center items-center space-y-4">
            <h1 className="text-center font-bold text-3xl sm:text-4xl md:text-6xl lg:text-7xl [text-shadow:_0_1px_0_rgb(0_0_0_/_40%)]">ניתן לעבוד על הדמ"צ כבר עכשיו</h1>
            <p className="font-normal text-xl max-sm:text-sm text-destructive-foreground dark:text-muted-foreground [text-shadow:_0_1px_0_rgb(0_0_0_/_40%)]">תתחילו בכך שתיתנו לנו דרישות התחלתיות לדמ"צ שלכם</p>
            <form className="min-w-[300px] max-w-[400px] flex flex-col gap-6" onSubmit={form.handleSubmit(handleFirstPrompt as any)}>
                <div className="relative">
                    <Input placeholder="הקלידו את הדרישה ההתחלתית" className="pl-24 resize-none rounded-full shadow-xl focus-visible:ring-none focus-visible:border-none text-black dark:text-white" { ...form.register("question", { required: true }) } />
                    <Input onChange={handleFileChange} id="files" type="file" className="hidden" />
                    {form.formState.errors.question && <p className="text-red-500 text-lg text-center">{form.formState.errors.question.message}</p>}
                    {form.formState.errors.file && <p className="text-red-500 text-lg text-center">{form.formState.errors.file.message}</p>}
                    <Label htmlFor="files" className={buttonVariants({
                        variant: "ghost",
                        className: "absolute top-0 left-10 cursor-pointer"
                    })}><Paperclip className="w-5 h-5 text-black dark:text-white" /></Label>    
                    <Button variant={"ghost"} className="absolute top-0 left-0 rounded-full " type="submit"><Send className="w-5 h-5 text-black dark:text-white" /></Button>
                </div>        
                { currentFile && <FileCard file={currentFile} handleRemove={handleFileRemove} /> }    
            </form>
        </div>
    </div>
}