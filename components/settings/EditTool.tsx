'use client'

import { Series } from "@/app/types";
import { apiUrl } from "@/lib/api";
import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "react-feather";

export default function EditTool() {
    const [series, setSeries]: [Series[], Function] = useState([]);
    const [selectedSeries, setSelectedSeries] = useState<Series | null>(null);
    const [newMode, setNewMode] = useState(true);
    const dropdown: any = useRef(null);

    useEffect(() => {
        fetch(
            `${apiUrl}/series`,
            {
                method: 'GET',
                cache: 'no-cache'
            }
        )
            .then(res => res.json())
            .then(res => setSeries(res));

    }, []);

    function changeSeries(seriesId: number, event: any) {
        fetch(
            `${apiUrl}/series/${seriesId}`,
            {
                method: 'GET',
                cache: 'no-cache'
            }
        )
            .then(res => res.json())
            .then(res => setSelectedSeries(res));
        dropdown.current.open = false;
    }

    return (
        <div className="h-[500px]">
            <form onSubmit={e => e.preventDefault()} className="flex flex-col">
                <div className="flex flex-row justify-start items-start mb-2">
                    <details className={`dropdown mr-4 ${newMode ? 'opacity-30 pointer-events-none' : ''}`} ref={dropdown}>
                        <summary className="btn bg-base-100 m-0 w-[200px]">
                            {selectedSeries === null ? <>Select Tool Series <ChevronDown /></> : (selectedSeries.name)}
                        </summary>
                        <ul className="p-2 shadow menu dropdown-content z-[100] bg-base-100 rounded-box w-[200px]">
                            {
                                series.map((e: Series) =>
                                    <li key={e.series_id}>
                                        <button onClick={(ee) => changeSeries(e.series_id, ee)}>{e.tools?.name}: {e.name}</button>
                                    </li>
                                )
                            }
                        </ul>
                    </details>
                    <button disabled={newMode} className={`btn btn-primary ${newMode ? 'opacity-30' : ''}`} onClick={() => setNewMode(true)}>Add new series</button>
                </div>

                <div className="flex flex-row mb-4">
                    <div className="flex flex-col">
                        <label className="form-control w-[200px] transition-opacity">
                            <div className="label">
                                <span>Name</span>
                            </div>
                        </label>
                        <input
                            type="text"
                            placeholder="Enter value"
                            className="input input-bordered w-full"
                        />
                    </div>
                </div>


                <div className="flex flex-row">
                    <button className="btn btn-primary mr-4">{newMode ? 'Create' : 'Apply'}</button>
                    {newMode ? <button className="btn" onClick={() => setNewMode(false)}>Cancel</button> : ''}
                </div>

            </form>
        </div>
    )
}