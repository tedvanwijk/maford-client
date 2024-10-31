'use client'

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, FormProvider } from 'react-hook-form';
import { apiUrl } from "@/lib/api";
import SpecificationStep from "@/components/specifications/edit/specificationStep";
import SpecificationForm from "@/components/specifications/edit/specificationForm";
import StepForm from "@/components/specifications/edit/stepForm";
import { InputCategory, ToolType, Series, Step, DefaultValue, SeriesInput, CenterInfo, CenterType } from "@/app/types";
import ToolSeriesInput from "@/components/specifications/edit/toolSeriesInput";
import CenterDropdown from "./centerDropdown";

function New({ viewOnly = false }: { viewOnly: boolean }) {
    // TODO: remove all tool series input stuff. Only the tool series needs to be selected, but no custom inputs need to be generated
    const [tools, setTools]: [ToolType[], Function] = useState([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [toolType, setToolType] = useState(-1);
    const [inputCategories, setInputCategories] = useState([]);
    const [saveWindowOpen, setSaveWindowOpen] = useState(false);
    const [specName, setSpecName] = useState('');
    const [seriesInputs, setSeriesInputs] = useState<SeriesInput[] | null>(null);
    const [selectedSeries, setSelectedSeries] = useState(-1);
    const [series, setSeries]: [Series[], Function] = useState([]);
    const [stepCount, setStepCount] = useState(0);
    const [centers, setCenters] = useState<CenterType[]>([]);
    const formMethods = useForm({ mode: 'onChange' });
    const router = useRouter();
    const searchParams = useSearchParams();
    const referenceSpecification = searchParams.get('r')
    useEffect(() => {
        fetch(
            `${apiUrl}/tools`,
            {
                method: "GET",
                cache: "no-cache"
            }
        )
            .then(res => res.json())
            .then(res => setTools(res))
            .then(() => {
                if (referenceSpecification !== null) {
                    if (referenceSpecification[0] === 'c') copyCatalogTool();
                    else copyTool();
                }
            });
        fetch(
            `${apiUrl}/centers?nameOnly=true`,
            {
                method: "GET",
                cache: "no-cache"
            }
        )
            .then(res => res.json())
            .then(res => setCenters(res));
    }, []);

    function changeStepCount(increase: boolean) {
        if (!increase && stepCount === 0) return;
        setStepCount(stepCount + (increase ? 1 : -1));
    }

    function changeCurrentStep(stepEdited: number, reset = false) {
        if (reset) setCurrentStep(stepEdited + 1);
        else {
            if (currentStep <= stepEdited) setCurrentStep(stepEdited + 1);
        }
    }

    function changeSeries(seriesId: number) {
        fetch(
            `${apiUrl}/series/${seriesId}/inputs`,
            {
                method: 'GET',
                cache: 'no-cache'
            }
        )
            .then(res => res.json())
            .then(res => {
                // TODO: remove?
                setSeriesInputs(res);
                const seriesInputsShown = res.filter((e: SeriesInput) => e.type === 'toggle');
                let formData: { [k: string]: any } = {};
                seriesInputsShown.forEach((e: SeriesInput) => {
                    switch (e.type) {
                        case 'toggle':
                            formData[e.name] = false
                    }
                });
            });
        setSelectedSeries(seriesId);
    }

    // TODO: for some reason, some inputs are added to the formData object by default and others only after the input has changed
    async function saveSpecification(stayOnPage = false) {
        // hard copy form data
        let formDataCopy = { ...formMethods.getValues() }

        // add variables to formData obj that are not in the form
        formDataCopy.ToolSeries = selectedSeries;
        formDataCopy.ToolType = toolType;
        formDataCopy.specName = specName;
        formDataCopy.user_id = parseInt(localStorage.getItem('user_id') || '-1');
        formDataCopy.seriesInputs = seriesInputs;


        // when removing steps, the Steps property does not change length, so we need to cut it down to the amount of steps we have stored
        if (formDataCopy.StepTool) formDataCopy.Steps.length = stepCount;

        await fetch(
            `${apiUrl}/specifications/new`,
            {
                method: "POST",
                cache: "no-cache",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formDataCopy, (key, value) => value === undefined ? 0 : value)
            }
        )
            .then(res => res.json())
            .then(res => {
                if (!stayOnPage) router.push(`/specifications/details?r=${res.specification_id}`);
                else setSaveWindowOpen(false);
                formMethods.trigger();
            })
    }

    async function copyCatalogTool() {
        const result = await fetch(
            `${apiUrl}/catalog/${referenceSpecification?.split('_')[1]}/copy`,
            {
                method: "GET",
                cache: "no-cache"
            }
        )
            .then(res => res.json());
        const { data, defaultValues } = result;
        changeCurrentStep(0, true);
        await fetch(
            `${apiUrl}/series/tool_id/${data.ToolType}`,
            {
                method: 'GET',
                cache: 'no-cache'
            }
        )
            .then(res => res.json())
            .then(res => setSeries(res));
        const res = await fetch(
            `${apiUrl}/tool/${data.ToolType}/inputs`,
            {
                method: 'GET',
                cache: 'no-cache'
            }
        )
            .then(res => res.json());
        setInputCategories(res.toolCategories);

        if (data.StepTool) copySteps(data.Steps);
        enterValues(data);
        setToolType(data.ToolType);
        changeSeries(data.ToolSeries);
        enterDefaultValues(defaultValues);
    }

    async function copyTool() {
        const data = await fetch(
            `${apiUrl}/specification/${referenceSpecification}`,
            {
                method: "GET",
                cache: "no-cache"
            }
        )
            .then(res => res.json())
            .then(res => res.data);
        changeCurrentStep(0, true);
        await fetch(
            `${apiUrl}/series/tool_id/${data.ToolType}`,
            {
                method: 'GET',
                cache: 'no-cache'
            }
        )
            .then(res => res.json())
            .then(res => setSeries(res));
        const res = await fetch(
            `${apiUrl}/tool/${data.ToolType}/inputs`,
            {
                method: 'GET',
                cache: 'no-cache'
            }
        )
            .then(res => res.json());
        setInputCategories(res.toolCategories);
        if (data.StepTool) copySteps(data.Steps);
        enterValues(data);
        copyCenters(data.Center);
        setToolType(data.ToolType);
        changeSeries(data.ToolSeries);
    }

    function enterValues(values: any, category = '') {
        for (const [key, value] of Object.entries(values)) {
            let id = key;
            // if category is not empty, it is a subset (e.g. prp.blablabla)
            if (category !== '') id = `${category}.${id}`;
            // if the value itself is an object, it means it is a separate category, call this function again with that value
            // and the key name as the category
            if (typeof value === 'object') enterValues(value, key);
            formMethods.setValue(id, value);
        }
    }

    function copySteps(steps: Step[]) {
        let stepCount = steps.length;
        formMethods.setValue('StepTool', true);
        setStepCount(stepCount);
        for (let i = 0; i < stepCount; i++) {
            formMethods.setValue(`Steps.${i}.Length`, steps[i].Length);
            formMethods.setValue(`Steps.${i}.Diameter`, steps[i].Diameter);
            formMethods.setValue(`Steps.${i}.Angle`, steps[i].Angle);
            formMethods.setValue(`Steps.${i}.Type`, steps[i].Type);
            formMethods.setValue(`Steps.${i}.RTop`, steps[i].RTop);
            formMethods.setValue(`Steps.${i}.RBottom`, steps[i].RBottom);
        }
    }

    function copyCenters(centerInfo: CenterInfo | undefined) {
        if (centerInfo === undefined || centerInfo === null) return;

        if (centerInfo.LowerCenterType !== '' && centerInfo.LowerCenterType !== undefined) formMethods.setValue('Center.LowerCenterType', centerInfo.LowerCenterType);
        else formMethods.setValue('Center.LowerCenterType', '-1');
        if (centerInfo.UpperCenterType !== '' && centerInfo.UpperCenterType !== undefined) formMethods.setValue('Center.UpperCenterType', centerInfo.UpperCenterType);
        else formMethods.setValue('Center.UpperCenterType', '-1');
    }

    async function changeToolType(e: ToolType) {
        if (e.tool_id === toolType) return
        else if (toolType !== -1) {
            const answer = window.confirm('Changing the tool type will reset all input parameters to their default values. Are you sure?');
            if (!answer) return;
        };
        formMethods.reset();
        changeCurrentStep(0, true);
        const defaultValues = await fetch(
            `${apiUrl}/tool/${e.tool_id}/inputs`,
            {
                method: 'GET',
                cache: 'no-cache'
            }
        )
            .then(res => res.json())
            .then(res => {
                setInputCategories(res.toolCategories);
                return res.defaultValues;
            });
        await fetch(
            `${apiUrl}/series/tool_id/${e.tool_id}`,
            {
                method: 'GET',
                cache: 'no-cache'
            }
        )
            .then(res => res.json())
            .then(res => setSeries(res));
        setToolType(e.tool_id);
        enterDefaultValues(defaultValues);
    }

    function enterDefaultValues(defaultValues: DefaultValue[]) {
        for (let i = 0; i < defaultValues.length; i++) {
            const defaultValue = defaultValues[i];
            let value;
            if (defaultValue.tool_inputs?.type === 'toggle') {
                value = defaultValue.value === 'true';
            } else if (defaultValue.tool_inputs?.type === 'decimal') {
                value = parseFloat(defaultValue.value);
            } else {
                value = defaultValue.value;
            }
            formMethods.setValue(defaultValues[i].tool_inputs?.property_name as string, value);
        }
    }

    const seriesInput = <ToolSeriesInput
        key={-1}
        selectedSeries={selectedSeries}
        changeSeries={changeSeries}
        series={series}
    />

    const upperCenterDropdown = <CenterDropdown type="Upper" centers={centers} key="Upper" />
    const lowerCenterDropdown = <CenterDropdown type="Lower" centers={centers} key="Lower" />

    return (
        <>
            <dialog className={`modal ${saveWindowOpen ? 'modal-open' : ''}`} id="modal">
                <div className="modal-box p-0">
                    <form onSubmit={e => {
                        e.preventDefault();
                        saveSpecification();
                    }}>
                        <div className="w-full h-full p-6">
                            <h1 className="text-lg mb-4">Name your specification</h1>
                            <input
                                type="text"
                                className="input input-bordered w-full"
                                value={specName}
                                onChange={e => setSpecName(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-row w-full h-full justify-between flex-grow">
                            <button className="rounded-none btn w-[50%] btn-primary" type="submit">Create</button>
                            <button className="rounded-none btn w-[50%] btn-accent" onClick={() => saveSpecification(true)} type="button">Create and stay on this page</button>
                        </div>
                    </form>
                </div>


                <form method="dialog" className="modal-backdrop">
                    <button onClick={() => setSaveWindowOpen(false)}></button>
                </form>
            </dialog>
            <div className={`${viewOnly ? 'pointer-events-none' : ''} flex flex-col justify-start items-start w-full`}>
                <FormProvider {...formMethods}>
                    <form className="w-full"
                        onSubmit={e => e.preventDefault()}
                    >
                        <SpecificationStep defaultChecked={false} stepNumber={0} header="Choose Tool Type" enabled={currentStep >= 0} forceOpen={true} arrowEnabled={false}>
                            <div className="w-full flex flex-row justify-between">
                                {tools.map((e: ToolType, i) => {
                                    return (
                                        <button
                                            type="button"
                                            key={i}
                                            className={`btn grow rounded-none first:rounded-bl-xl last:rounded-br-xl ${e.tool_id === toolType ? 'btn-primary' : ''}`}
                                            onClick={() => changeToolType(e)}>
                                            {e.name}
                                        </button>
                                    )
                                })}
                            </div>
                        </SpecificationStep>
                        {
                            inputCategories.map((e: InputCategory, i) => {
                                if (e.name === 'Step') return (
                                    <SpecificationStep
                                        defaultChecked={viewOnly ? true : (i === 0 ? true : false)}
                                        stepNumber={i + 1}
                                        header={e.display_title}
                                        // enabled={currentStep >= (i + 1)}
                                        enabled={true}
                                        key={i + 1}
                                        forceOpen={false}
                                        arrowEnabled={!viewOnly}
                                    >
                                        <StepForm stepCount={stepCount} changeStepCount={changeStepCount} viewOnly={viewOnly} />
                                    </SpecificationStep>
                                )
                                return (
                                    <SpecificationStep
                                        defaultChecked={viewOnly ? true : (i === 0 ? true : false)}
                                        stepNumber={i + 1}
                                        header={e.display_title}
                                        // enabled={currentStep >= (i + 1)}
                                        enabled={true}
                                        key={i + 1}
                                        forceOpen={false}
                                        arrowEnabled={!viewOnly}
                                    >
                                        <SpecificationForm
                                            inputs={e.tool_inputs}
                                            toolSeriesInput={seriesInput}
                                            upperCenterDropdown={upperCenterDropdown}
                                            lowerCenterDropdown={lowerCenterDropdown}
                                            type={e.name || 'General'}
                                        />
                                    </SpecificationStep>
                                )
                            })
                        }
                        {
                            (toolType !== -1 && !viewOnly) ?
                                <SpecificationStep
                                    stepNumber={inputCategories.length + 1}
                                    header="Create Specification"
                                    // enabled={currentStep >= (inputCategories.length + 2)} 
                                    enabled={true}
                                    forceOpen={true}
                                    defaultChecked={viewOnly}
                                    arrowEnabled={false}

                                >
                                    <div className="p-0 flex flex-col items-center">
                                        <button onClick={() => setSaveWindowOpen(true)} type="submit" className="rounded-none btn w-full btn-primary">Create</button>
                                    </div>
                                </SpecificationStep> : ''
                        }
                    </form>
                </FormProvider>
            </div>
        </>
    )
}

export default function SpecificationEdit({ viewOnly = false }: { viewOnly: boolean }) {
    return (
        <Suspense>
            <New viewOnly={viewOnly} />
        </Suspense>
    )
}