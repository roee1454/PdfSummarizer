import { logout } from "@/services/server";

export async function POST() {
    return logout();
}
