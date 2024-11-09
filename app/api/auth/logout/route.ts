import { logout } from "@/modules/server";

export async function POST() {
    return logout();
}
