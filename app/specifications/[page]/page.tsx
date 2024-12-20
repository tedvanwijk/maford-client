import Link from "next/link";

import { Specification } from "@/app/types";
import SearchButton from '@/components/specifications/searchButton';
import { AlertCircle } from "react-feather";
import type { Metadata } from 'next'
import Image from "next/image";

export async function generateMetadata(
    {
        params, searchParams
    }:
        {
            params: { page: string },
            searchParams: { u: string, r: string, s: string }
        }
): Promise<Metadata> {
    let title;
    if (searchParams.u === 'null') title = `All specifications - Page ${(parseInt(params.page) + 1).toString()}`;
    else title = `Your specifications - Page ${(parseInt(params.page) + 1).toString()}`;

    if (searchParams.s !== '') title += ` - Search: ${searchParams.s}`;
    return { title }
}

export default async function Specifications(
    {
        params, searchParams
    }:
        {
            params: { page: string },
            searchParams: { u: string, r: string, s: string }
        }
) {
    const { specs, pages } = await fetch(
        `${process.env.API_URL}/specifications?p=${params.page}&u=${searchParams.u}&s=${searchParams.s}`,
        {
            method: "GET",
            cache: "no-cache"
        }
    ).then(res => res.json());
    const pageArray = Array.from(Array(pages).keys());
    function generatePagination() {
        const pageLimit = 5;
        const currentPage = parseInt(params.page);

        if (pages < pageLimit + 1) return (
            pageArray.map((e: number) => {
                const active = parseInt(params.page) === e;
                return (
                    <Link
                        className={`min-w-[3rem] btn mx-1 ${active ? 'bg-primary text-base-100' : ''}`}
                        href={`/specifications/${e}?u=${searchParams.u}&r=${searchParams.r}&s=${searchParams.s}`}
                        key={e}
                    >
                        {e + 1}
                    </Link>
                )
            })
        )

        let lowerPage = currentPage - (pageLimit - 1) / 2;
        let upperPage = currentPage + (pageLimit - 1) / 2;

        if (lowerPage < 0) {
            upperPage -= lowerPage;
            lowerPage -= lowerPage;
        }

        if (upperPage > (pages - 1)) {
            lowerPage -= (upperPage - pages + 1);
            upperPage -= (upperPage - pages + 1);
        }

        let pageElements = [];

        for (let i = lowerPage; i < (upperPage + 1); i++) {
            const active = currentPage === i;
            pageElements.push(
                <Link
                    className={`min-w-[3rem] btn mx-1 ${active ? 'bg-primary text-base-100' : ''}`}
                    href={`/specifications/${i}?u=${searchParams.u}&r=${searchParams.r}&s=${searchParams.s}`}
                    key={i}
                >
                    {i + 1}
                </Link>
            )
        }

        if (lowerPage !== 0) {
            if (lowerPage !== 1) {
                pageElements.unshift(
                    <div className="w-[3rem] flex justify-center items-end">
                        ...
                    </div>
                );
            }

            pageElements.unshift(
                <Link
                    className={`min-w-[3rem] btn mx-1`}
                    href={`/specifications/${0}?u=${searchParams.u}&r=${searchParams.r}&s=${searchParams.s}`}
                    key={0}
                >
                    {1}
                </Link>
            );
        }

        if (upperPage !== (pages - 1)) {
            if (upperPage !== (pages - 2)) {
                pageElements.push(
                    <div className="w-[43px] flex justify-center items-end">
                        ...
                    </div>
                );
            }

            pageElements.push(
                <Link
                    className={`min-w-[3rem] btn mx-1`}
                    href={`/specifications/${pages - 1}?u=${searchParams.u}&r=${searchParams.r}&s=${searchParams.s}`}
                    key={pages - 1}
                >
                    {pages}
                </Link>
            );
        }

        return pageElements;
    }


    return (
        <div className="flex flex-col justify-between">
            <div className="flex flex-row justify-between items-center mb-4">
                <div className="flex flex-row justify-start items-center">
                    <h1 className="text-xl font-bold">{(searchParams.u === 'null' || searchParams.u === '-1' || searchParams.u === 'undefined') ? 'All' : `Your`} specifications</h1>
                    {
                        searchParams.r === 'null' ?
                            '' : (searchParams.u === 'null' || searchParams.u === '-1' || searchParams.u === 'undefined') ?
                                <Link href={`/specifications/${0}?u=${searchParams.r}&r=${searchParams.r}&s=${searchParams.s}`} className="btn ml-4">View your specifications</Link> :
                                <Link href={`/specifications/${0}?u=null&r=${searchParams.r}&s=${searchParams.s}`} className="btn ml-4">View all specifications</Link>
                    }
                </div>
                <SearchButton p={params.page} u={searchParams.u} r={searchParams.r} s={searchParams.s} />
            </div>




            <table className="table table-zebra">
                <thead>
                    <tr>
                        <th></th>
                        <th>User</th>
                        <th>Tool</th>
                        <th>Created</th>
                        <th>Name</th>
                        <th className="hidden 2xl:block"></th>
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
                                case 'pending':
                                    badgeClasses = 'bg-accent';
                                    break;
                            }
                            return (
                                <tr
                                    key={e.specification_id}
                                    className="hover relative h-[50px]"
                                    title={e.versions.active ? "Click row to view details" : "Click row to view details. Warning: This specification was created with an older version, some features might not work as expected"}
                                >
                                    <td className="w-[5%]">
                                        <Link href={`/specifications/details?r=${e.specification_id}`} className="absolute bottom-0 left-0 top-0 right-0" />
                                        <div className="flex flex-row justify-start items-center">
                                            {e.specification_id}
                                            {e.versions.active ? '' : <AlertCircle className="ml-2" />}
                                        </div>

                                    </td>
                                    <td className="w-[15%]">{e.users.name}</td>
                                    <td className="w-[10%]">{e.tools.name}</td>
                                    <td className="w-[15%]">{
                                        e.date_created !== null ? new Date(e.date_created).toLocaleString('en-US', {
                                            year: 'numeric',
                                            month: '2-digit',
                                            day: '2-digit',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        }) : ''
                                    }</td>
                                    <td className="w-[15%]">{e.name}</td>
                                    <td className="hidden h-[50px] 2xl:block w-full overflow-hidden p-2">
                                        <div className="flex justify-start items-center w-full h-full overflow-hidden">
                                            <img src={`/api/image?spec=${e.specification_id}`} alt="" className="h-full w-auto aspect-auto" />
                                        </div>
                                    </td>
                                    <td className="w-[10%]">
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
                {generatePagination()}
            </div>
        </div >
    )
}