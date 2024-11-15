'use client'

import { Home, List, PlusCircle, Settings, AlertTriangle, ShoppingCart } from "react-feather";
import Link from "next/link";
import UserDropdown from "./userDropdown";
import SpecificationLink from './navbar/specificationLink';
import Image from 'next/image'
import image from '@/public/ma-ford-logo.png';
import { useEffect, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { apiUrl } from "@/lib/api";
import { User } from "@/app/types";

export default function Navbar({ children }: { children: React.ReactNode }) {
    const [userId, setUserId] = useState<string | undefined>(undefined);
    const [users, setUsers] = useState<User[]>([]);

    const router = useRouter();
    const pathName = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        const user_id = window.localStorage.getItem('user_id') || '';
        setUserId(user_id);

        fetch(
            `${apiUrl}/users`,
            {
                method: 'GET',
                cache: 'no-cache'
            }
        ).then(res => res.json())
            .then(res => setUsers(res));
    }, []);

    const pages: {
        name: string,
        href: string,
        icon: React.ReactNode
    }[] = [
            {
                name: 'Home',
                href: '/',
                icon: <Home />
            },
            {
                name: 'New Specification',
                href: '/specifications/new',
                icon: <PlusCircle />
            },
            {
                name: 'Catalog Tools',
                href: '/catalog/0?s=',
                icon: <ShoppingCart />
            },
            {
                name: 'Specifications',
                href: '/specifications/0',
                icon: <List />
            },
            {
                name: 'Report Issue',
                href: '/report',
                icon: <AlertTriangle />
            },
            {
                name: 'Settings',
                href: '/settings',
                icon: <Settings />
            }
        ]

    function changeUser(userId: number) {
        window.localStorage.setItem('user_id', userId.toString());
        setUserId(userId.toString());
        const pathNameElements = pathName.split('/');
        if (pathNameElements[1] === 'specifications' && !isNaN(+pathNameElements[2])) {
            const searchTerm = searchParams.get('s');
            if (searchParams.get('u') === 'null') router.replace(`/specifications/${pathNameElements[2]}?u=null&r=${userId}&s=${searchTerm}`);
            else router.replace(`/specifications/0?u=${userId}&r=${userId}&s=${searchTerm}`);
        }
    }

    return (
        <div className="drawer drawer-open bg-base-100 h-screen">
            <input type="checkbox" id="drawer" className="drawer-toggle" />
            <div className="drawer-content overflow-auto px-5 py-8 text-neutral w-full">
                {children}
            </div>
            <div className="h-dvh bg-white text-neutral bg-opacity-50 p-5 shadow-2xl flex flex-col justify-between">
                <div className="w-full flex flex-col justify-start items-start">
                    <Image
                        src={image}
                        alt="M.A. Ford Logo"
                        className="w-64" />
                    <h1 className="my-5 px-4 text-center font-bold text-xl">M.A. Ford Tool Generator</h1>
                    <ul className="menu text-center w-full p-0">
                        {pages.map((e: any) =>
                            e.name === 'Specifications' ?
                                <SpecificationLink key={e.name} userId={userId} /> :
                                <li className="w-full font-bold stroke-2 my-1" key={e.name}>
                                    <Link href={e.href} className="flex flex-row justify-between w-full text-lg m-0">
                                        <h1>{e.name}</h1>
                                        {e.icon}
                                    </Link>
                                </li>
                        )}
                    </ul>
                </div>
                <div className="w-full flex flex-row px-4">
                    <div className="flex justify-center items-center font-bold mr-4">User</div>
                    <UserDropdown users={users} changeUser={changeUser} userId={userId}></UserDropdown>
                </div>
            </div>
        </div>
    )
}