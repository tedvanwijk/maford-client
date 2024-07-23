'use client'

import { User } from "@/app/types";
import { useEffect, useState } from "react";

export default function UserDropdown({ users }: { users: User[] }) {
    const [userId, setUserId] = useState<string>('');

    function changeUser(userId: number, event: any) {
        window.localStorage.setItem('user_id', userId.toString());
        setUserId(userId.toString());
        event.target.blur();
        window.location.reload();
    }

    useEffect(() => {
        const user_id = window.localStorage.getItem('user_id') || '';
        setUserId(user_id);
    })

    return (
        <div className="dropdown dropdown-top w-full">
            <div tabIndex={0} role="button" className="btn w-full p-0">
                {userId === null ? 'Select User' : (users.find((e: User) => e.user_id === parseInt(userId))?.name)}
            </div>
            <ul className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-full z-[1]">
                {
                    users.map((e: User) => (
                        <li key={e.user_id}>
                            <button onClick={(ee) => changeUser(e.user_id, ee)}>{e.name}</button>
                        </li>
                    ))
                }
            </ul>
        </div>
    )

}