'use client'

import { useState, useEffect } from "react";
import { apiUrl } from "@/lib/api";
import { Check } from "react-feather";
import { User } from '@/app/types';

export default function Users() {
    const [name, setName] = useState('');
    const [button, setButton] = useState(<>Add</>);

    const [removeName, setRemoveName] = useState('');
    const [removeButton, setRemoveButton] = useState(<>Remove</>);

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
    }, [])

    function submit() {
        fetch(
            `${apiUrl}/users/new`,
            {
                method: 'POST',
                cache: 'no-cache',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name })
            }
        )
            .then(res => {
                if (res.status === 201) {
                    setButton(<>Added<Check /></>);
                    setTimeout(() => setButton(<>Add</>), 3000);
                    setName('');
                } else {
                    setButton(<>Adding failed</>);
                    setTimeout(() => setButton(<>Add</>), 3000);
                }
                return res.json();
            })
            .then(res => setUsers(res));
    }

    function remove() {
        fetch(
            `${apiUrl}/users/${removeName}`,
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
                setRemoveButton(<>Removed<Check /></>);
                setTimeout(() => setRemoveButton(<>Remove</>), 3000);
            } else {
                setRemoveButton(<>Removing failed</>);
                setTimeout(() => setRemoveButton(<>Remove</>), 3000);
            }
            return res.json();
        })
        .then(res => {
            setUsers(res);
            setRemoveName('');
        });
    }

    return (
        <div className="w-full flex flex-row justify-start items-center">
            <form onSubmit={e => {
                e.preventDefault();
                submit();
            }} className="flex flex-row justify-start items-end mr-4">
                <div className="flex flex-col mb-1">
                    <label className="form-control transition-opacity">
                        <div className="label">
                            <span>Add user</span>
                        </div>
                    </label>
                    <input
                        type="text"
                        placeholder="Enter name"
                        className="input input-bordered w-full"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <button className="btn btn-primary ml-4 mb-1">{button}</button>
            </form>

            <form onSubmit={e => {
                e.preventDefault();
                remove();
            }} className="flex flex-row justify-start items-end">
                <div className="flex flex-col mb-1">
                    <label className="form-control transition-opacity">
                        <div className="label">
                            <span>Remove user</span>
                        </div>
                    </label>
                    <select value={removeName} onChange={e => setRemoveName(e.target.value)} className="input input-bordered w-full">
                        {
                            users.map(e => (
                                <option value={e.user_id} key={e.user_id}>{e.name}</option>
                            ))
                        }
                        <option value="" disabled hidden>Choose user</option>
                    </select>
                </div>
                <button className="btn btn-primary ml-4 mb-1">{removeButton}</button>
            </form>
        </div>

    )
}