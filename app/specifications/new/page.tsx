'use client'

import { useEffect, useState, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, FormProvider } from 'react-hook-form';
import { apiUrl } from "@/lib/api";
import SpecificationStep from "@/components/specificationStep";
import SpecificationForm from "@/components/specificationForm";
import { ToolInput, InputCategory, ToolInputRule, ToolType, CommonToolInput } from "@/app/types";

export default function New() {
    const [tools, setTools] = useState([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [toolType, setToolType] = useState(-1);
    const [inputCategories, setInputCategories] = useState([]);
    const [inputs, setInputs]: [ToolInput[], Function] = useState([]);
    const [commonInputs, setCommonInputs] = useState([]);
    const [inputRules, setInputRules] = useState([]);
    const [formData, setFormData]: [{ [k: string]: any }, Function] = useState({});
    const [saveWindowOpen, setSaveWindowOpen] = useState(false);
    const [specName, setSpecName] = useState('');
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
                    copyTool(0, JSON.parse(res.data))
                });
        }
    }, []);

    function changeCurrentStep(stepEdited: number, reset = false) {
        if (reset) setCurrentStep(stepEdited + 1);
        else {
            if (currentStep <= stepEdited) setCurrentStep(stepEdited + 1);
        }
    }

    // TODO: add some form of warning if required fields have not been filled out
    // function collectFormData(newFormData: FormData, stepNumber: number) {
    //     let formComplete = true;
    //     for (const pair of newFormData.entries()) {
    //         const toolInput = inputs.filter(e => e.tool_input_id === parseInt(pair[0]))[0];
    //         if (toolInput.required && pair[1] === '') {
    //             formComplete = false;
    //         }
    //         if (formData.get(pair[0]) !== null) formData.append(pair[0], pair[1]);
    //         else formData.set(pair[0], pair[1]);
    //     }
    //     if (formComplete) changeCurrentStep(stepNumber, false);
    //     else changeCurrentStep(stepNumber - 1, true);
    // }

    function handleFormSubmit(data: object) {
        // const formData = new FormData(e.currentTarget);
        // setFormData(formData);
    }

    function handleFormChange(e: FormEvent<HTMLFormElement>) {
        setFormData(formMethods.getValues())
    }

    // TODO: for some reason, some inputs are added to the formData object by default and others only after the input has changed
    async function saveSpecification() {
        for (const [key, value] of Object.entries(formData)) {
            if (isNaN(+key)) continue;
            const inputProperty = inputs.filter((e: ToolInput) => e.tool_input_id === parseInt(key))[0].property_name;
            formData[inputProperty] = value;
            delete formData[key];
        }

        // TODO: implement flute series (and other currently manually added parameters below)
        formData.ToolSeries = 'XV5CB';
        formData.LOF = formData.LOC;
        formData.BodyLength = formData.LOC;
        formData.ToolType = 'End Mill';
        formData.specName = specName;
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
            .then(res => router.push(`/specifications/details/${res.specification_id}`))
    }

    async function copyTool(toolId: number, data: { [k: string]: any }) {
        changeCurrentStep(0, true);
        fetch(
            `${apiUrl}/tool/${toolId}/inputs`,
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
        setToolType(toolId);
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

    return (
        <div className="px-5 py-8 text-neutral w-full">
            <dialog className={`modal ${saveWindowOpen ? 'modal-open' : ''}`} id="modal">
                <div className="modal-box p-0">
                    <div className="w-full h-full p-6">
                        <h1 className="text-lg mb-4">Name your specification</h1>
                        <input
                            type="text"
                            className="input input-bordered w-full"
                            value={specName}
                            onChange={e => setSpecName(e.target.value)}
                        />
                    </div>

                    <button className="rounded-none btn w-full btn-primary" onClick={saveSpecification}>Create</button>
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
                                        />
                                    </SpecificationStep>
                                )
                            })
                        }
                        {
                            toolType === -1 ?
                                '' :
                                <>
                                    {/* TODO: common tool inputs have their own table, so their own starting indices, which creates errors when changing inputs as they are tracked by id */}
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
        </div>
    )
}