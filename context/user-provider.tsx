'use client';

import { createContext, useContext, useEffect, useState } from "react";
import { User } from "@/types";
import axios from "axios";

const UserContext = createContext<User | null>(null);


export function UserProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get("/api/auth/me");
                if (response.status === 200 && response.data) {
                    setUser(response.data);
                } else {
                    setUser(null);
                }
            } catch (error) {
                console.error("Failed to fetch user data:", error);
                setUser(null);
            }
        };
        fetchUser();
    }, []);

    return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}

export const useUser = () => {
    return useContext(UserContext);
};
