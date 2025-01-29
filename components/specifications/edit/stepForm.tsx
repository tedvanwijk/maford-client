'use client'

import { useFormContext } from 'react-hook-form';
import { Plus, X } from "react-feather";
import { ToolType } from '@/app/types';

export default function StepForm({
    stepCount,
    changeStepCount,
    viewOnly,
    toolType
}: {
    stepCount: number,
    changeStepCount: Function,
    viewOnly: boolean,
    toolType: ToolType
}) {
    const { register, getValues, watch } = useFormContext();

    const stepTool = getValues('StepTool');

    function createStepTable() {
        let stepFormItems = [];
        for (let i = 0; i < stepCount; i++) {
            const midpointDisabled = watch(`Steps.${i}.RTop`, '') === '';
            stepFormItems.push(
                <tr key={i}>
                    <td className='font-bold'>{i + 1}</td>
                    <td className="border border-slate-400">
                        <input
                            className={`${stepTool ? '' : 'opacity-5'} bg-base-100 p-1 w-full h-full`}
                            type="number"
                            step="any"
                            {...register(`Steps.${i}.Length`, { disabled: !stepTool })}
                        />
                    </td>
                    <td className="border border-slate-400">
                        <input
                            className={`${stepTool ? '' : 'opacity-5'} bg-base-100 p-1 w-full h-full`}
                            type="number"
                            step="any"
                            {...register(`Steps.${i}.Diameter`, { disabled: !stepTool })}
                        />
                    </td>
                    <td className="border border-slate-400">
                        <input
                            className={`${stepTool ? '' : 'opacity-5'} bg-base-100 p-1 w-full h-full`}
                            type="number"
                            step="any"
                            {...register(`Steps.${i}.Angle`, { disabled: !stepTool })}
                        />
                    </td>
                    <td className="border border-slate-400">
                        <input
                            className={`${!stepTool ? 'opacity-5' : ''} bg-base-100 p-1 w-full h-full`}
                            type="number"
                            step="any"
                            {...register(`Steps.${i}.RTop`, { disabled: !stepTool })}
                        />
                    </td>
                    <td className="border border-slate-400">
                        <input
                            className={`${!stepTool ? 'opacity-5' : ''} bg-base-100 p-1 w-full h-full`}
                            type="number"
                            step="any"
                            {...register(`Steps.${i}.RBottom`, { disabled: !stepTool })}
                        />
                    </td>
                    <td className="text-center">
                        <input
                            className={`${!stepTool || midpointDisabled ? 'opacity-30 pointer-events-none' : ''} toggle toggle-primary my-auto bg-base-300`}
                            type="checkbox"
                            step="any"
                            {...register(`Steps.${i}.Midpoint`, { disabled: !stepTool && midpointDisabled })}
                        />
                    </td>
                    {
                        toolType.name === 'Drill' && (
                            <td className="text-center">
                                <input
                                    className={`${!stepTool ? 'opacity-30 pointer-events-none' : ''} toggle toggle-primary my-auto bg-base-300`}
                                    type="checkbox"
                                    step="any"
                                    {...register(`Steps.${i}.LOFFromPoint`, { disabled: !stepTool })}
                                />
                            </td>
                        )
                    }
                </tr>
            )
        }

        return (
            <table className='w-full border-collapse border-spacing-0 table-auto'>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Length</th>
                        <th>Diameter</th>
                        <th>Angle</th>
                        <th>R top</th>
                        <th>R bottom</th>
                        <th className="w-32">To countersink tangency</th>
                        {toolType.name === 'Drill' && <th className="w-32">LOF from point</th>}
                    </tr>
                </thead>
                <tbody>
                    {stepFormItems}
                </tbody>
            </table>
        );
    }

    return (
        <div className="w-full p-4 flex flex-col justify-start items-start">
            <label className={`form-control w-[200px] transition-opacity mb-4`} key={0}>
                <div className="label">
                    <span>Step tool</span>
                </div>
                <input
                    {...register('StepTool')}
                    type="checkbox"
                    className="toggle toggle-primary my-auto"
                />
            </label>
            <div className='w-full flex flex-col justify-start items-start'>
                {
                    createStepTable()
                }
                <div className="flex flex-row justify-start w-full items-center my-4">
                    {
                        !viewOnly ?
                            <>
                                <button type="button" disabled={!stepTool} className="btn btn-primary mr-4" onClick={() => changeStepCount(true)}><Plus />Add step</button>
                                <button type="button" disabled={!stepTool} className="btn bg-base-100 mr-4" onClick={() => changeStepCount(false)}><X />Remove step</button>
                            </> : ''
                    }
                </div>

            </div>
        </div>
    )
}