// import { ToolInput } from "@/app/types";

export default async function CatalogToolDetails(
    { params }:
        { params: { catalog_tool_id: string } }
) {
    const tool = await fetch(
        `${process.env.API_URL}/catalog/${params.catalog_tool_id}`,
        {
            method: "GET",
            cache: "no-cache"
        }
    ).then(res => res.json());

    function createSummary() {
        let summary = [];
        for (const [key, value] of Object.entries(tool.data)) {
            if (key === '_tool') continue;
            summary.push(
                <div className="flex flex-row justify-between w-full" key={key}>
                <p>{key}: </p>
                <p>{(value as string).toString()}</p>
            </div>
            )
        }
        return summary;
    }

    return (
        <>
            <div className="flex flex-row justify-start items-center">
                <h1 className="font-bold text-xl mr-2">{"Catalog tool: " + tool.tool_number}</h1>
            </div>
                <h1 className="font-bold text-lg">Catalog data</h1>
                <div className="flex flex-col items-start hero bg-base-200 rounded-xl p-4 mb-4">
                    {createSummary()}
                </div>
                <a className="btn btn-primary mr-4" href={`/specifications/new?r=c_${params.catalog_tool_id}`}>Copy</a>
        </>
    )
}