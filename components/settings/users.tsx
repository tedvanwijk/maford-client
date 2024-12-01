'use client'

import { useState, useEffect } from "react";
import { apiUrl } from "@/lib/api";
import { Check } from "react-feather";
import { User } from '@/app/types';

export default function Users() {
    const [name, setName] = useState('');
    const [admin, setAdmin] = useState(false);
    const [userId, setUserId] = useState(-2);
    const [newMode, setNewMode] = useState(false);
    const [removeButton, setRemoveButton] = useState(<>Delete</>);
    const [applyButton, setApplyButton] = useState(<>Apply changes</>);

    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        fetch(
            `${apiUrl}/users`,
            {
                method: 'GET',
                cache: 'no-cache'
            }
        )
            .then(res => res.json())
            .then(res => setUsers(res));
    }, []);

    function changeUser(u: User, disableButtonUpdate = false) {
        if (u === undefined) {
            setNewMode(true);
            setName('');
            setAdmin(false);
            setUserId(-1);
            if (!disableButtonUpdate) setApplyButton(<>Create user</>)
        } else {
            setNewMode(false);
            setName(u.name);
            setAdmin(u.admin);
            setUserId(u.user_id);
            if (!disableButtonUpdate) setApplyButton(<>Apply changes</>)
        }
    }

    async function submit() {
        let changedUser: User;
        if (newMode) {
            changedUser = await fetch(
                `${apiUrl}/users/new`,
                {
                    method: 'POST',
                    cache: 'no-cache',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ name, admin })
                }
            )
                .then(res => {
                    if (res.status === 201) {
                        setApplyButton(<>Created<Check /></>);
                        setTimeout(() => setApplyButton(<>Apply changes</>), 3000);
                    } else {
                        setApplyButton(<>Failed</>);
                        setTimeout(() => setApplyButton(<>Apply changes</>), 3000);
                    }
                    return res.json();
                })
        } else {
            changedUser = await fetch(
                `${apiUrl}/users/${userId}`,
                {
                    method: 'PUT',
                    cache: 'no-cache',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ name, admin })
                }
            )
                .then(res => {
                    if (res.status === 200) {
                        setApplyButton(<>Applied<Check /></>);
                        setTimeout(() => setApplyButton(<>Apply changes</>), 3000);
                    } else {
                        setApplyButton(<>Failed</>);
                        setTimeout(() => setApplyButton(<>Apply changes</>), 3000);
                    }
                    return res.json();
                })
        }

        await fetch(
            `${apiUrl}/users`,
            {
                method: 'GET',
                cache: 'no-cache'
            }
        )
            .then(res => res.json())
            .then(res => setUsers(res))
            .then(() => changeUser(changedUser, true));
    }

    async function remove() {
        const answer = window.confirm(`Are you sure you want to delete the user account for ${users.find(e => e.user_id === userId)?.name}?`);
        if (!answer) return;

        await fetch(
            `${apiUrl}/users/${userId}`,
            {
                method: 'DELETE',
                cache: 'no-cache',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            }
        )
            .then(res => {
                if (res.status === 200) {
                    setRemoveButton(<>Deleted<Check /></>);
                    setTimeout(() => setRemoveButton(<>Delete</>), 3000);
                } else {
                    setRemoveButton(<>Failed</>);
                    setTimeout(() => setRemoveButton(<>Delete</>), 3000);
                }
                return res.json();
            })
            .then(res => {
                setUsers(res);
                setUserId(-2);
                setName('');
                setAdmin(false);
            });
    }

    return (
        <form onSubmit={e => {
            e.preventDefault();
            submit();
        }} className="flex flex-col justify-start items-start w-full">
            <div className="flex flex-col mb-1">
                <select value={userId} onChange={e => changeUser(users.find(ee => ee.user_id === parseInt(e.target.value)) as User)} className="input input-bordered w-full">
                    {
                        users.map(e => (
                            <option value={e.user_id} key={e.user_id}>{e.name}</option>
                        ))
                    }
                    <option value={-1}>Add new</option>
                    <option value={-2} disabled hidden>Choose user</option>
                </select>
            </div>
            <div className="flex flex-row w-full justify-start items-center">
                <label className={`form-control w-[200px] transition-opacity mb-4 mr-4`} key="name">
                    <div className="label">
                        <span>Name</span>
                    </div>
                    <input
                        value={name}
                        onChange={e => setName(e.target.value)}
                        type="text"
                        placeholder="Enter value"
                        className="input input-bordered w-full"
                    />
                </label>
                <label className={`form-control w-[200px] transition-opacity mb-4`} key="name">
                    <div className="label">
                        <span>Admin</span>
                    </div>
                    <input
                        checked={admin}
                        onChange={e => setAdmin(e.target.checked)}
                        type="checkbox"
                        className="toggle toggle-primary my-auto bg-base-300"
                    />
                </label>
            </div>
            <div className="flex flex-row justify-start items-center w-full">
                <button type="submit" disabled={userId === -2} className="btn btn-primary mr-4">{applyButton}</button>
                <button type="button" disabled={userId === -2 || newMode} className="btn bg-base-100" onClick={() => remove()}>{removeButton}</button>
            </div>
        </form>
    )
}