import { ToolInput } from "@/app/types";
import { join } from 'path';

export default async function SpecificationDetails(
    { params }:
        { params: { specification_id: string } }
) {
    const spec = await fetch(
        `${process.env.API_URL}/specification/${params.specification_id}`,
        {
            method: "GET",
            cache: "no-cache"
        }
    ).then(res => res.json());
    let specData = await JSON.parse(spec.data);
    let inputs = await fetch(
        `${process.env.API_URL}/tool/${specData.ToolType}/inputs`,
        {
            method: 'GET',
            cache: 'no-cache'
        }
    ).then(res => res.json());

    let badgeClasses = '';
    let summary = generateSummary();
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

    function generateSummary() {
        let summary = [];
        const categories = inputs.toolCategories;
        for (let i = 0; i < categories.length; i++) {
            const inputsForCategory = inputs.toolInputs.filter(
                (e: ToolInput) =>
                    e.tool_input_category_id === categories[i].tool_input_category_id && specData[e.property_name] !== null && specData[e.property_name] !== ''
            );

            summary.push(
                <div className="flex flex-col w-[250px] mr-4" key={categories[i].tool_input_category_id}>
                    {inputsForCategory.map((e: ToolInput) => {
                        if (specData[e.property_name] === undefined) return(<></>)
                        return (
                            <div className="flex flex-row justify-between" key={e.tool_input_id}>
                                <p>{e.client_name}:</p>
                                <p>{specData[e.property_name].toString()}</p>
                            </div>
                        )
                    }
                    )}
                </div>
            )
        }

        return (
            <>
                <h1 className="font-bold text-lg">Specification data</h1>
                <div className="flex flex-row items-start w-full hero bg-base-200 rounded-xl p-4 mb-4">
                    {...summary}
                </div>
            </>
        )
    }

    return (
        <>
            <dialog id="modal" className="modal">
                <div className="modal-box p-0">

                </div>
            </dialog>

            <div className="flex flex-row justify-start items-center">
                <h1 className="font-bold text-xl mr-2">{"Specification " + spec.specification_id}{spec.name ? `: ${spec.name}` : ''}  </h1>
                <div className={`badge ${badgeClasses}`}>{spec.status}</div>
            </div>
            {
                spec.status === ('finished' || 'failed') ? 
                <h2 className="mb-4 mt-1 cursor-help" title="This location cannot be opened directly due to security restrictions in this browser. Instead, navigate to this location manually">{join(specData.outputPath || '', spec.specification_id?.toString() || '')}</h2>
                : ''
            }
            {summary}
            {error}
            <a className="btn btn-primary mr-4" href={`/specifications/new?r=${params.specification_id}`}>Copy</a>
            <a className="btn" href={`/report?r=${params.specification_id}`}>Report Issue</a>
        </>
    )
}