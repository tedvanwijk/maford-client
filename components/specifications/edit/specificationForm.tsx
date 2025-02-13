import { useFormContext } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';

import { ToolInput, ToolInputRule } from "@/app/types";
import { useEffect, useRef } from 'react';
import FileTypes from './fileTypes';
import CustomDrawingTypeInput from './customDrawingTypeInput';

export default function SpecificationForm(
    {
        inputs,
        upperCenterDropdown,
        lowerCenterDropdown,
        type = 'General',
        submitMode,
        validateRules,
        stepNumber,
        toolType
    }: {
        inputs: ToolInput[],
        upperCenterDropdown: React.ReactNode
        lowerCenterDropdown: React.ReactNode
        type?: string,
        submitMode: boolean,
        validateRules: Function,
        stepNumber: number,
        toolType: number
    }
) {
    const { register, watch, getValues, formState } = useFormContext();

    useEffect(() => {
        // after initial render, loop through all inputs and validate. If not valid, set value to undefined
        const formData = getValues();
        for (let i = 0; i < inputs.length; i++) {
            const input = inputs[i];
            let rules = input.tool_input_rules as ToolInputRule[];

            if (rules.length > 0) {
                let registerId = input.property_name;
                if (type !== 'General') registerId = `${type}.${registerId}`;
                validateRules(rules, formData, true, registerId);
            }
        }
    }, [getValues, inputs, type, validateRules]);

    function generateGroup(inputs: ToolInput[]) {
        const formData = watch();
        const errors = formState.errors;
        let groupElements: React.ReactNode[] = [];
        for (let i = 0; i < inputs.length; i++) {
            const input = inputs[i];

            let coolantAngleInput = false;
            let coolantAlongFluting;
            if (input.property_name === 'CoolantPatternAngle') {
                coolantAngleInput = true;
                coolantAlongFluting = watch('Coolant.CoolantPatternAlongFluting');
            }

            if (input.property_name === 'UpperCenterType') {
                groupElements.push(upperCenterDropdown);
                continue
            }

            if (input.property_name === 'LowerCenterType') {
                groupElements.push(lowerCenterDropdown);
                continue
            }

            let rules = input.tool_input_rules as ToolInputRule[];
            let disabled = false;
            let additionalClasses = '';

            // If the tool type is drill and the fluting is helical, the coolant inputs should be disabled
            if (toolType === 1 && type === 'Coolant' && input.property_name !== 'CoolantHole' && !getValues('straight_flute')) {
                disabled = true;
                additionalClasses = 'opacity-20 pointer-events-none';
            } else if (rules.length > 0) [disabled, additionalClasses] = validateRules(rules, formData);

            // if not submitting, don't actually disable inputs so the values can still be retrieved
            // this way, if a rule depends on an initially disabled input, it will still evaluate correctly
            // disable the inputs using opacity and pointer events in this situation
            // when submitting, actually disable inputs so that the retrieved values for disabled
            // inputs are undefined
            let realDisabled = disabled;
            const tabIndex = disabled ? -1 : 0;
            if (!submitMode) disabled = false;

            let inputElement: React.ReactNode;
            let registerId = input.property_name;
            if (type !== 'General') registerId = `${type}.${registerId}`;

            const minValInDb = input.min_value !== null;
            const maxValInDb = input.max_value !== null;
            let registerOptions: any = {
                disabled,
                required: (!realDisabled && input.type !== 'toggle' && input.type !== 'radio') ? 'Required' : false
            };
            if (minValInDb) registerOptions.min = {
                value: input.min_value,
                message: 'Value too low'
            };
            if (maxValInDb) registerOptions.max = {
                value: input.max_value,
                message: 'Value too high'
            };

            const id = `${stepNumber}|${input.tool_input_id}`;

            switch (input.type) {
                case 'decimal':
                    inputElement = <input
                        {...register(registerId, { ...registerOptions, valueAsNumber: true })}
                        type="number"
                        placeholder="Enter value"
                        step="any"
                        className="input input-bordered w-full"
                        lang="en-US"
                        tabIndex={tabIndex}
                        id={id}
                    />
                    additionalClasses += ' min-h-[88px]';
                    break;
                case 'int':
                    inputElement = <input
                        {...register(registerId, { ...registerOptions, valueAsNumber: true })}
                        type="number"
                        placeholder="Enter value"
                        step="1"
                        className="input input-bordered w-full"
                        lang="en-US"
                        tabIndex={tabIndex}
                        id={id}
                    />
                    additionalClasses += ' min-h-[88px]';
                    break;
                case 'toggle':
                    inputElement = <input
                        {...register(registerId, { disabled })}
                        type="checkbox"
                        className="toggle toggle-primary my-auto bg-base-300"
                        tabIndex={tabIndex}
                        id={id}
                    />
                    additionalClasses += ' min-h-[88px]';
                    break;
                case 'radio':
                    inputElement = input.options.map(e => {
                        return (
                            <div
                                className="flex flex-row justify-start align-center pb-2" key={e}>
                                <input
                                    {...register(registerId, { disabled })}
                                    type='radio'
                                    value={e}
                                    className="radio checked:bg-primary h-full bg-base-100"
                                    defaultChecked={e === input.options[0]}
                                    // id={e}
                                    tabIndex={tabIndex}
                                    id={id}
                                />
                                <label className="ml-2" htmlFor={e}>{e}</label>
                            </div>
                        )
                    })

                    if (input.property_name === 'DrawingType') {
                        (inputElement as any).push(<CustomDrawingTypeInput key="Custom" />)
                    }
                    break;
                case 'text':
                    inputElement = <input
                        {...register(registerId, { disabled })}
                        type="text"
                        placeholder="Enter value"
                        className="input input-bordered w-full"
                        tabIndex={tabIndex}
                        id={id}
                    />
                    additionalClasses += ' min-h-[88px]';
                    break;
            }
            const element =
                <label className={`form-control w-[200px] ${additionalClasses} transition-opacity flex flex-col`} key={input.tool_input_id}>
                    <div className="label">
                        <span>
                            {
                                coolantAngleInput ?
                                    (coolantAlongFluting ? 'Flutes to skip' : 'Rotation') : input.client_name
                            }
                        </span>
                    </div>
                    {inputElement}
                    <div className='w-full flex flex-row justify-start text-red-800'>
                        <ErrorMessage errors={errors} name={registerId} as="p" />
                    </div>
                </label>
            groupElements.push(element);
        }
        return groupElements;
    }

    let formElements: React.ReactNode[] = [];
    let minGroup = Math.min(...inputs.map(e => e.group))
    let maxGroup = Math.max(...inputs.map(e => e.group))
    for (let i = minGroup; i <= maxGroup; i++) {
        const inputsInGroup = inputs.filter(e => e.group === i);
        formElements.push(
            <div key={i} className="flex flex-col mr-5 last:mr-0 w-50">
                {generateGroup(inputsInGroup)}
            </div>
        );
    }
    return (
        // <form className="p-4 grid grid-cols-3 grid-flow-col">
        <div className="w-full p-4 flex flex-row justify-start flex-wrap">
            {...formElements}
            {type === 'Prp' && <FileTypes register={register} />}
        </div>
    )
}