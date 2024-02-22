import Link from "next/link";
import { Info } from "react-feather";

import { Specification } from "@/app/types";

export default async function Specifications(
    { params }:
        { params: { page: string } }
) {
    const { specs, pages } = await fetch(
        `${process.env.API_URL}/specifications?page=${params.page}`,
        {
            method: "GET",
            cache: "no-cache"
        }
    ).then(res => res.json());
    const pageArray = Array.from(Array(pages).keys());
    return (
        <div className="px-5 py-8 text-neutral">
            <table className="table table-zebra">
                <thead>
                    <tr>
                        <th>Number</th>
                        <th>User</th>
                        <th>Name</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        specs.map((e: Specification) => {
                            let badgeClasses = '';
                            switch (e.status) {
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
                            return (
                                <tr key={e.specification_id} className="hover relative" title="Click row to view details">
                                    <td>
                                        <Link href={`/specifications/details/${e.specification_id}`} className="absolute bottom-0 left-0 top-0 right-0"/>
                                        {e.specification_id}
                                    </td>
                                    <td>{e.users.name}</td>
                                    <td>{e.name}</td>
                                    <td>
                                        <div className={`badge ${badgeClasses}`}>
                                            {e.status}
                                        </div>
                                    </td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
            <div className="mt-2 w-full flex flex-row justify-center">
                {
                    pageArray.map((e: number) => {
                        const active = parseInt(params.page) === e;
                        return (
                            <Link
                                className={`btn mx-1 ${active ? 'bg-primary text-base-100' : ''}`}
                                href={`/specifications/${e}`}
                                key={e}
                            >
                                {e + 1}
                            </Link>
                        )
                    })
                }
            </div>
        </div >
    )
}