import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/modules/server";

export async function GET(request: NextRequest) {
    return await getUser(request);
}
