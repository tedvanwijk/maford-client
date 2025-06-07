'use client'

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function SearchButton({
    p, u, r, s
}: {
    p: string, u: string, r: string, s: string
}) {
    const [searchTerm, setSearchTerm] = useState(s);
    const router = useRouter();

    function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        router.push(`/specifications/${0}?u=${u}&r=${r}&s=${searchTerm}`);
    }

    return (
        <form className="flex flex-row justify-end items-center" onSubmit={handleSubmit}>
            <input onChange={e => setSearchTerm(e.target.value)} value={searchTerm} type="text" placeholder="Search specification name" className="input input-bordered w-full bg-secondary bg-opacity-50" />
            <Link href={`/specifications/${0}?u=null&r=${r}&s=${searchTerm}`} className="btn btn-primary ml-4">Search</Link>
        </form>
    )
}