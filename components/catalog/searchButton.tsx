'use client'

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function SearchButton({
    s
}: {
    s: string
}) {
    const [searchTerm, setSearchTerm] = useState(s);
    const router = useRouter();

    function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        router.push(`/catalog/${0}?s=${searchTerm}`);
    }

    return (
        <form className="flex flex-row justify-end items-center" onSubmit={handleSubmit}>
            <input onChange={e => setSearchTerm(e.target.value)} value={searchTerm} type="text" placeholder="Search catalog tool" className="input input-bordered w-full bg-secondary bg-opacity-50" />
            <Link href={`/catalog/${0}?&s=${searchTerm}`} className="btn btn-primary ml-4">Search</Link>
        </form>
    )
}