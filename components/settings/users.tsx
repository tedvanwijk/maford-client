'use client'

import { useState } from "react";
import { apiUrl } from "@/lib/api";
import { Check } from "react-feather";

export default function Users() {    
    const [name, setName] = useState('');
    const [button, setButton] = useState(<>Add</>);

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
                body: JSON.stringify({name})
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
        })
    }

    return (
        <div className="flex flex-row justify-start items-end">
            <div className="flex flex-col mb-1">
                <label className="form-control transition-opacity">
                    <div className="label">
                        <span>Name</span>
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
            <button onClick={() => submit()} className="btn btn-primary ml-4 mb-1">{button}</button>
        </div>
    )
}