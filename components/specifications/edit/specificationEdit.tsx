'use client'

import { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, FormProvider } from 'react-hook-form';
import { apiUrl } from "@/lib/api";
import SpecificationStep from "@/components/specifications/edit/specificationStep";
import SpecificationForm from "@/components/specifications/edit/specificationForm";
import StepForm from "@/components/specifications/edit/stepForm";
import { InputCategory, ToolType, Series, Step, DefaultValue, CenterInfo, CenterType, ToolInputRule } from "@/app/types";
import ToolSeriesInput from "@/components/specifications/edit/toolSeriesInput";
import CenterDropdown from "./centerDropdown";
import SeriesEdit from "./seriesEdit";
import { AlertCircle } from "react-feather";

export default function New({ viewOnly = false }: { viewOnly: boolean }) {
    const [tools, setTools]: [ToolType[], Function] = useState([]);
    const [inputCategories, setInputCategories] = useState([]);
    const [saveWindowOpen, setSaveWindowOpen] = useState(false);
    const [copyWindowOpen, setCopyWindowOpen] = useState(false);
    const [saveWindowWarning, setSaveWindowWarning] = useState(<></>);
    const [specName, setSpecName] = useState('');
    const [selectedSeries, setSelectedSeries] = useState(-1);
    const [series, setSeries]: [Series[], Function] = useState([]);
    const [stepCount, setStepCount] = useState(0);
    const [centers, setCenters] = useState<CenterType[]>([]);
    const [userId, setUserId] = useState<null | string>();
    const [seriesEdited, setSeriesEdited] = useState(false);
    const [loading, setLoading] = useState(true);
    const formMethods = useForm({ mode: 'onChange' });
    const router = useRouter();
    const searchParams = useSearchParams();
    const referenceSpecification = searchParams.get('r');

    const enterDefaultValues = useCallback((defaultValues: DefaultValue[], setCoolant = false) => {
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

            if (setCoolant) formMethods.setValue('Coolant.CoolantHole', true);
        }
    }, [formMethods]);

    const changeSeries = useCallback(async (seriesId: number) => {
        setSelectedSeries(seriesId);
        setSeriesEdited(false);
        if (seriesId === -1) {
            formMethods.setValue('flute_count', undefined);
            formMethods.setValue('helix_angle', undefined);
            formMethods.setValue('straight_flute', undefined);
            formMethods.setValue('left_hand_spiral', undefined);
            return;
        }

        const seriesData: Series = await fetch(
            `${apiUrl}/series/${seriesId}`,
            {
                method: 'GET',
                cache: 'no-cache'
            }
        )
            .then(res => res.json());

        formMethods.setValue('flute_count', seriesData.flute_count);
        formMethods.setValue('helix_angle', seriesData.helix_angle);
        formMethods.setValue('straight_flute', seriesData.straight_flute);
        formMethods.setValue('left_hand_spiral', seriesData.left_hand_spiral);
    }, [formMethods]);

    const checkIfSeriesEdited = useCallback((selectedSeries: Series) => {
        if (selectedSeries === undefined) return;
        const inputIds: (keyof Series)[] = ['flute_count', 'helix_angle', 'left_hand_spiral', 'straight_flute'];
        let values = formMethods.getValues(inputIds);
        let seriesEdited = false;
        for (let i = 0; i < inputIds.length; i++) {
            let value = values[i];

            if (!isNaN(parseInt(value))) value = parseInt(value);

            if (value !== selectedSeries[inputIds[i]]) {
                seriesEdited = true;
                break;
            }
        }
        setSeriesEdited(seriesEdited);
    }, [formMethods]);

    const copySeriesParams = useCallback((body: any) => {
        setSelectedSeries(body.ToolSeries);
        formMethods.setValue('flute_count', body.flute_count);
        formMethods.setValue('helix_angle', body.helix_angle);
        formMethods.setValue('straight_flute', body.straight_flute);
        formMethods.setValue('left_hand_spiral', body.left_hand_spiral);
    }, [formMethods]);

    const validateRules = useCallback((rules: ToolInputRule[], formData: any): [boolean, string] => {
        let disabled = true;
        let additionalClasses = '';
        for (const rule of rules) {
            let dependencyValue1 = formData[rule.tool_dependency_inputs_1.property_name];
            if (rule.tool_dependency_inputs_1.tool_input_categories?.name !== null && rule.tool_dependency_inputs_1.tool_input_categories?.name !== undefined && formData[rule.tool_dependency_inputs_1.tool_input_categories.name] !== undefined)
                dependencyValue1 = formData[rule.tool_dependency_inputs_1.tool_input_categories.name][rule.tool_dependency_inputs_1.property_name];

            let dependencyValue2;
            if (rule.tool_input_dependency_id_2 !== null) {
                dependencyValue2 = formData[rule.tool_dependency_inputs_2.property_name];
                if (rule.tool_dependency_inputs_2.tool_input_categories?.name !== null && rule.tool_dependency_inputs_2.tool_input_categories?.name !== undefined && formData[rule.tool_dependency_inputs_2.tool_input_categories.name] !== undefined)
                    dependencyValue2 = formData[rule.tool_dependency_inputs_2.tool_input_categories.name][rule.tool_dependency_inputs_2.property_name];
            }
            if (dependencyValue1 === '' || dependencyValue2 === '') continue;

            if (!isNaN(dependencyValue2)) dependencyValue2 = Number(dependencyValue2);
            if (!isNaN(dependencyValue1)) dependencyValue1 = Number(dependencyValue1);
            let check = false;

            switch (rule.rule_type) {
                case 'enabled':
                    check = dependencyValue1;
                    break;
                case 'disabled':
                    check = !dependencyValue1;
                    break;
                case 'greater_than':
                    if (rule.tool_input_dependency_id_2 === null) check = dependencyValue1 > rule.check_value;
                    else check = dependencyValue1 > dependencyValue2;
                    break;
                case 'less_than':
                    if (rule.tool_input_dependency_id_2 === null) check = dependencyValue1 < rule.check_value;
                    else check = dependencyValue1 < dependencyValue2;
                    break;
                case 'equal':
                    if (rule.tool_input_dependency_id_2 === null) {
                        if (isNaN(+rule.check_value)) check = dependencyValue1 === rule.check_value;
                        else check = dependencyValue1 === parseFloat(rule.check_value);
                    }
                    else check = dependencyValue1 === dependencyValue2;
                    break;
                case 'not_equal':
                    if (rule.tool_input_dependency_id_2 === null) {
                        if (isNaN(+rule.check_value)) check = dependencyValue1 !== rule.check_value;
                        else check = dependencyValue1 !== parseFloat(rule.check_value);
                    }
                    else check = dependencyValue1 !== dependencyValue2;
                    break;
            }

            disabled = !check;
            additionalClasses = check ? '' : 'opacity-20 pointer-events-none';

            if (check && rule.disable) {
                // if the current rule being check has disabled = true, it takes priority and cancels the loop if the rule is validated
                disabled = true;
                additionalClasses = 'opacity-20 pointer-events-none';
                break;
            }

            if (!rule.disable && !disabled) break; // since we have sorted the array so the disabled rules are first, once a rule is not of type disabled and it has been validated, we can break out of the loop
        }
        return [disabled, additionalClasses]
    }, []);

    useEffect(() => {
        setUserId(localStorage.getItem('user_id'));

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
            formMethods.setValue('ToolType', data.ToolType);
            changeSeries(data.ToolSeries);
            enterDefaultValues(defaultValues);
            enterValues(data);
            removeDisabledValues(res.toolCategories);
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

            const fetchedSeries = await fetch(
                `${apiUrl}/series/tool_id/${data.ToolType}`,
                {
                    method: 'GET',
                    cache: 'no-cache'
                }
            )
                .then(res => res.json());
            setSeries(fetchedSeries);

            const inputs = await fetch(
                `${apiUrl}/tool/${data.ToolType}/inputs`,
                {
                    method: 'GET',
                    cache: 'no-cache'
                }
            )
                .then(res => res.json());
            setInputCategories(inputs.toolCategories);
            if (data.StepTool) copySteps(data.Steps);
            copyCenters(data.Center);
            formMethods.setValue('ToolType', data.ToolType);
            copySeriesParams(data);
            enterValues(data);
            removeDisabledValues(inputs.toolCategories);
            checkIfSeriesEdited(fetchedSeries.find((e: Series) => e.series_id === data.ToolSeries) as Series);
        }

        function removeDisabledValues(categories: InputCategory[]) {
            const formData = formMethods.getValues();
            for (let cat = 0; cat < categories.length; cat++) {
                const category: InputCategory = categories[cat];
                const type = category.name || 'General';
                const inputs = category.tool_inputs;
                for (let i = 0; i < inputs.length; i++) {
                    const input = inputs[i];
                    let rules = input.tool_input_rules as ToolInputRule[];

                    if (formMethods.getValues('ToolType') === 1 && type === 'Coolant' && input.property_name !== 'CoolantHole' && !formData['straight_flute']) {
                        let registerId = `${type}.${input.property_name}`;
                        formMethods.setValue(registerId, undefined);
                    } else if (rules.length > 0) {
                        let registerId = input.property_name;
                        if (type !== 'General') registerId = `${type}.${registerId}`;
                        const [disabled, _] = validateRules(rules, formData);
                        if (disabled) formMethods.setValue(registerId, undefined);
                    }
                }
            }
        }

        function enterValues(values: any, category = '') {
            // For catalog tools, the tool number input is in the prp section, so we try to set it
            if (values._tool !== undefined) formMethods.setValue('Prp.PartNumber', values._tool);

            for (const [key, value] of Object.entries(values)) {
                let id = key;
                // if category is not empty, it is a subset (e.g. prp.blablabla)
                if (category !== '') id = `${category}.${id}`;
                // if the value itself is an object, it means it is a separate category, call this function again with that value
                // and the key name as the category
                if (typeof value === 'object' && value !== null) enterValues(value, key);
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
                formMethods.setValue(`Steps.${i}.FrontMargin`, steps[i].FrontMargin);
                formMethods.setValue(`Steps.${i}.MiddleMargin`, steps[i].MiddleMargin);
                formMethods.setValue(`Steps.${i}.RearMargin`, steps[i].RearMargin);
            }
        }

        function copyCenters(centerInfo: CenterInfo | undefined) {
            if (centerInfo === undefined || centerInfo === null) return;

            if (centerInfo.LowerCenterType !== '' && centerInfo.LowerCenterType !== undefined) formMethods.setValue('Center.LowerCenterType', centerInfo.LowerCenterType);
            else formMethods.setValue('Center.LowerCenterType', '-1');
            if (centerInfo.UpperCenterType !== '' && centerInfo.UpperCenterType !== undefined) formMethods.setValue('Center.UpperCenterType', centerInfo.UpperCenterType);
            else formMethods.setValue('Center.UpperCenterType', '-1');
        }

        async function initialize() {
            formMethods.setValue('ToolType', -1);
            await fetch(
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
            await fetch(
                `${apiUrl}/centers?nameOnly=true`,
                {
                    method: "GET",
                    cache: "no-cache"
                }
            )
                .then(res => res.json())
                .then(res => setCenters(res));
            setLoading(false);
        }

        initialize();
    }, [referenceSpecification, formMethods, enterDefaultValues, userId, validateRules, changeSeries, copySeriesParams, checkIfSeriesEdited]);

    function changeStepCount(increase: boolean) {
        if (!increase && stepCount === 0) return;
        setStepCount(stepCount + (increase ? 1 : -1));
    }

    // TODO: for some reason, some inputs are added to the formData object by default and others only after the input has changed
    async function saveSpecification(stayOnPage = false) {
        // hard copy form data
        let formDataCopy = { ...formMethods.getValues() }

        // add variables to formData obj that are not in the form
        formDataCopy.ToolSeries = selectedSeries;
        formDataCopy.specName = specName;
        formDataCopy.user_id = parseInt(userId as string);

        // when removing steps, the Steps property does not change length, so we need to cut it down to the amount of steps we have stored
        if (formDataCopy.StepTool) formDataCopy.Steps.length = stepCount;

        // straight flute is always present, set it to false for ems
        if (formDataCopy.ToolType === 0) formDataCopy.straight_flute = false;

        // for blanks, set both params to false
        if (formDataCopy.ToolType === 2) {
            formDataCopy.straight_flute = false;
            formDataCopy.left_hand_spiral = false;
        }

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
            });
    }

    async function changeToolType(e: ToolType) {
        let switchingFromBlank = false;
        if (e.tool_id === formMethods.getValues('ToolType')) return
        else if (formMethods.getValues('ToolType') === -1) {
            formMethods.reset();
        }
        else if (formMethods.getValues('ToolType') === 2) {
            // if toolType = 2, user is switching from blank. So retain form values and don't show confirm window
            switchingFromBlank = true;
        }
        else {
            const answer = window.confirm('Changing the tool type will reset all input parameters to their default values. Are you sure?');
            if (!answer) return;
            formMethods.reset();
        };

        changeSeries(-1);
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
        // setToolType(e.tool_id);
        formMethods.setValue('ToolType', e.tool_id);
        enterDefaultValues(defaultValues, switchingFromBlank);
    }

    function goToError() {
        const error = formMethods.formState.errors[Object.keys(formMethods.formState.errors)[0]] as any;
        const id = error.ref.id;

        const stepNumber = parseInt(id.split('|')[0]);

        const categoryCheckbox = document.querySelector(`input[id="${stepNumber}"]`) as any;
        if (!categoryCheckbox.checked) categoryCheckbox.click();

        const inputElement = document.getElementById(id);

        setSaveWindowOpen(false);

        inputElement?.scrollIntoView({
            block: 'center',
            inline: 'nearest',
            behavior: 'smooth'
        });
    }

    const seriesInput = <ToolSeriesInput
        key={-1}
        selectedSeries={selectedSeries}
        changeSeries={changeSeries}
        series={series}
        seriesEdited={seriesEdited}
    />

    const upperCenterDropdown = <CenterDropdown type="Upper" centers={centers} key="Upper" />
    const lowerCenterDropdown = <CenterDropdown type="Lower" centers={centers} key="Lower" />

    if (loading) return <>Loading...</>

    if ((userId === null || userId === undefined) && !viewOnly) return (
        <>
            Please select a user before creating a specification
        </>
    )

    return (
        <>
            <dialog className={`modal ${saveWindowOpen && 'modal-open'}`} id="modal">
                <div className="modal-box p-0">
                    <form onSubmit={e => {
                        e.preventDefault();
                        saveSpecification();
                    }}>
                        <div className="w-full h-full p-6 flex flex-col">
                            {saveWindowWarning}
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

            <dialog className={`modal ${copyWindowOpen && 'modal-open'}`} id="modal">
                <div className="modal-box p-0">
                    <div className="w-full h-full flex flex-col justify-start items-center">
                        <div className="p-6">
                            Do you want to copy this specification?
                        </div>
                        <div className="flex flex-row justify-between items-center flex-grow w-full">
                            <a className="rounded-none btn w-[50%] btn-primary" href={`/specifications/new?r=${referenceSpecification}`}>Yes</a>
                            <button className="rounded-none btn w-[50%] btn-accent" onClick={() => setCopyWindowOpen(false)} type="button">No</button>
                        </div>
                    </div>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button onClick={() => setCopyWindowOpen(false)}></button>
                </form>
            </dialog>

            <div className={`flex flex-col justify-start items-start w-full ${viewOnly && 'cursor-pointer'}`} onClick={() => {
                if (!viewOnly) return;
                setCopyWindowOpen(true);
            }}>
                <FormProvider {...formMethods}>
                    <form className={`${viewOnly && 'pointer-events-none'} w-full`}
                        onSubmit={e => e.preventDefault()}
                    >
                        <SpecificationStep defaultChecked={false} enabled={true} stepNumber={0} header="Choose Tool Type" forceOpen={true} arrowEnabled={false}>
                            <div className="w-full flex flex-row justify-between">
                                {tools.map((e: ToolType, i) => {
                                    return (
                                        <button
                                            type="button"
                                            key={i}
                                            className={`btn grow rounded-none first:rounded-bl-xl last:rounded-br-xl ${e.tool_id === formMethods.getValues('ToolType') && 'btn-primary'}`}
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
                                        defaultChecked={viewOnly ? true : (i === 0)}
                                        stepNumber={i + 1}
                                        header={e.display_title}
                                        enabled={true}
                                        key={i + 1}
                                        forceOpen={false}
                                        arrowEnabled={!viewOnly}
                                    >
                                        <StepForm
                                            stepCount={stepCount}
                                            changeStepCount={changeStepCount}
                                            viewOnly={viewOnly}
                                            toolType={tools.find(e => e.tool_id === formMethods.getValues('ToolType')) as ToolType}
                                        />
                                    </SpecificationStep>
                                )

                                if (e.name === 'Fluting') return (
                                    <SpecificationStep
                                        defaultChecked={viewOnly ? true : (i === 0)}
                                        stepNumber={i + 1}
                                        header={e.display_title}
                                        enabled={true}
                                        key={i + 1}
                                        forceOpen={false}
                                        arrowEnabled={!viewOnly}
                                    >
                                        <SeriesEdit
                                            toolSeriesInput={seriesInput}
                                            toolType={tools.find(e => e.tool_id === formMethods.getValues('ToolType')) as ToolType}
                                            selectedSeries={series.find(e => e.series_id === selectedSeries) as Series}
                                            submitMode={saveWindowOpen}
                                            checkIfSeriesEdited={checkIfSeriesEdited}
                                            stepNumber={i + 1}
                                        />
                                    </SpecificationStep>
                                )

                                return (
                                    <SpecificationStep
                                        defaultChecked={viewOnly ? true : (i === 0)}
                                        stepNumber={i + 1}
                                        header={e.display_title}
                                        enabled={true}
                                        key={i + 1}
                                        forceOpen={false}
                                        arrowEnabled={!viewOnly}
                                    >
                                        <SpecificationForm
                                            inputs={e.tool_inputs}
                                            upperCenterDropdown={upperCenterDropdown}
                                            lowerCenterDropdown={lowerCenterDropdown}
                                            type={e.name || 'General'}
                                            submitMode={saveWindowOpen}
                                            validateRules={validateRules}
                                            stepNumber={i + 1}
                                            toolType={formMethods.getValues('ToolType')}
                                        />
                                    </SpecificationStep>
                                )
                            })
                        }
                        {
                            (formMethods.getValues('ToolType') !== -1 && !viewOnly) &&
                            <SpecificationStep
                                stepNumber={inputCategories.length + 1}
                                header="Create Specification"
                                enabled={true}
                                forceOpen={true}
                                defaultChecked={viewOnly}
                                arrowEnabled={false}
                            >
                                <div className="p-0 flex flex-col items-center">
                                    <button onClick={async () => {
                                        await formMethods.trigger();
                                        if (!formMethods.formState.isValid) {
                                            setSaveWindowWarning(
                                                <div className="flex flex-row justify-start items-center">
                                                    <AlertCircle className="mr-2 w-1/6" />
                                                    <span>
                                                        The form is incomplete. Not completing the form might result in an incorrect model and/or drawing. <button type="button" onClick={() => goToError()} className="underline">Go to error</button>
                                                    </span>
                                                </div>
                                            );
                                        } else setSaveWindowWarning(<></>);
                                        setSaveWindowOpen(true);
                                    }} type="submit" className="rounded-none btn w-full btn-primary">Create</button>
                                </div>
                            </SpecificationStep>
                        }
                    </form>
                </FormProvider>
            </div>
        </>
    )
}