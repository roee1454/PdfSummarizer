import { register } from "@/services/server";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    return register(request);
}
