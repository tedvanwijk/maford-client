import { useFormContext } from 'react-hook-form';

import { ToolInput, ToolInputRule } from "@/app/types";

export default function SpecificationForm(
    {
        inputs,
        inputRules,
        toolSeriesInput,
        type = 'General'
    }: {
        inputs: ToolInput[],
        inputRules: ToolInputRule[],
        toolSeriesInput?: React.ReactNode,
        type?: string
    }
) {
    const { register, watch } = useFormContext();
    function generateGroup(inputs: ToolInput[]) {
        const formData = watch();
        let groupElements: React.ReactNode[] = [];
        for (let i = 0; i < inputs.length; i++) {
            const input = inputs[i];
            if (input.property_name === 'ToolSeries') {
                groupElements.push(toolSeriesInput);
                continue
            }

            let rules: ToolInputRule[] = inputRules.filter((e: ToolInputRule) => e.tool_input_id === input.tool_input_id);
            let disabled = false;
            let additionalClasses = '';
            if (rules.length > 0) {
                // there are rules for this input
                disabled = true;
                additionalClasses = 'opacity-30';
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
                            disabled = !check;
                            additionalClasses = dependencyValue1 ? '' : 'opacity-30';
                            break;
                        case 'disabled':
                            check = dependencyValue1;
                            disabled = Boolean(check);
                            additionalClasses = dependencyValue1 ? 'opacity-30' : '';
                            break;
                        case 'greater_than':
                            if (rule.tool_input_dependency_id_2 === null) check = dependencyValue1 > rule.check_value;
                            else check = dependencyValue1 > dependencyValue2;
                            disabled = !check;
                            additionalClasses = check ? '' : 'opacity-30';
                            break;
                        case 'less_than':
                            if (rule.tool_input_dependency_id_2 === null) check = dependencyValue1 < rule.check_value;
                            else check = dependencyValue1 < dependencyValue2;
                            disabled = !check;
                            additionalClasses = check ? '' : 'opacity-30';
                            break;
                        case 'equal':
                            if (rule.tool_input_dependency_id_2 === null) {
                                if (isNaN(+rule.check_value)) check = dependencyValue1 === rule.check_value;
                                else check = dependencyValue1 === parseFloat(rule.check_value);
                            } 
                            else check = dependencyValue1 === dependencyValue2;
                            disabled = !check;
                            additionalClasses = check ? '' : 'opacity-30';
                            break;
                    }

                    if (check && rule.disable) {
                        // if the current rule being check has disabled = true, it takes priority and cancels the loop if the rule is validated
                        disabled = true;
                        additionalClasses = 'opacity-30';
                        break;
                    }

                    if (!rule.disable && !disabled) break; // since we have sorted the array so the disabled rules are first, once a rule is not of type disabled and it has been validated, we can break out of the loop
                }
            }

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
                    />
                    additionalClasses += ' h-[88px]';
                    break;
                case 'toggle':
                    inputElement = <input
                        {...register(registerId, { disabled })}
                        type="checkbox"
                        // disabled={disabled}
                        className="toggle toggle-primary my-auto"
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
                                    className="radio checked:bg-primary h-full"
                                    defaultChecked={e === input.options[0]}
                                    id={e}
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
                    />
                    additionalClasses += ' h-[88px]';
                    break;
            }
            const element =
                <label className={`form-control w-[200px] ${additionalClasses} transition-opacity`} key={input.tool_input_id}>
                    <div className="label">
                        <span>{input.client_name}</span>
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