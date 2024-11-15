import { Assistant } from "next/font/google";
import { Metadata } from "next";
import Header from "@/components/header";
import { UserProvider } from "@/context/user-provider";

const assistant = Assistant({
    subsets: ["hebrew"],
    variable: "--font-assistant",
    weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
    title: "מכולל דמצים",
    description: "מכולל דמצים ופיתרון בעיות טכניות",
};

export default function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className={assistant.className}>
            <div className="flex-grow px-2.5 py-4 sm:px-4 sm:py-6 md:px-6 md:py-8 lg:px-8 lg:py-10 xl:px-10 xl:py-12 2xl:px-12 2xl:py-14">
                <UserProvider>
                    <Header />
                    {children}
                </UserProvider>
            </div>
        </div>
    );
}
