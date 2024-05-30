import { Home, List, PlusCircle, Settings, AlertTriangle } from "react-feather";
import Link from "next/link";
import UserDropdown from "./userDropdown";

export default async function Navbar({ children }: { children: React.ReactNode }) {
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

    const users = await fetch(
        `${process.env.API_URL}/users`,
        {
            method: 'GET',
            cache: 'no-cache'
        }
    ).then(res => res.json());

    return (
        <div className="drawer drawer-open bg-base-100 h-screen">
            <input type="checkbox" id="drawer" className="drawer-toggle" />
            <div className="drawer-content overflow-auto px-5 py-8 text-neutral w-full">
                {children}
            </div>
            <div className="h-dvh bg-white text-neutral bg-opacity-50 p-5 shadow-2xl flex flex-col justify-between">
                <div className="w-full flex flex-col justify-start items-start">
                    <img
                        src={'/ma-ford-logo.png'}
                        alt="M.A. Ford Logo"
                        className="w-64" />
                    <h1 className="my-5 px-4 text-center font-bold text-xl">M.A. Ford Tool Generator</h1>
                    <ul className="menu text-center w-full p-0">
                        {pages.map((e: any) => {
                            return (
                                <li className="w-full font-bold stroke-2 my-1" key={e.name}>
                                    <Link href={e.href} className="flex flex-row justify-between w-full text-lg m-0">
                                        <h1>{e.name}</h1>
                                        {e.icon}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </div>
                <div className="w-full flex flex-row px-4">
                    <div className="flex justify-center items-center font-bold mr-4">User</div>
                    <UserDropdown users={users}></UserDropdown>
                </div>
            </div>
        </div>
    )
}