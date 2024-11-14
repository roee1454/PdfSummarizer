"use client";

import { useState } from "react";
import { User } from "@/types";
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Login() {
    const form = useForm<User>({
        resolver: zodResolver(
            z.object({
                username: z
                    .string()
                    .min(2, { message: "שם משתמש חייב להכיל לפחות 2 תווים" }),
                passwordHash: z
                    .string()
                    .min(8, { message: "סיסמה חייבת להכיל לפחות 8 תווים" }),
            })
        ),
        defaultValues: {
            username: "",
            passwordHash: "",
        },
    });

    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    async function onSubmit(data: User) {
        setLoading(true);
        setError(null);
        try {
            const validatedData = z.object({
                username: z.string().min(2),
                passwordHash: z.string().min(8),
            }).parse(data);
            await axios.post("/api/auth/login", { ...validatedData });
            toast.success("התחברת בהצלחה");
            router.push("/main");
        } catch (error) {
            if (error instanceof z.ZodError) {
                setError("שגיאה בהתחברות, נסה שוב: " + error.errors.map(e => e.message).join(", "));
            } else {
                setError("שם משתמש או סיסמה שגויים");
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex justify-center items-center h-[80vh]">
            <Card className="p-4 md:p-8 w-full max-w-md bg-opacity-75">
                <CardHeader>
                    <CardTitle>התחברות לדמצטר</CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <FormField
                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>שם משתמש</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="passwordHash"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>סיסמה</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                type="password"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {error && (
                                <p className="text-sm text-red-500">{error}</p>
                            )}
                            <Button className="my-4" type="submit" disabled={loading}>
                                {loading ? "טוען..." : "התחבר"}
                            </Button>
                        </form>
                    </Form>
                    <p className="text-sm mt-4">
                        אין לך משתמש? <a href="/auth/register" className="text-blue-500">הרשמה</a>
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
