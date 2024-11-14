import { NextRequest, NextResponse } from "next/server";
import { verifyToken, verifyTempToken } from "@/services/server";

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    const redirectTo = (path: string) =>
        NextResponse.redirect(new URL(path, req.url));

    const handleAuthPaths = async () => {
        try {
            const payload = await verifyToken(req);

            if (payload) {
                return redirectTo("/main");
            }

        } catch (error) {
            console.log("Token verification failed:", error);
        }

        switch (pathname) {
            case "/auth/register/successfull":
                try {
                    const tempPayload = await verifyTempToken(req);
                    if (tempPayload) {
                        return NextResponse.next();
                    }
                } catch (error) {
                    console.error(
                        "Temporary token verification failed:",
                        error
                    );
                }
                return redirectTo("/auth/register");
            default:
                return NextResponse.next();
        }
    };

    const handleMainPaths = async () => {
        try {
            const payload = await verifyToken(req);
            console.log(payload);
            if (payload) {
                if (pathname.startsWith("/auth/")) {
                    return redirectTo("/main");
                }
                return NextResponse.next();
            }
        } catch (error) {
            console.log("Token verification failed:", error);
        }
        return redirectTo("/auth/login");
    };

    if (pathname === "/") {
        return redirectTo("/main");
    }

    if (pathname.startsWith("/main")) {
        return handleMainPaths();
    }

    if (pathname.startsWith("/auth/")) {
        return handleAuthPaths();
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/auth/:path*", "/main/:path*", "/"],
};
