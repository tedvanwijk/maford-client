import { SeriesInput, Series } from "@/app/types";
import { useRef } from "react";
import { ChevronDown } from "react-feather";

export default function ToolSeriesInput(
    {
        formData,
        setFormData,
        selectedSeries,
        seriesInputsShown,
        changeSeries,
        series,
    }:
        {
            formData: { [k: string]: any },
            setFormData: Function,
            selectedSeries: number,
            seriesInputsShown: SeriesInput[] | null,
            changeSeries: Function,
            series: Series[],
        }
) {
    const dropdown: any = useRef(null);
    return (
        <label className={`form-control w-[200px] transition-opacity`}>
            <div className="label">
                <span>Series</span>
            </div>
            <details className={`dropdown mr-4`} ref={dropdown}>
                <summary className="btn bg-base-100 m-0 w-[200px]">
                    {selectedSeries === -1 ? <>Select Tool Series <ChevronDown /></> : (series.find((e: Series) => e.series_id === selectedSeries)?.name)}
                </summary>
                <ul className="p-2 shadow menu dropdown-content !relative z-[100] bg-base-100 rounded-box w-[200px]">
                    {
                        series.map((e: Series) =>
                            <li key={e.series_id} className="z-[100]">
                                <button className="z-[100]" onClick={(ee) => {
                                    changeSeries(e.series_id);
                                    dropdown.current.open = false;
                                }}>{e.name}</button>
                            </li>
                        )
                    }
                </ul>
            </details>
        </label>
    )
}