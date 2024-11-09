"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Lottie from "lottie-react";
import successAnimation from "@/public/animations/success.json";
import axios from "axios";

export default function SuccessfulSignUpPage() {
    const router = useRouter();

    const handleButtonClick = async () => {
        try {
            await axios.post("/api/auth/logout");
            router.push("/auth/login");
        } catch (error) {
            console.error("Failed to remove temporary token:", error);
        }
    };

    return (
        <div className="flex justify-center items-center h-[80vh]">
            <Card className="max-w-2xl mx-auto mt-10 px-12 bg-opacity-75">
                <CardHeader>
                    <CardTitle className="text-center">הרשמה מוצלחת</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                    <Lottie animationData={successAnimation} loop={false} autoplay={true} className="w-48 h-48 mx-auto" />
                    <p className="text-lg mt-4">נרשמת בהצלחה! ברוך הבא לדמצטר.</p>
                    <Button className="mt-6" onClick={handleButtonClick}>
                        עבור לדף הכניסה
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
