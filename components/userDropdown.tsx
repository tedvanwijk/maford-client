'use client'

import { User } from "@/app/types";

export default function UserDropdown({ users, changeUser, userId }: 
    { users: User[], changeUser: Function, userId: string | undefined }) {
    return (
        <select value={userId} onChange={e => changeUser(parseInt(e.target.value))} className="input input-bordered w-full appearance-auto">
            {
                users.map((e: User) => (
                    <option value={e.user_id} key={e.user_id}>{e.name}</option>
                ))
            }
            <option value="" disabled hidden>Select User</option>
        </select>
    )

}