import { Series } from "@/app/types"

interface SeriesIdOnly {
    series_id: number
}

export default function EditCatalog({
    series,
    importCatalogTools,
    button
}: {
    series: Series,
    importCatalogTools: Function,
    button: React.ReactNode
}) {
    let catalogUpdated: Date = new Date(series.catalog_updated);
    if (series.helix_angle === undefined) return <></>;
    return (
        <>
            <hr className="my-2 border-neutral" />
            <div className='flex flex-col justify-start items-start'>
                <div className="font-bold mb-4">
                    Edit/Add catalog tools for series
                </div>
                <div className="flex flex-row justify-start items-center w-full">
                    <button type="button" className="btn btn-primary mr-4" onClick={(e) => importCatalogTools()}>
                        {button}
                    </button>
                    {
                        series.catalog_updated === null ?
                            'Latest catalog tool import: Never' :
                            <>
                            Latest import: {catalogUpdated.toDateString()} {catalogUpdated.toLocaleTimeString()}<br />Number of tools: {series._count.catalog_tools}
                            </>
                    }
                </div>
            </div>
        </>
    )
}