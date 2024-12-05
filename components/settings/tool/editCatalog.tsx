import { Series } from "@/app/types"

interface SeriesIdOnly {
    series_id: number
}

export default function EditCatalog({
    series,
    importCatalogTools,
    button,
    enabled
}: {
    series: Series,
    importCatalogTools: Function,
    button: React.ReactNode,
    enabled: boolean
}) {
    if (series.helix_angle === undefined) return <></>;
    if (!enabled) return <></>;
    return (
        <>
            <hr className="my-2 border-neutral" />
            <div className='flex flex-col justify-start items-start'>
                <div className="font-bold mb-4">
                    Import catalog tools
                </div>
                <div className="flex flex-row justify-start items-center w-full">
                    <button type="button" className="btn btn-primary mr-4" onClick={(e) => importCatalogTools()}>
                        {button}
                    </button>
                    {
                        series.catalog_updated === null ?
                            'Latest catalog tool import: Never' :
                            <>
                                Latest import: {
                                    new Date(series.catalog_updated).toLocaleString('en-US', {
                                        year: 'numeric',
                                        month: '2-digit',
                                        day: '2-digit',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })
                                }<br />Number of tools: {series._count.catalog_tools}
                            </>
                    }
                </div>
            </div>
        </>
    )
}