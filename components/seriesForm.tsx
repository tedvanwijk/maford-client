'use client'

import { useEffect, useRef, useState } from "react";
import { apiUrl } from "@/lib/api";
import { SeriesInput, Series } from "@/app/types";
import { ChevronDown } from "react-feather";

export default function SeriesForm(
    {
        formData,
        setFormData,
        seriesInputs,
        setSeriesInputs,
        selectedSeries,
        setSelectedSeries,
        seriesInputsShown,
        setSeriesInputsShown,
        changeSeries,
        series,
        setSeries
    }:
        {
            formData: { [k: string]: any },
            setFormData: Function,
            seriesInputs: SeriesInput[] | null,
            setSeriesInputs: Function,
            selectedSeries: number,
            setSelectedSeries: Function,
            seriesInputsShown: SeriesInput[] | null,
            setSeriesInputsShown: Function
            changeSeries: Function,
            series: Series[],
            setSeries: Function
        }) {
    const dropdown: any = useRef(null);
    // const [seriesInputs, setSeriesInputs] = useState<SeriesInput[] | null>(null);
    // const [seriesInputsShown, setSeriesInputsShown] = useState<SeriesInput[] | null>(null);
    // const [series, setSeries]: [Series[], Function] = useState([]);
    // const [selectedSeries, setSelectedSeries] = useState('');
    // const [formData, setFormData]: [{ [k: string]: any }, Function] = useState({});
    // function changeSeries(seriesId: number, event: any) {
    //     fetch(
    //         `${apiUrl}/series/${seriesId}/inputs`,
    //         {
    //             method: 'GET',
    //             cache: 'no-cache'
    //         }
    //     )
    //         .then(res => res.json())
    //         .then(res => {
    //             setSeriesInputs(res);
    //             const seriesInputsShown = res.filter((e: SeriesInput) => e.type === 'toggle');
    //             seriesInputsShown.forEach((e: SeriesInput) => {
    //                 switch (e.type) {
    //                     case 'toggle':
    //                         setFormData((oldData: { [k: string]: any }) => ({
    //                             ...oldData,
    //                             [e.property_name]: false
    //                         }))
    //                 }
    //             });
    //             setSeriesInputsShown(seriesInputsShown);
    //         });
    //     dropdown.current.open = false;
    //     setSelectedSeries(series.find(e => e.series_id === seriesId)?.name || '')
    // }

    return (
        <div className="w-full p-4 flex flex-row justify-start flex-wrap">
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
                                        changeSeries(e.series_id, ee);
                                        dropdown.current.open = false;
                                    }}>{e.tools?.name}: {e.name}</button>
                                </li>
                            )
                        }
                    </ul>
                </details>
            </label>
            <div>

            </div>
            {
                seriesInputsShown?.map((e: SeriesInput) => {
                    let inputElement: React.ReactNode;
                    let additionalClasses = '';
                    switch (e.type) {
                        case 'toggle':
                            inputElement = <input
                                type="checkbox"
                                className="toggle toggle-primary my-auto"
                                checked={formData[e.name]}
                                value={formData[e.name]}
                                onChange={(ee) => setFormData((oldData: { [k: string]: any }) => ({
                                    ...oldData,
                                    [e.name]: ee.target.checked
                                }))}
                            />
                            additionalClasses += ' h-[88px]'
                            break;
                    }
                    return (
                        <label className={`form-control w-[200px] ${additionalClasses} transition-opacity`} key={e.series_input_id}>
                            <div className="label">
                                <span>{e.name}</span>
                            </div>
                            {inputElement}
                        </label>
                    )
                })
            }
            {/* <input type="text" onChange={() => setFormData((oldData: { [k: string]: any }) => ({
                ...oldData,
                ['test']: 'test'
            }))} /> */}

        </div>
    )
}