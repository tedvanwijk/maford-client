'use client'

import { Series, SeriesInput, ToolType, ToolInput } from "@/app/types";
import { apiUrl } from "@/lib/api";
import { useEffect, useRef, useState } from "react";
import { Check } from "react-feather";
import { useForm, FormProvider } from "react-hook-form";
import EditToolForm from "./editToolForm";

interface toolTypeInput {
    decimalInputs: ToolInput[],
    toggleInputs: ToolInput[]
};

interface ToolTypeIdOnly {
    tool_id: number
};

interface SeriesIdOnly {
    series_id: number
}

export default function EditTool() {
    const [series, setSeries]: [Series[], Function] = useState([]);
    const [selectedSeries, setSelectedSeries] = useState<Series | SeriesIdOnly>({ series_id: -2 });
    const [toolTypes, setToolTypes]: [ToolType[], Function] = useState([]);
    const [selectedToolType, setSelectedToolType] = useState<ToolType | ToolTypeIdOnly>({ tool_id: -1 });
    const [toolTypeInputs, setToolTypeInputs] = useState<toolTypeInput>();
    const [seriesInputs, setSeriesInputs]: [SeriesInput[], Function] = useState([]);
    const [oldSeriesInputLength, setOldSeriesInputLength] = useState(0);
    const [newMode, setNewMode] = useState(false);
    const [applyButton, setApplyButton] = useState(<>Apply</>);
    const formMethods = useForm({ mode: 'onChange' });

    useEffect(() => {
        fetch(
            `${apiUrl}/tools`,
            {
                method: 'GET',
                cache: 'no-cache'
            }
        )
            .then(res => res.json())
            .then(res => setToolTypes(res));
    }, []);

    function changeToolType(toolType: ToolType) {
        // user has changed tool type, so load the tool series corresponding to that type
        fetch(
            `${apiUrl}/series/tool_id/${toolType.tool_id}`,
            {
                method: 'GET',
                cache: 'no-cache'
            }
        )
            .then(res => res.json())
            .then(res => {
                let seriesOptions = res;
                seriesOptions.push({ name: 'Add new', series_id: -1 })
                setSelectedToolType(toolType);
                setSeries(res);
                setSelectedSeries({ series_id: -2 });
            });

        fetch(
            `${apiUrl}/tools/${toolType.tool_id}/inputs/by_type`,
            {
                method: 'GET',
                cache: 'no-cache'
            }
        )
            .then(res => res.json())
            .then(res => setToolTypeInputs(res));
        formMethods.reset();
    }

    function changeSeries(series: Series, disableButtonUpdate = false) {
        formMethods.reset();
        if (series.series_id === -1) {
            setNewMode(true);
            if (!disableButtonUpdate) setApplyButton(<>Create</>);
            setSelectedSeries(series);
            setSeriesInputs([]);
            return;
        }
        setNewMode(false);
        if (!disableButtonUpdate) setApplyButton(<>Apply</>);
        fetch(
            `${apiUrl}/series/${series.series_id}/inputs`,
            {
                method: 'GET',
                cache: 'no-cache'
            }
        )
            .then(res => res.json())
            .then(res => {
                setSelectedSeries(series);
                setSeriesInputs(res);
                setDefaultValues(series, res);
                setOldSeriesInputLength(res.length);
            });
    }

    function setDefaultValues(series: Series, seriesInputs: SeriesInput[]) {
        formMethods.setValue('name', series.name);
        formMethods.setValue('flute_count', series.flute_count);
        formMethods.setValue('helix_angle', series.helix_angle);
        formMethods.setValue('tool_series_file_name', series.tool_series_file_name);
        formMethods.setValue('tool_series_input_range', series.tool_series_input_range);
        formMethods.setValue('tool_series_output_range', series.tool_series_output_range);

        type seriesInputColumnType = keyof SeriesInput;
        const seriesInputColumns: seriesInputColumnType[] = ['name', 'type', 'value'];
        for (let i = 0; i < seriesInputs.length; i++) {
            const input = seriesInputs[i];
            for (let column = 0; column < seriesInputColumns.length; column++) {
                if (input[seriesInputColumns[column]] === null) continue;
                const formName = `${input.index}__${seriesInputColumns[column]}`;
                formMethods.setValue(formName, input[seriesInputColumns[column]]);
            }
        }
    }

    function addSeriesInput() {
        const newIndex = seriesInputs.length;
        const newSeriesInput = {
            index: newIndex,
            name: '',
            series_id: selectedSeries,
            type: 'cst',
            value: ''
        }
        setSeriesInputs([...seriesInputs, newSeriesInput]);
        formMethods.setValue(`${newIndex}__type`, newSeriesInput.type);
    }

    function removeSeriesInput() {
        const seriesInputsCopy = [...seriesInputs];
        const removedInput = seriesInputsCopy.pop() as SeriesInput;
        const removedIndex = removedInput.index;
        type seriesInputColumnType = keyof SeriesInput;
        const seriesInputColumns: seriesInputColumnType[] = ['name', 'type', 'value'];
        for (let column = 0; column < seriesInputColumns.length; column++) {
            formMethods.unregister(`${removedIndex}__${seriesInputColumns[column]}`)
        }
        setSeriesInputs(seriesInputsCopy);
    }

    async function submitChanges() {
        // TODO: error checking + loading screen
        const formData = formMethods.getValues();
        let changedSeries;
        if (newMode) {
            changedSeries = await fetch(
                `${apiUrl}/series/${selectedToolType.tool_id}/new`,
                {
                    method: 'POST',
                    cache: 'no-cache',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        ...formData,
                        seriesInputLength: seriesInputs.length
                    })
                }
            )
                .then(res => {
                    if (res.status === 201) {
                        setApplyButton(<>Created<Check /></>);
                        setTimeout(() => setApplyButton(<>Apply</>), 3000);
                    } else {
                        setApplyButton(<>Failed</>);
                        setTimeout(() => setApplyButton(<>Apply</>), 3000);
                    }
                    return res.json();
                })
        } else {
            changedSeries = await fetch(
                `${apiUrl}/series/${selectedSeries.series_id}`,
                {
                    method: 'PUT',
                    cache: 'no-cache',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        ...formData,
                        seriesInputLength: seriesInputs.length,
                        oldSeriesInputLength
                    })
                }
            )
                .then(res => {
                    if (res.status === 200) {
                        setApplyButton(<>Applied<Check /></>);
                        setTimeout(() => setApplyButton(<>Apply</>), 3000);
                    } else {
                        setApplyButton(<>Applying failed</>);
                        setTimeout(() => setApplyButton(<>Apply</>), 3000);
                    }
                    return res.json();
                })
        }

        // after a series has been added or changed, re-fetch the series so the new or altered series shows up in the dropdown
        await fetch(
            `${apiUrl}/series/tool_id/${selectedToolType.tool_id}`,
            {
                method: 'GET',
                cache: 'no-cache'
            }
        )
            .then(res => res.json())
            .then(res => {
                let seriesOptions = res;
                seriesOptions.push({ name: 'Add new', series_id: -1 })
                setSeries(res);
            });

        changeSeries(changedSeries, true);
    }
    return (
        <div className="">
            <form onSubmit={(e: any) => {
                e.preventDefault();
                submitChanges();
            }} className="flex flex-col">
                <div className="flex flex-row justify-start items-start mb-2">

                    <select value={selectedToolType.tool_id} onChange={e => changeToolType(toolTypes.filter((ee: ToolType) => ee.tool_id === parseInt(e.target.value))[0])} className="input input-bordered mr-4">
                        {
                            toolTypes.map((e: ToolType) => (
                                <option value={e.tool_id} key={e.tool_id}>{e.name}</option>
                            ))
                        }
                        <option value={-1} disabled hidden>Select Tool Type</option>
                    </select>

                    <select
                        value={selectedSeries.series_id}
                        onChange={e => changeSeries(series.filter((ee: Series) => ee.series_id === parseInt(e.target.value))[0])}
                        className="input input-bordered mr-4"
                        disabled={selectedToolType.tool_id === -1}
                    >
                        {
                            series.map((e: Series) => (
                                <option value={e.series_id} key={e.series_id}>{e.name}</option>
                            ))
                        }
                        <option value={-2} disabled hidden>Select Series</option>
                    </select>

                </div>

                <hr className="my-2 border-neutral" />

                <FormProvider {...formMethods}>
                    <EditToolForm
                        enabled={selectedSeries !== null}
                        seriesInputs={seriesInputs}
                        addSeriesInput={addSeriesInput}
                        removeSeriesInput={removeSeriesInput}
                        toolTypeInputs={toolTypeInputs as toolTypeInput}
                    />
                </FormProvider>

                <hr className="mt-2 border-neutral" />

                <div className="flex flex-row mt-4">
                    <button type="submit" disabled={selectedSeries === null} className={`${selectedSeries === null ? 'opacity-30 pointer-events-none' : ''} btn btn-primary mr-4`}>{applyButton}</button>
                </div>

            </form>
        </div>
    )
}