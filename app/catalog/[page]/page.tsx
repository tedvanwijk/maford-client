import SearchButton from "@/components/catalog/searchButton";
import Link from "next/link";
import { CatalogTool } from "@/app/types";
import type { Metadata } from 'next'

export async function generateMetadata(
    {
        params, searchParams
    }:
        {
            params: { page: string },
            searchParams: { s: string }
        }
): Promise<Metadata> {
    let title = `Catalog tools - Page ${(parseInt(params.page) + 1).toString()}`;;
    if (searchParams.s !== '') title += ` - Search: ${searchParams.s}`;
    return { title }
}

export default async function Catalog(
    {
        params, searchParams
    }:
        {
            params: { page: string },
            searchParams: { s: string }
        }
) {
    const { tools, pages } = await fetch(
        `${process.env.API_URL}/catalog?p=${params.page}&s=${searchParams.s}`,
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
                        className={`min-w-[3rem] btn mx-1 ${active && 'bg-primary text-base-100'}`}
                        href={`/catalog/${e}?s=${searchParams.s}`}
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
                    href={`/catalog/${i}?s=${searchParams.s}`}
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
                    href={`/catalog/${0}?s=${searchParams.s}`}
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
                    href={`/catalog/${pages - 1}?s=${searchParams.s}`}
                    key={pages - 1}
                >
                    {pages}
                </Link>
            );
        }

        return pageElements;
    }

    return(
        <div className="flex flex-col jusify-between">
            <div className="flex flex-row justify-between items-center mb-4">
                <div className="flex flex-row justfy-start items-center`">
                    <h1 className="text-xl font-bold">Catalog tools</h1>
                </div>
                <SearchButton s={searchParams.s} />
            </div>

            <table className="table table-zebra">
                <thead>
                    <tr>
                        <th>Tool Type</th>
                        <th>Series</th>
                        <th>Tool #</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        tools.map((e: CatalogTool) => {
                            return (
                                <tr key={e.catalog_tool_id} className="hover relative" >
                                    <td>
                                        <Link href={`/catalog/details/${e.catalog_tool_id}`} className="absolute bottom-0 left-0 top-0 right-0" />
                                        <div className="flex flex-row justify-start items-center">
                                            {e.series?.tools?.name}
                                        </div>
                                    </td>
                                    <td>{e.series?.name}</td>
                                    <td>{e.tool_number}</td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>

            <div className="mt-2 w-full flex flex-row justify-center">
                {generatePagination()}
            </div>
        </div>
    )
}