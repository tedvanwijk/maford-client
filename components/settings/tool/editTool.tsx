'use client'

import { Series, SeriesInput, ToolType, ToolInput } from "@/app/types";
import { apiUrl } from "@/lib/api";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, Check } from "react-feather";
import { useForm, FormProvider } from "react-hook-form";
import EditToolForm from "./editToolForm";

interface toolTypeInput {
    decimalInputs: ToolInput[],
    toggleInputs: ToolInput[]
};

export default function EditTool() {
    const [series, setSeries]: [Series[], Function] = useState([]);
    const [selectedSeries, setSelectedSeries] = useState<Series | null>(null);
    const [toolTypes, setToolTypes]: [ToolType[], Function] = useState([]);
    const [selectedToolType, setSelectedToolType] = useState<ToolType | null>(null);
    const [toolTypeInputs, setToolTypeInputs] = useState<toolTypeInput>();
    const [seriesInputs, setSeriesInputs]: [SeriesInput[], Function] = useState([]);
    const [oldSeriesInputLength, setOldSeriesInputLength] = useState(0);
    const [newMode, setNewMode] = useState(false);
    const [applyButton, setApplyButton] = useState(<>Apply</>);
    const toolTypeDropdown: any = useRef(null);
    const toolSeriesDropdown: any = useRef(null);
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

    function changeToolType(toolType: ToolType, event: any) {
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
                setSelectedSeries(null);
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
        toolTypeDropdown.current.open = false;
    }

    function changeSeries(series: Series, event: any, disableButtonUpdate = false) {
        if (series.series_id === -1) {
            setNewMode(true);
            if (!disableButtonUpdate) setApplyButton(<>Create</>);
            setSelectedSeries(series);
            setSeriesInputs([]);
            formMethods.reset();
            toolSeriesDropdown.current.open = false;
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
        formMethods.reset();
        toolSeriesDropdown.current.open = false;
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
            series_id: selectedSeries?.series_id,
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

    function submitChanges() {
        // TODO: error checking + loading screen
        const formData = formMethods.getValues();

        if (newMode) {
            fetch(
                `${apiUrl}/series/${selectedToolType?.tool_id}/new`,
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
            .then(res =>changeSeries(res, '', true));
        } else {
            fetch(
                `${apiUrl}/series/${selectedSeries?.series_id}`,
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
            .then(res => changeSeries(res, '', true));
        }        
    }

    return (
        <div className="">
            <form onSubmit={(e: any) => {
                e.preventDefault();
                submitChanges();
            }} className="flex flex-col">
                <div className="flex flex-row justify-start items-start mb-2">

                    <details className={`dropdown mr-4`} ref={toolTypeDropdown}>
                        <summary className="btn bg-base-100 m-0 w-[200px]">
                            {selectedToolType === null ? <>Select Tool Type <ChevronDown /></> : (selectedToolType.name)}
                        </summary>
                        <ul className="p-2 shadow menu dropdown-content z-[100] bg-base-100 rounded-box w-[200px]">
                            {
                                toolTypes.map((e: ToolType) =>
                                    <li key={e.tool_id}>
                                        <button type="button" onClick={(ee) => changeToolType(e, ee)}>{e.name}</button>
                                    </li>
                                )
                            }
                        </ul>
                    </details>

                    <details className={`dropdown mr-4 ${selectedToolType === null ? 'opacity-30 pointer-events-none' : ''}`} ref={toolSeriesDropdown}>
                        <summary className="btn bg-base-100 m-0 w-[200px]">
                            {selectedSeries === null ? <>Select Series <ChevronDown /></> : (selectedSeries.name)}
                        </summary>
                        <ul className="p-2 shadow menu dropdown-content z-[100] bg-base-100 rounded-box w-[200px]">
                            {
                                series.map((e: Series) =>
                                    <li key={e.series_id}>
                                        <button type="button" onClick={(ee) => changeSeries(e, ee)}>{e.name}</button>
                                    </li>
                                )
                            }
                        </ul>
                    </details>
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