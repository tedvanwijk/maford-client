'use client'

import { useEffect, useState, FormEvent, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, FormProvider } from 'react-hook-form';
import { apiUrl } from "@/lib/api";
import SpecificationStep from "@/components/specificationStep";
import SpecificationForm from "@/components/specificationForm";
import StepForm from "@/components/stepForm";
import { ToolInput, InputCategory, ToolInputRule, ToolType, CommonToolInput, SeriesInput, Series, Step, DefaultValue } from "@/app/types";
import SeriesForm from "@/components/seriesForm";
import ToolSeriesInput from "@/components/toolSeriesInput";

function New({ viewOnly = false }: { viewOnly: boolean }) {
    // TODO: remove all tool series input stuff. Only the tool series needs to be selected, but no custom inputs need to be generated
    const [tools, setTools]: [ToolType[], Function] = useState([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [toolType, setToolType] = useState(-1);
    const [inputCategories, setInputCategories] = useState([]);
    const [inputs, setInputs]: [ToolInput[], Function] = useState([]);
    const [commonInputs, setCommonInputs] = useState([]);
    const [inputRules, setInputRules] = useState([]);
    const [formData, setFormData]: [{ [k: string]: any }, Function] = useState({});
    const [saveWindowOpen, setSaveWindowOpen] = useState(false);
    const [specName, setSpecName] = useState('');
    const [seriesFormData, setSeriesFormData]: [{ [k: string]: any }, Function] = useState({});
    const [seriesInputs, setSeriesInputs] = useState<SeriesInput[] | null>(null);
    const [selectedSeries, setSelectedSeries] = useState(-1);
    const [seriesInputsShown, setSeriesInputsShown] = useState<SeriesInput[] | null>(null);
    const [series, setSeries]: [Series[], Function] = useState([]);
    const [stepCount, setStepCount] = useState(0);
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

    function handleFormSubmit(data: object) {
        // const formData = new FormData(e.currentTarget);
        // setFormData(formData);
    }

    function handleFormChange(e: FormEvent<HTMLFormElement>) {
        setFormData(formMethods.getValues())
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
                setSeriesInputs(res);
                const seriesInputsShown = res.filter((e: SeriesInput) => e.type === 'toggle');
                let formData: { [k: string]: any } = {};
                seriesInputsShown.forEach((e: SeriesInput) => {
                    switch (e.type) {
                        case 'toggle':
                            formData[e.name] = false
                    }
                });
                setSeriesFormData(formData);
                setSeriesInputsShown(seriesInputsShown);
            });
        setSelectedSeries(seriesId);
    }

    // TODO: for some reason, some inputs are added to the formData object by default and others only after the input has changed
    async function saveSpecification(stayOnPage = false) {
        let formDataCopy = { ...formMethods.getValues() }
        for (const [key, value] of Object.entries(formDataCopy)) {
            if (isNaN(+key)) continue;
            const inputProperty = inputs.filter((e: ToolInput) => e.tool_input_id === parseInt(key))[0].property_name;
            // form-handler gives a value of undefined when an input is disabled. We set it to 0 so the controller does not give an error and the tolerance sheets work properly
            formDataCopy[inputProperty] = value === undefined ? 0 : value;
            delete formDataCopy[key];
        }

        // formData.ToolSeries = series.find((e: Series) => e.series_id === selectedSeries)?.name;
        formDataCopy.ToolSeries = selectedSeries;

        if (toolType === 0) {
            // End mill
            formDataCopy.LOF = formDataCopy.LOC;
        } else if (toolType === 1) {
            // Drill
            formDataCopy.LOC = formDataCopy.LOF;
        }

        formDataCopy.ToolType = toolType;
        formDataCopy.specName = specName;
        formDataCopy.user_id = parseInt(localStorage.getItem('user_id') || '-1');

        // set tolerance sheet form data as 1 input
        let seriesInputArray: any[] = [];
        seriesInputs?.forEach((e: SeriesInput) => {
            let value;
            switch (e.type) {
                case 'var':
                    value = formDataCopy[e.name];
                    if (value !== undefined) {
                        if (value.toString().startsWith('.') || value.toString().startsWith(',')) value = `0${value}`
                    }
                    seriesInputArray.push(value);
                    break;
                case 'cst':
                    seriesInputArray.push(e.value);
                    break;
                case 'toggle':
                    value = formDataCopy[e.name];
                    // if the toggle is set to true, we push the string in the value column, otherwise just an empty string
                    if (value !== undefined) value ? seriesInputArray.push(e.value) : seriesInputArray.push('');
                    break;
                default:
                    seriesInputArray.push(formDataCopy[e.name])
            }
        });
        formDataCopy.ToolSeriesInputs = seriesInputArray;

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
                body: JSON.stringify(formDataCopy)
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
        setInputs(res.toolInputs);
        setInputCategories(res.toolCategories);
        setInputRules(res.toolInputRules);
        setCommonInputs(res.commonToolInputs);

        // tool inputs are registered by id (except common inputs) so the returned object needs to have all property names converted to ids
        // For this reason, the data object needs to be manipulated, so we copy it so we can use the unmodified version later

        const unmodifiedData = { ...data };

        if (data.StepTool) copySteps(data.Steps);
        for (const [key, value] of Object.entries(data)) {
            const inputProperties = res.toolInputs.filter((e: ToolInput) => e.property_name === key);
            const commonInputProperties = res.commonToolInputs.filter((e: ToolInput) => e.property_name === key);
            if (inputProperties.length === 0 && commonInputProperties.length === 0) {
                delete data[key];
                continue;
            } else if (inputProperties.length === 0) {
                formMethods.setValue(commonInputProperties[0].property_name, value);
            } else {
                formMethods.setValue(inputProperties[0].tool_input_id.toString(), value);
                data[inputProperties[0].tool_input_id.toString()] = value;
                delete data[key];
            }
        }
        setFormData(data);
        formMethods.trigger()
        setToolType(unmodifiedData.ToolType);
        changeSeries(unmodifiedData.ToolSeries);
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
        setInputs(res.toolInputs);
        setInputCategories(res.toolCategories);
        setInputRules(res.toolInputRules);
        setCommonInputs(res.commonToolInputs);

        // tool inputs are registered by id (except common inputs) so the returned object needs to have all property names converted to ids
        // For this reason, the data object needs to be manipulated, so we copy it so we can use the unmodified version later

        const unmodifiedData = { ...data };

        if (data.StepTool) copySteps(data.Steps);
        for (const [key, value] of Object.entries(data)) {
            const inputProperties = res.toolInputs.filter((e: ToolInput) => e.property_name === key);
            const commonInputProperties = res.commonToolInputs.filter((e: ToolInput) => e.property_name === key);
            if (inputProperties.length === 0 && commonInputProperties.length === 0) {
                delete data[key];
                continue;
            } else if (inputProperties.length === 0) {
                formMethods.setValue(commonInputProperties[0].property_name, value);
            } else {
                formMethods.setValue(inputProperties[0].tool_input_id.toString(), value);
                data[inputProperties[0].tool_input_id.toString()] = value;
                delete data[key];
            }
        }
        setFormData(data);
        formMethods.trigger()
        setToolType(unmodifiedData.ToolType);
        changeSeries(unmodifiedData.ToolSeries);
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

    async function changeToolType(e: ToolType) {
        if (e.tool_id === toolType) return
        else if (toolType !== -1) {
            const answer = window.confirm('Changing the tool type will reset all input parameters to their default values. Are you sure?');
            if (!answer) return;
        };
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
                setInputs(res.toolInputs);
                setInputCategories(res.toolCategories);
                setInputRules(res.toolInputRules);
                setCommonInputs(res.commonToolInputs);
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
            formMethods.setValue(defaultValues[i].tool_input_id.toString(), value);
        }
        // TODO: when this entire garbage page has been moved over from formData to formMethods.getValues(), this can be removed
        setFormData(formMethods.getValues())
    }

    const seriesInput = <ToolSeriesInput
        key={-1}
        formData={seriesFormData}
        setFormData={setSeriesFormData}
        selectedSeries={selectedSeries}
        seriesInputsShown={seriesInputsShown}
        changeSeries={changeSeries}
        series={series}
    />

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
                        onSubmit={formMethods.handleSubmit(handleFormSubmit)}
                        onChange={handleFormChange}
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
                                const categoryInputs = inputs.filter((input: ToolInput) => input.tool_id === e.tool_id && input.tool_input_category_id === e.tool_input_category_id);
                                if (e.name === 'step') return (
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
                                            inputs={categoryInputs}
                                            inputRules={inputRules.filter((inputRule: ToolInputRule) => categoryInputs.some((input: ToolInput) => input.tool_input_id === inputRule.tool_input_id))}
                                            formData={formData}
                                            common={false}
                                            toolSeriesInput={seriesInput}
                                        />
                                    </SpecificationStep>
                                )
                            })
                        }
                        {
                            toolType === -1 ?
                                '' :
                                <>
                                    <SpecificationStep
                                        stepNumber={inputCategories.length + 1}
                                        header="Enter Sheet Data"
                                        // enabled={currentStep >= (inputCategories.length + 1)} 
                                        enabled={true}
                                        forceOpen={false}
                                        defaultChecked={viewOnly}
                                        arrowEnabled={!viewOnly}
                                    >
                                        <SpecificationForm
                                            common={true}
                                            inputs={commonInputs.filter((e: CommonToolInput) => e.category_name === 'prp')}
                                            inputRules={[]}
                                            formData={formData}
                                        />
                                    </SpecificationStep>
                                    {
                                        viewOnly ?
                                            '' :
                                            <SpecificationStep
                                                stepNumber={inputCategories.length + 2}
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
                                            </SpecificationStep>
                                    }
                                </>
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