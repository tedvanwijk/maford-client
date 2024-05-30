'use client'

import { useEffect, useState, FormEvent, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, FormProvider } from 'react-hook-form';
import { apiUrl } from "@/lib/api";
import SpecificationStep from "@/components/specificationStep";
import SpecificationForm from "@/components/specificationForm";
import { ToolInput, InputCategory, ToolInputRule, ToolType, CommonToolInput, SeriesInput, Series } from "@/app/types";
import SeriesForm from "@/components/seriesForm";
import ToolSeriesInput from "@/components/toolSeriesInput";

export default function New() {
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
    const formMethods = useForm();
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
            .then(res => setTools(res));
        fetch(
            `${apiUrl}/series`,
            {
                method: 'GET',
                cache: 'no-cache'
            }
        )
            .then(res => res.json())
            .then(res => setSeries(res));
        if (referenceSpecification !== null) {
            fetch(
                `${apiUrl}/specification/${referenceSpecification}`,
                {
                    method: "GET",
                    cache: "no-cache"
                }
            )
                .then(res => res.json())
                .then(res => {
                    // TODO: incorporate tool type selection in db data
                    // await changeToolType({tool_id: 0, name: 'End Mill'});
                    // let copiedFormData = JSON.parse(res.data);
                    copyTool(JSON.parse(res.data))
                });
        }
    }, []);

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
                            formData[e.property_name] = false
                    }
                });
                setSeriesFormData(formData);
                setSeriesInputsShown(seriesInputsShown);
            });
        setSelectedSeries(seriesId);
    }

    // TODO: for some reason, some inputs are added to the formData object by default and others only after the input has changed
    async function saveSpecification(stayOnPage=false) {
        for (const [key, value] of Object.entries(formData)) {
            if (isNaN(+key)) continue;
            const inputProperty = inputs.filter((e: ToolInput) => e.tool_input_id === parseInt(key))[0].property_name;
            formData[inputProperty] = value;
            delete formData[key];
        }

        // formData.ToolSeries = series.find((e: Series) => e.series_id === selectedSeries)?.name;
        formData.ToolSeries = selectedSeries;
        // TODO: custom LOC and bodylength implementation
        formData.LOF = formData.LOC;
        formData.BodyLength = formData.LOC;
        // formData.ToolType = tools.find((e: ToolType) => e.tool_id === toolType)?.name;
        formData.ToolType = toolType;
        formData.specName = specName;
        formData.user_id = parseInt(localStorage.getItem('user_id') || '-1');

        // set tolerance sheet form data as 1 input
        let seriesInputArray: any[] = [];
        seriesInputs?.forEach((e: SeriesInput) => {
            switch (e.type) {
                case 'var':
                    let value = formData[e.property_name];
                    if (value !== undefined)
                        if (value.toString().startsWith('.') || value.toString().startsWith(',')) value = `0${value}`
                    seriesInputArray.push(value);
                    break;
                case 'cst':
                    seriesInputArray.push(e.value);
                    break;
                default:
                    seriesInputArray.push(seriesFormData[e.property_name])
            }
        });
        formData.ToolSeriesInputs = seriesInputArray;

        await fetch(
            `${apiUrl}/specifications/new`,
            {
                method: "POST",
                cache: "no-cache",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            }
        )
            .then(res => res.json())
            .then(res => {
                if (!stayOnPage) router.push(`/specifications/details/${res.specification_id}`);
                else setSaveWindowOpen(false);
            })
    }

    async function copyTool(data: { [k: string]: any }) {
        changeCurrentStep(0, true);
        fetch(
            `${apiUrl}/tool/${data.ToolType}/inputs`,
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
                // console.log(data)
                setFormData(data)
            });
        setToolType(data.ToolType);
        changeSeries(data.ToolSeries);
    }

    async function changeToolType(e: ToolType) {
        if (e.tool_id === toolType) return
        else if (toolType !== -1) {
            const answer = window.confirm('Changing the tool type will reset all input parameters to their default values. Are you sure?');
            if (!answer) return;
        };
        changeCurrentStep(0, true);
        fetch(
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
            });
        setToolType(e.tool_id);
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
        <Suspense>

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


            {/* <div className={`bg-black opacity-70 ${saveWindowOpen ? 'absolute' : 'hidden'} top-0 left-0 z-50 w-screen h-screen flex justify-center items-center`}>
            <div className="card bg-base-200 absolute z-50">
                test
            </div>
        </div> */}


            {/* <h1 className="font-bold text-xl">New Specification</h1> */}
            <div className="flex flex-col justify-start items-start w-full">
                <FormProvider {...formMethods}>
                    <form className="w-full"
                        onSubmit={formMethods.handleSubmit(handleFormSubmit)}
                        onChange={handleFormChange}
                    >
                        <SpecificationStep defaultChecked={false} stepNumber={0} header="Choose Tool Type" enabled={currentStep >= 0} forceOpen={true}>
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
                                return (
                                    <SpecificationStep
                                        defaultChecked={i === 0}
                                        stepNumber={i + 1}
                                        header={e.display_title}
                                        // enabled={currentStep >= (i + 1)}
                                        enabled={true}
                                        key={i + 1}
                                        forceOpen={false}
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
                                    {/* <SpecificationStep
                                        stepNumber={inputCategories.length + 1}
                                        header="Specify Tool Series Data"
                                        enabled={true}
                                        forceOpen={false}
                                        defaultChecked={false}
                                    >
                                        <SeriesForm
                                            formData={seriesFormData}
                                            setFormData={setSeriesFormData}
                                            seriesInputs={seriesInputs}
                                            setSeriesInputs={setSeriesInputs}
                                            selectedSeries={selectedSeries}
                                            setSelectedSeries={setSelectedSeries}
                                            seriesInputsShown={seriesInputsShown}
                                            setSeriesInputsShown={setSeriesInputsShown}
                                            changeSeries={changeSeries}
                                            series={series}
                                            setSeries={setSeries}
                                        />
                                    </SpecificationStep> */}
                                    <SpecificationStep
                                        stepNumber={inputCategories.length + 1}
                                        header="Enter Sheet Data"
                                        // enabled={currentStep >= (inputCategories.length + 1)} 
                                        enabled={true}
                                        forceOpen={false}
                                        defaultChecked={false}
                                    >
                                        <SpecificationForm
                                            common={true}
                                            inputs={commonInputs.filter((e: CommonToolInput) => e.category_name === 'prp')}
                                            inputRules={[]}
                                            formData={formData}
                                        />
                                    </SpecificationStep>
                                    <SpecificationStep
                                        stepNumber={inputCategories.length + 2}
                                        header="Create Specification"
                                        // enabled={currentStep >= (inputCategories.length + 2)} 
                                        enabled={true}
                                        forceOpen={true}
                                        defaultChecked={false}
                                    >
                                        <div className="p-0 flex flex-col items-center">
                                            <button onClick={() => setSaveWindowOpen(true)} type="submit" className="rounded-none btn w-full btn-primary">Create</button>
                                        </div>
                                    </SpecificationStep>
                                </>
                        }
                        {/* <button onClick={saveSpecification} type="submit">test</button> */}
                    </form>
                </FormProvider>
            </div>
        </Suspense>
    )
}