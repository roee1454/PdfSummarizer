"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useRouter } from "next/navigation";

const schema = z.object({
    fullName: z.string().min(2, { message: "שם מלא חייב להכיל לפחות 2 תווים" }),
    username: z.string().min(2, { message: "שם משתמש חייב להכיל לפחות 2 תווים" }),
    passwordHash: z.string().min(8, { message: "סיסמה חייבת להכיל לפחות 8 תווים" }),
});

export default function RegisterPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: {
            fullName: "",
            username: "",
            passwordHash: "",
        },
    });

    async function onSubmit(data: z.infer<typeof schema>) {
        setLoading(true);
        setError(null);
        try {
            const validatedData = schema.parse(data);
            console.log(validatedData);
            await axios.post("http://localhost:3000/api/auth/register", { ...validatedData });
            toast.success("נרשמת בהצלחה");
            router.push("/auth/register/successfull");
        } catch (error) {
            if (error instanceof z.ZodError) {
                setError("שגיאה בהרשמה, נסה שוב: " + error.errors.map(e => e.message).join(", "));
            } else if (error instanceof AxiosError) {
                setError("שגיאה בהרשמה, נסה שוב");
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex justify-center items-center h-[80vh]">
            <Card className="p-4 md:p-8 w-full max-w-md bg-opacity-75">
                <CardHeader>
                    <CardTitle>הרשמה לדמצטר</CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <FormField
                                control={form.control}
                                name="fullName"
                                render={({ field }) => (
                                    <FormItem className="my-2">
                                        <FormLabel>שם מלא</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem className="my-2">
                                        <FormLabel>שם משתמש</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="passwordHash"
                                render={({ field }) => (
                                    <FormItem className="my-2">
                                        <FormLabel>סיסמה</FormLabel>
                                        <FormControl>
                                            <Input {...field} type="password" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {error && (
                                <p className="text-sm text-red-500">{error}</p>
                            )}
                            <Button className="my-4" type="submit" disabled={loading}>
                                {loading ? "טוען..." : "הרשם"}
                            </Button>
                        </form>
                    </Form>
                    <p className="text-sm mt-4">
                        יש לך משתמש? <a href="/auth/login" className="text-blue-500">התחבר</a>
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
