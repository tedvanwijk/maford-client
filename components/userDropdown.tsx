'use client'

import { User } from "@/app/types";
import { useEffect, useState } from "react";

export default function UserDropdown({ users }: { users: User[] }) {
    const [userId, setUserId] = useState<string>('');

    function changeUser(userId: number) {
        window.localStorage.setItem('user_id', userId.toString());
        setUserId(userId.toString());
        window.location.reload();
    }

    useEffect(() => {
        const user_id = window.localStorage.getItem('user_id') || '';
        setUserId(user_id);
    })

    return (
        <select value={userId} onChange={e => changeUser(parseInt(e.target.value))} className="input input-bordered w-full">
            {
                users.map((e: User) => (
                    <option value={e.user_id} key={e.user_id}>{e.name}</option>
                ))
            }
            <option value="" disabled hidden>Select User</option>
        </select>
    )

}