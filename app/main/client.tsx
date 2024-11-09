"use client";

import { Paperclip, Send } from "lucide-react";
import HelperCard from "@/components/helper-card";
import FileCard from "@/components/file-card";
import { HelperCardsData } from "@/assets/utils";
import {
    Form,
    FormField,
    FormItem,
    FormMessage,
    FormControl,
    FormLabel,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "@/components/ui/textarea";
import PressableIcon from "@/components/pressable-icon";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button, buttonVariants } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

const inputFormSchema = z.object({
    question: z
        .string()
        .min(1, { message: "יש לנסח הודעה ולא לשלוח משימה ריקה" })
        .max(2500, { message: "עברתם את האורך המקסימלי להודעה זו!" }),
    file: z.instanceof(File).optional().nullable(),
});

interface inputFormValues extends z.infer<typeof inputFormSchema> {}

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
            "סוג קובץ לא נתמך, נא לעלות מהקבצים הבאים: .js, .ts, .py, .docx, or .pdf file."
        );
    }

    if (fileSize > maxSizeBytes) {
        return new Error("File size exceeds the 10MB limit.");
    }
};

export default function Client() {
    const [loading, setLoading] = useState<boolean>(false);
    const [helperCardSelected, setHelperCardSelected] = useState<number | null>(
        null
    );

    const form = useForm<inputFormValues>({
        resolver: zodResolver(inputFormSchema),
        defaultValues: {
            question: "",
        },
    });

    const { push } = useRouter();

    function handleRemoveFile() {
        form.setValue("file", null);
    }

    const currentFile = form.watch("file");

    function InputForm() {
        async function handleSubmit(values: inputFormValues) {
            setLoading(true);
            try {
                const formData = new FormData();
                if (values.file) {
                    formData.set("file", values.file);
                }
                formData.set("question", values.question);
                console.log("Form submitted", formData);
            } catch (err: any) {
                if (err instanceof z.ZodError) {
                    form.setError("root", { message: err.errors[0].message });
                } else {
                    console.error(err);
                }
            } finally {
                form.reset();
                setLoading(false);
            }
        }

        return (
            <Form {...form}>
                <form
                    className="w-full flex justify-center items-center gap-5"
                    onSubmit={form.handleSubmit(handleSubmit)}
                >
                    <FormField
                        name="question"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem className="w-full gap-4">
                                <FormControl className="w-full">
                                    <Textarea
                                        disabled={loading}
                                        placeholder="נסח משימה כאן..."
                                        className="w-full border-2 shadow-sm text-black dark:text-white resize-none"
                                        {...form.register(field.name, {
                                            required: true,
                                        })}
                                    />
                                </FormControl>
                                <FormMessage />
                                {form.formState.errors.file && (
                                    <p className="text-md text-red-700">
                                        {form.formState.errors.file.message}
                                    </p>
                                )}
                            </FormItem>
                        )}
                    />
                    <FormField
                        name="file"
                        control={form.control}
                        render={() => {
                            return (
                                <FormItem>
                                    <FormLabel
                                        htmlFor="file"
                                        className={buttonVariants({
                                            variant: "ghost",
                                            size: "icon",
                                            className:
                                                "p-3 rounded-full cursor-pointer",
                                        })}
                                    >
                                        <Paperclip />
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            readOnly={loading}
                                            onChange={(e) => {
                                                e.preventDefault();
                                                if (e.target.files) {
                                                    const file =
                                                        e.target.files[
                                                            e.target.files
                                                                .length - 1
                                                        ];
                                                    const error =
                                                        validateFile(file);
                                                    if (error) {
                                                        return form.setError(
                                                            "file",
                                                            {
                                                                message:
                                                                    error.message,
                                                            }
                                                        );
                                                    }
                                                    return form.setValue(
                                                        "file",
                                                        file
                                                    );
                                                }
                                            }}
                                            id="file"
                                            className="hidden"
                                            type="file"
                                        />
                                    </FormControl>
                                </FormItem>
                            );
                        }}
                    />
                    {currentFile && (
                        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            <FileCard
                                file={currentFile}
                                handleRemoveFile={handleRemoveFile}
                            />
                        </div>
                    )}
                    <div className="flex justify-end gap-4">
                        <Button
                            type="submit"
                            className={buttonVariants({ variant: "ghost", size: "icon", className: "rounded-full bg-transparent p-3" })}
                        >
                            {loading ? "מעבד..." : <Send />}
                        </Button>
                    </div>
                </form>
            </Form>
        );
    }

    return (
        <div className="w-full min-h-[65vh] flex flex-col justify-center items-center gap-8">
            <h1 className="font-bold text-4xl space-y-12">טוב לראותכם!</h1>
            <p className="text-center">
                זה נראה שזו הפעם הפעם הראשונה שלכם כאן, הנה כמה דוגמאות למה
                שניתן לעשות בשימוש בלי שלנו:
            </p>
            <div className="w-full h-full flex flex-col justify-center items-center gap-24 mt-24">
                <div className="w-full h-full grid grid-cols-1 md:grid-cols-2 justify-items-center content-center gap-5">
                    {HelperCardsData.map((card, index) => (
                        <HelperCard {...card} key={index} />
                    ))}
                </div>

                {/* Added gap between helper cards and input */}
                <InputForm />
            </div>
        </div>
    );
}
