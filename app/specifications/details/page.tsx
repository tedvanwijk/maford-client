import { AlertCircle } from "react-feather";
import { Suspense } from "react";
import { join } from 'path';
import SpecificationEdit from "@/components/specifications/edit/specificationEdit";
import type { Metadata } from 'next';
import Image from "next/image";

export async function generateMetadata(
    { searchParams }:
        { searchParams: { r: string } }
): Promise<Metadata> {
    return { title: `Specification Details - ${searchParams.r}` }
}

export default async function SpecificationDetails(
    { searchParams }:
        { searchParams: { r: string } }
) {
    const spec = await fetch(
        `${process.env.API_URL}/specification/${searchParams.r}`,
        {
            method: "GET",
            cache: "no-cache"
        }
    ).then(res => res.json());
    let specData = spec.data;

    let badgeClasses = '';
    let error: React.ReactNode;
    switch (spec.status) {
        case 'finished':
            badgeClasses = 'bg-primary text-base-100';
            break;
        case 'generating':
            badgeClasses = 'bg-accent';
            break;
        case 'failed':
            badgeClasses = 'bg-red-700 text-base-100'
            error = generateErrorContent();
            break;
        case 'pending':
            badgeClasses = 'bg-accent';
            break;
    }

    function generateErrorContent() {
        return (
            <>
                <div className="flex flex-row justify-start items-center my-2">
                    <AlertCircle className="mr-2" />This specification has failed. Below is the error message generated by the program. If this keeps happening, please report the error.
                </div>
                <div className="hero bg-base-200 rounded-xl mt-2 place-items-start mb-4">
                    <div className="hero-content">
                        {spec.error}
                    </div>
                </div>
            </>
        )
    }

    return (
        <>
            <div className="flex flex-row justify-between items-center w-full mb-4">
                <div className="flex flex-col justify-between items-start">
                    <div className="flex flex-row justify-start items-center">
                        <h1 className="font-bold text-xl mr-2">{"Specification " + spec.specification_id}{spec.name ? `: ${spec.name}` : ''}  </h1>
                        <div className={`badge ${badgeClasses}`}>{spec.status}</div>
                    </div>
                    {
                        (spec.status === 'finished' || spec.status === 'failed') ?
                            <h2 className="mt-1 cursor-help" title="This location cannot be opened directly due to security restrictions in this browser. Instead, navigate to this location manually">{join(specData.outputPath || '', spec.specification_id?.toString() || '')}</h2>
                            : ''
                    }
                </div>
                <div className="flex flex-row justify-end items-start">
                    {
                        (spec.status === 'generating' || spec.status === 'pending') ?
                            <a className="btn" href={`/cancel?r=${searchParams.r}`}>Cancel</a>
                            : ''
                    }
                    <a className="btn ml-4" href={`/report?r=${searchParams.r}`}>Report Issue</a>
                    <a className="btn btn-primary ml-4" href={`/specifications/new?r=${searchParams.r}`}>Copy</a>
                </div>
            </div>
            {
                spec.versions.active ?
                    '' :
                    <h1 className="flex flex-row justify-start items-center my-2"> <AlertCircle className="mr-2" />This specification was created using an older version. Some of the information below might be incorrect and copying might not work as expected.</h1>
            }
            {error}

            <Image src={`/specs/${searchParams.r}.png`} alt="" width={1503} height={930} className="w-full aspect-auto max-h-[120px] object-cover m-0" />

            <Suspense>
                <SpecificationEdit viewOnly={true} />
            </Suspense>
        </>
    )
}