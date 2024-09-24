'use client'

import { Series, SeriesInput, ToolType, ToolInput } from "@/app/types";
import { apiUrl } from "@/lib/api";
import { useEffect, useState } from "react";
import { Check } from "react-feather";
import { useForm, FormProvider } from "react-hook-form";
import EditToolForm from "./editToolForm";
import EditCatalog from "./editCatalog";

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
    const [catalogButton, setCatalogButton] = useState(<>Import catalog tools</>)
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

    function changeSeries(series: Series, disableButtonUpdate = false, resetForm = false) {
        if (resetForm) formMethods.reset();
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
                setOldSeriesInputLength(res.length);
                return {seriesInputs: res, series}
            })
            .then(res => setDefaultValues(res.series, res.seriesInputs));
    }

    function setDefaultValues(series: Series, seriesInputs: SeriesInput[]) {
        formMethods.setValue('name', series.name);
        formMethods.setValue('flute_count', series.flute_count);
        formMethods.setValue('helix_angle', series.helix_angle);
        formMethods.setValue('tool_series_file_name', series.tool_series_file_name);
        formMethods.setValue('tool_series_input_range', series.tool_series_input_range);
        formMethods.setValue('tool_series_output_range', series.tool_series_output_range);

        type seriesInputColumnType = keyof SeriesInput;
        const seriesInputColumns: seriesInputColumnType[] = ['type', 'name', 'value', 'catalog_index'];
        for (let i = 0; i < seriesInputs.length; i++) {
            const input = seriesInputs[i];
            for (let column = 0; column < seriesInputColumns.length; column++) {
                if (input[seriesInputColumns[column]] === null) continue;
                const formName = `series_input.${input.index}.${seriesInputColumns[column]}`;
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
            value: '',
            catalog_index: newIndex
        }
        setSeriesInputs([...seriesInputs, newSeriesInput]);
        formMethods.setValue(`series_input.${newIndex}.type`, newSeriesInput.type);
        formMethods.setValue(`series_input.${newIndex}.catalog_index`, newSeriesInput.catalog_index);
    }

    function removeSeriesInput() {
        const seriesInputsCopy = [...seriesInputs];
        const removedInput = seriesInputsCopy.pop() as SeriesInput;
        const removedIndex = removedInput.index;
        formMethods.unregister(`series_input.${removedIndex}`)
        setSeriesInputs(seriesInputsCopy);
    }

    function importCatalogTools() {
        fetch(
            `${apiUrl}/catalog/${selectedSeries.series_id}/update`,
            {
                method: 'PUT',
                cache: 'no-cache',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            }
        )
            .then(res => {
                if (res.status === 200) {
                    return res.json();;
                } else {
                    setCatalogButton(<>Failed</>);
                    setTimeout(() => setCatalogButton(<>Import catalog tools</>), 3000);
                    return false
                }
            })
            .then(res => {
                if (res === false) return;
                setCatalogButton(<>Added {res.catalogTools.count} catalog tools<Check /></>);
                setTimeout(() => setCatalogButton(<>Import catalog tools</>), 3000);
                res.series._count.catalog_tools = res.catalogTools.count;
                setSelectedSeries(res.series);
                let seriesCopy = [...series];
                seriesCopy.filter(e => e.series_id === res.series.series_id)[0] = res.series;
                setSeries(seriesCopy);
            })
    }

    async function submitChanges() {
        // TODO: error checking + loading screen
        const formData = formMethods.getValues();
        if (formData.series_input === undefined) formData.series_input = [];
        else formData.series_input.length = seriesInputs.length;
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
            })
            .then(() => changeSeries(changedSeries, true));
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
                        onChange={e => changeSeries(series.filter((ee: Series) => ee.series_id === parseInt(e.target.value))[0], false, true)}
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
                    <EditCatalog
                        series={selectedSeries as Series}
                        importCatalogTools={importCatalogTools}
                        button={catalogButton}
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