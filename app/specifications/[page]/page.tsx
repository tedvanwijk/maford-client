import Link from "next/link";

import { Specification } from "@/app/types";
import SearchButton from '@/components/specifications/searchButton';

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
                    <h1 className="text-xl font-bold">{(searchParams.u === 'null' || searchParams.u === '-1') ? 'All' : `Your`} specifications</h1>
                    {
                        (searchParams.u === 'null' || searchParams.u === '-1') ?
                            <Link href={`/specifications/${params.page}?u=${searchParams.r}&r=${searchParams.r}&s=${searchParams.s}`} className="btn ml-4">View your specifications</Link> :
                            <Link href={`/specifications/${params.page}?u=null&r=${searchParams.r}&s=${searchParams.s}`} className="btn ml-4">View all specifications</Link>
                    }

                </div>
                <SearchButton p={params.page} u={searchParams.u} r={searchParams.r} s={searchParams.s} />
            </div>




            <table className="table table-zebra">
                <thead>
                    <tr>
                        <th></th>
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
                                        <Link href={`/specifications/details/${e.specification_id}`} className="absolute bottom-0 left-0 top-0 right-0" />
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
                {generatePagination()}
            </div>
        </div >
    )
}