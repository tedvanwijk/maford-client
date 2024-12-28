import { Series } from "@/app/types";

export default function ToolSeriesInput(
    {
        selectedSeries,
        changeSeries,
        series,
        seriesEdited
    }:
        {
            selectedSeries: number,
            changeSeries: Function,
            series: Series[],
            seriesEdited: boolean
        }
) {
    return (
        <label className={`form-control transition-opacity`}>
            <div className="label">
                <span>Series</span>
            </div>

            <div className="flex flex-row items-center">
                <select value={selectedSeries} className="input input-bordered mr-4 w-[200px]" onChange={e => changeSeries(parseInt(e.target.value))}>
                    <option value={-1}>None</option>
                    {
                        series.map((e: Series) =>
                            <option key={e.series_id} value={e.series_id} disabled={!e.active} hidden={!e.active}>
                                {e.name}
                            </option>
                        )
                    }
                </select>
                {
                    selectedSeries === -1 ?
                        'Warning: if no series is selected, no tolerance data will be imported' :
                        seriesEdited ?
                            <button onClick={() => changeSeries(selectedSeries)} type="button" className="btn btn-primary">Reset fluting parameters</button>
                            : ''
                }
            </div>

        </label>
    )
}