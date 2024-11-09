import { register } from "@/modules/server";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    return register(request);
}
