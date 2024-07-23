'use client'

import Link from "next/link";
import { useEffect, useState } from "react";
import { List } from "react-feather";

export default function SpecificationLink() {
    const [userId, setUserId] = useState('');
    useEffect(() => {
        setUserId(localStorage.getItem('user_id') as string)
    })
    return (
        <li className="w-full font-bold stroke-2 my-1" key="Specifications">
            <Link href={`/specifications/0?u=${userId}&r=${userId}&s=`} className="flex flex-row justify-between w-full text-lg m-0">
                <h1>Specifications</h1>
                <List />
            </Link>
        </li>

    )
}