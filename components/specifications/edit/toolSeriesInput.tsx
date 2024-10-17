import { SeriesInput, Series } from "@/app/types";

export default function ToolSeriesInput(
    {
        selectedSeries,
        changeSeries,
        series,
    }:
        {
            selectedSeries: number,
            changeSeries: Function,
            series: Series[],
        }
) {
    return (
        <label className={`form-control w-[200px] transition-opacity`}>
            <div className="label">
                <span>Series</span>
            </div>

            <select value={selectedSeries} className="input input-bordered mr-4" onChange={e => changeSeries(parseInt(e.target.value))}>
                {
                    series.map((e: Series) =>
                        <option key={e.series_id} value={e.series_id}>
                            {e.name}
                        </option>
                    )
                }
                <option value={-1} disabled hidden>Select Tool Series</option>
            </select>
        </label>
    )
}