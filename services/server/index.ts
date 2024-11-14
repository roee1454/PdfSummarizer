import {  prisma} from "@/prisma";
import { NextResponse, NextRequest } from "next/server";
import { hashSync, compareSync } from 'bcrypt-edge'
import { jwtVerify, SignJWT } from "jose";
import { initializeChatSession } from "@/services/model";

interface ServerConfig {
    tokenCookieName: string;
    tempTokenCookieName: string;
    jwtSecret: string;
    salt: number;
}

export const config: ServerConfig = {
    tokenCookieName: process.env.TOKEN_COOKIE_NAME as string,
    tempTokenCookieName: process.env.TEMP_TOKEN_COOKIE_NAME as string,
    jwtSecret: process.env.JWT_SECRET as string,
    salt: parseInt(process.env.JWT_SULT_NUMBER as string),
};

interface LoginRequest {
    username: string;
    passwordHash: string;
};

interface RegisterRequest {
    fullName: string;
    username: string;
    passwordHash: string;
};

export const API_URL = process.env.NODE_ENV !== "production" ? "http://localhost:3000" : "CUSTOM_URL"

export async function login(request: NextRequest) {
    try {
        const { username, passwordHash }: LoginRequest = await request.json();

    if (typeof username !== 'string' || typeof passwordHash !== 'string') {
        return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
        where: { username },
    });
    
    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 401 });
    }
    
    const passwordsMatch = compareSync(passwordHash, user.passwordHash);
    
    if (!passwordsMatch) {
        return NextResponse.json(
            { error: "Invalid password" },
            { status: 401 }
        );
    }
    
    const token = await new SignJWT({
        id: user.id,
    })
        .setProtectedHeader({ alg: "HS256" })
        .setExpirationTime("1h")
        .sign(new TextEncoder().encode(config.jwtSecret));
    
    const response = NextResponse.json({ token }, { status: 200 });
    
    response.cookies.set(config.tokenCookieName, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        sameSite: "strict",
    });
    
    return response;
    } catch (err: unknown) {
        console.error(err);
        return NextResponse.json({ message: "Internal Server Error", err }, { status: 500 })
    }
}

export async function register(request: NextRequest) {
    const {
        fullName,
        username,
        passwordHash: password,
    }: RegisterRequest = await request.json();

    if (typeof fullName !== 'string' || typeof username !== 'string' || typeof password !== 'string') {
        return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const passwordHash = hashSync(password, config.salt);
    const user = await prisma.user.create({
        data: { fullName, username, passwordHash },
    });

    const tempToken = await new SignJWT({
        id: user.id,
    })
        .setProtectedHeader({ alg: "HS256" })
        .setExpirationTime("15m")
        .sign(new TextEncoder().encode(config.jwtSecret));

    const response = NextResponse.json({ user, tempToken }, { status: 200 });
    
    response.cookies.set(config.tempTokenCookieName, tempToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        sameSite: "strict",
    });

    return response;
}

export async function verifyToken(request: NextRequest) {
    const token = request.cookies.get(config.tokenCookieName)?.value;
    if (!token) {
        throw new Error("Token not found");
    }

    try {
        const decoded = await jwtVerify(
            token as string,
            new TextEncoder().encode(config.jwtSecret)
        );
        return { id: decoded.payload.id };
    } catch (error) {
        throw new Error("Invalid token");
    }
}

export async function verifyTempToken(request: NextRequest) {
    const token = request.cookies.get(config.tempTokenCookieName)?.value;
    if (!token) {
        throw new Error("Temp token not found");
    }
    try {
        const decoded = await jwtVerify(
            token,
            new TextEncoder().encode(config.jwtSecret)
        );
        return { id: decoded.payload.id };
    } catch (error) {
        throw new Error("Invalid temp token");
    }
}

export async function logout() {
    const response = NextResponse.json(null, { status: 200 });
    response.cookies.delete(config.tokenCookieName);
    response.cookies.delete(config.tempTokenCookieName);
    return response;
}

export async function getUser(request: NextRequest) {
    try {
        const token = request.cookies.get(config.tokenCookieName)?.value;
        if (!token) {
            return NextResponse.json({ error: "Token not found" }, { status: 401 });
        }

        const decoded = await jwtVerify(token, new TextEncoder().encode(config.jwtSecret));
        const user = await prisma.user.findUnique({
            where: { id: decoded.payload.id as string },
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json(user, { status: 200 });
    } catch (error) {
        console.error("Error in getUser:", error);
        return NextResponse.json({ error: "Failed to retrieve user" }, { status: 500 });
    }
}

export async function createChatSession(request: NextRequest) {
    const data = await request.formData();
    const question = data.get("question") as string
    const file = data.get("file") as File;
    const response = await initializeChatSession(question, file);
    return NextResponse.json({ response }, { status: 200 })
}