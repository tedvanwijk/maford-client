import type { Metadata } from 'next';

export async function generateMetadata(
    { params }:
        { params: { catalog_tool_id: string } }
): Promise<Metadata> {
    const tool = await fetch(
        `${process.env.API_URL}/catalog/${params.catalog_tool_id}`,
        {
            method: "GET",
            cache: "no-cache"
        }
    ).then(res => res.json());

    return {
        title: `Catalog Details - ${tool.tool_number}`
    }
}

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
        let propertyColumn = [];
        let valueColumn = [];
        let convertedColumn = [];
        let isMetricTool = tool.convertedData !== undefined
        for (const [key, value] of Object.entries(tool.data)) {
            if (key === '_tool') continue;

            let isMetric = false;
            if (isMetricTool && tool.convertedData[key] !== undefined) isMetric = true;

            propertyColumn.push(
                <p>{key}: </p>
            )

            valueColumn.push(
                <p>{`${(value as string).toString()}${isMetric ? 'mm' : ''}` || '\u200B'}</p>
            )

            convertedColumn.push(
                <p>{isMetric ? `→ ${tool.convertedData[key]}"` : '\u200B'}</p>
            )
        }
        return <>
            <div className="flex flex-col justify-start items-start mr-4">
                {propertyColumn}
            </div>
            <div className="flex flex-col justify-start items-end mr-4">
                {valueColumn}
            </div>
            <div className="flex flex-col justify-start items-start">
                {convertedColumn}
            </div>
        </>;
    }

    return (
        <>
            <div className="flex flex-row justify-start items-center">
                <h1 className="font-bold text-xl mr-2">{"Catalog tool: " + tool.tool_number}</h1>
            </div>
            <h1 className="font-bold text-lg">Catalog data</h1>
            <div className="flex flex-row items-start hero bg-base-200 rounded-xl p-4 mb-4">
                {createSummary()}
            </div>
            <a className="btn btn-primary mr-4" href={`/specifications/new?r=c_${params.catalog_tool_id}`}>Copy</a>
        </>
    )
}