import { useFormContext } from 'react-hook-form';

import { ToolInput, ToolInputRule } from "@/app/types";
import { useEffect } from 'react';

export default function SpecificationForm(
    {
        inputs,
        toolSeriesInput,
        upperCenterDropdown,
        lowerCenterDropdown,
        type = 'General',
        submitMode,
        validateRules
    }: {
        inputs: ToolInput[],
        toolSeriesInput: React.ReactNode,
        upperCenterDropdown: React.ReactNode
        lowerCenterDropdown: React.ReactNode
        type?: string,
        submitMode: boolean,
        validateRules: Function
    }
) {
    const { register, watch, getValues } = useFormContext();

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
    }, []);

    function generateGroup(inputs: ToolInput[]) {
        const formData = watch();
        let groupElements: React.ReactNode[] = [];
        for (let i = 0; i < inputs.length; i++) {
            const input = inputs[i];

            let coolantAngleInput = false;
            let coolantAlongFluting;
            if (input.property_name === 'CoolantPatternAngle') {
                coolantAngleInput = true;
                coolantAlongFluting = watch('Coolant.CoolantPatternAlongFluting');
            }

            if (input.property_name === 'ToolSeries') {
                groupElements.push(toolSeriesInput);
                continue
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
            if (rules.length > 0) [disabled, additionalClasses] = validateRules(rules, formData);

            // if not submitting, don't actually disable inputs so the values can still be retrieved
            // this way, if a rule depends on an initially disabled input, it will still evaluate correctly
            // disable the inputs using opacity and pointer events in this situation
            // when submitting, actually disable inputs so that the retrieved values for disabled
            // inputs are undefined
            const tabIndex = disabled ? -1 : 0;
            if (!submitMode) disabled = false;

            let inputElement: React.ReactNode;
            let registerId = input.property_name;
            if (type !== 'General') registerId = `${type}.${registerId}`;
            switch (input.type) {
                case 'decimal':
                    inputElement = <input
                        {...register(registerId, { disabled })}
                        type="number"
                        placeholder="Enter value"
                        step="any"
                        // disabled={disabled}
                        className="input input-bordered w-full"
                        lang="en-US"
                        tabIndex={tabIndex}
                    />
                    additionalClasses += ' h-[88px]';
                    break;
                case 'int':
                    inputElement = <input
                        {...register(registerId, { disabled })}
                        type="number"
                        placeholder="Enter value"
                        step="1"
                        // disabled={disabled}
                        className="input input-bordered w-full"
                        lang="en-US"
                        tabIndex={tabIndex}
                    />
                    additionalClasses += ' h-[88px]';
                    break;
                case 'toggle':
                    inputElement = <input
                        {...register(registerId, { disabled })}
                        type="checkbox"
                        // disabled={disabled}
                        className="toggle toggle-primary my-auto bg-base-300"
                        tabIndex={tabIndex}
                    />
                    additionalClasses += ' h-[88px]';
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
                                    id={e}
                                    tabIndex={tabIndex}
                                />
                                <label className="ml-2" htmlFor={e}>{e}</label>
                            </div>
                        )
                    })
                    break;
                case 'text':
                    inputElement = <input
                        {...register(registerId, { disabled })}
                        type="text"
                        placeholder="Enter value"
                        // disabled={disabled}
                        className="input input-bordered w-full"
                        tabIndex={tabIndex}
                    />
                    additionalClasses += ' h-[88px]';
                    break;
            }
            const element =
                <label className={`form-control w-[200px] ${additionalClasses} transition-opacity`} key={input.tool_input_id}>
                    <div className="label">
                        <span>
                            {
                                coolantAngleInput ?
                                    (coolantAlongFluting ? 'Flutes to skip' : 'Rotation') : input.client_name
                            }
                        </span>
                    </div>
                    {inputElement}
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
        </div>
    )
}