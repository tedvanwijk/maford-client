'use client'

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { apiUrl } from "@/lib/api";

export default function Report() {
    const searchParams = useSearchParams();
    const referenceSpecification = searchParams.get('r');
    const router = useRouter();

    const [spec, setSpec]: [any, Function] = useState(null);
    const [summary, setSummary] = useState('');
    const [description, setDescription] = useState('');

    useEffect(() => {
        if (referenceSpecification !== null) {
            fetch(
                `${apiUrl}/specification/${referenceSpecification}`,
                {
                    method: "GET",
                    cache: "no-cache"
                }
            )
                .then(res => res.json())
                .then(res => {
                    setSpec(res);
                });
        }
    });

    let badgeClasses = '';
    if (spec) {
        switch (spec.status) {
            case 'finished':
                badgeClasses = 'bg-primary text-base-100';
                break;
            case 'generating':
                badgeClasses = 'bg-accent';
                break;
            case 'failed':
                badgeClasses = 'bg-red-700 text-base-100'
                break;
        }
    }

    return (
        <>
            <title>Report Issue</title>
            <h1 className="text-lg font-bold">Report Issue</h1>
            {
                referenceSpecification === null ?
                    <h1>Note: For issues related to a specification, please click the &quot;Report Issue&quot; button on the details page for that specification.</h1> :
                    ''
            }



            <form className="flex flex-col" onSubmit={async e => {
                e.preventDefault();
                const user_id = window.localStorage.getItem('user_id') || '';
                await fetch(
                    `${apiUrl}/reports/new`,
                    {
                        method: "POST",
                        cache: "no-cache",
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            summary,
                            description,
                            specification_id: referenceSpecification,
                            user_id: user_id
                        })
                    }
                )
                    .then(res => router.push('/'));
            }}>
                {
                    referenceSpecification ?
                        <div className="flex flex-row w-full">
                            <div>
                                For specification {referenceSpecification}
                                <div className={`badge ${badgeClasses} ml-2`}>{spec && spec.status}</div>
                            </div>
                        </div> :
                        ''
                }

                <label>
                    <div className="label">
                        <span>Summary</span>
                    </div>
                </label>
                <input
                    type="text"
                    className="input input-bordered w-full bg-secondary bg-opacity-50"
                    placeholder="Please provide a brief summary of the issue"
                    value={summary}
                    onChange={e => setSummary(e.target.value)}
                />

                <label>
                    <div className="label">
                        <span>Description</span>
                    </div>
                </label>
                <textarea
                    className="input input-bordered w-full bg-secondary bg-opacity-50 p-4 h-[500px]"
                    placeholder="Please provide a description of the issue and the steps to recreate it"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                />

                <button type="submit" className="btn btn-primary mt-4 w-fit">Submit</button>
            </form>
        </>
    )
}