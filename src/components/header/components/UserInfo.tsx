'use client'
import { UserButton, useUser } from "@clerk/nextjs";

export default function UserInfo() {
    const { user } = useUser();

    return (
        <div className="flex items-center gap-4">
            {user?.primaryEmailAddress?.emailAddress && <p className="text-xs">{user?.primaryEmailAddress?.emailAddress}</p>}
            <UserButton />
        </div>
    )
}
