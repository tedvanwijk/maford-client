import { ToolInput } from "@/app/types";
import { AlertCircle } from "react-feather";
import { join } from 'path';
import SpecificationEdit from "@/components/specifications/edit/specificationEdit";

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
    }

    function generateErrorContent() {
        return (
            <>
                <div>
                    This specification has failed. Below is the error message generated by the program. If this keeps happening, please report the error.
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
            <div className="flex flex-row justify-between items-center w-full">
                <div className="flex flex-col justify-start items-start">
                    <div className="flex flex-row justify-start items-center">
                        <h1 className="font-bold text-xl mr-2">{"Specification " + spec.specification_id}{spec.name ? `: ${spec.name}` : ''}  </h1>
                        <div className={`badge ${badgeClasses}`}>{spec.status}</div>
                    </div>
                    {
                        spec.status === ('finished' || 'failed') ?
                            <h2 className="mb-4 mt-1 cursor-help" title="This location cannot be opened directly due to security restrictions in this browser. Instead, navigate to this location manually">{join(specData.outputPath || '', spec.specification_id?.toString() || '')}</h2>
                            : ''
                    }
                </div>
                <div className="flex flex-row justify-end items-start">
                    <a className="btn btn-primary mr-4" href={`/specifications/new?r=${searchParams.r}`}>Copy to New</a>
                    <a className="btn" href={`/report?r=${searchParams.r}`}>Report Issue</a>
                </div>
            </div>
            {
                spec.versions.active ?
                    '' :
                    <h1 className="flex flex-row justify-start items-center my-2"> <AlertCircle className="mr-2" />This specification was created using an older version. Some of the information below might be incorrect and copying might not work as expected.</h1>
            }
            {error}
            <div className="flex flex-row justify-start items-center">
                <h1 className="font-bold text-l mr-2 my-2">Specification Inputs</h1>
            </div>
            <SpecificationEdit viewOnly={true} />
        </>
    )
}