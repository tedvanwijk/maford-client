import { SeriesInput, ToolInput, ToolType } from '@/app/types';
import { useFormContext } from 'react-hook-form';
import EditSeriesInputsTable from './editSeriesInputsTable';
import { ErrorMessage } from '@hookform/error-message';
import { useEffect } from 'react';

export default function EditToolForm(
    {
        enabled,
        seriesInputs,
        addSeriesInput,
        removeSeriesInput,
        toolTypeInputs,
        toolType
    }: {
        enabled: boolean,
        seriesInputs: SeriesInput[],
        addSeriesInput: Function,
        removeSeriesInput: Function,
        toolTypeInputs: {
            decimalInputs: ToolInput[],
            toggleInputs: ToolInput[]
        },
        toolType: ToolType
    }
) {
    const { register, watch, formState } = useFormContext();
    const errors = formState.errors;
    const straightFlute = watch('straight_flute', false);
    const leftHandSpiral = watch('left_hand_spiral', false);
    return (
        <div className='flex flex-col justify-start items-start'>
            <div className='font-bold'>
                Edit series parameters and inputs
            </div>
            <div className='flex flex-row justify-start items-start'>
                <div className="flex flex-col mb-4 mr-4">
                    <div className="flex flex-col mb-1">
                        <label className="form-control transition-opacity">
                            <div className="label">
                                <span>Name</span>
                            </div>
                        </label>
                        <input
                            {...register('name', { required: true, disabled: !enabled })}
                            type="text"
                            placeholder="Enter value"
                            className="input input-bordered w-full"
                        />
                    </div>
                    <div className="flex flex-col mb-1">
                        <label className="form-control transition-opacity">
                            <div className="label">
                                <span>Flute Count</span>
                            </div>
                        </label>
                        <input
                            {...register('flute_count', {
                                required: true,
                                disabled: !enabled,
                                min: (toolType.name === 'Drill' ? {
                                    value: 2,
                                    message: 'Only 2- & 3-fluted drills supported'
                                } : {
                                    value: 1,
                                    message: 'Value too low'
                                }),
                                max: (toolType.name === 'Drill' ? {
                                    value: 3,
                                    message: 'Only 2- & 3-fluted drills supported'
                                } : {
                                    value: 'any',
                                    message: 'Value too high'
                                })
                            })}
                            type="number"
                            placeholder="Enter value"
                            className="input input-bordered w-full"
                            onWheel={(e: any) => e.target.blur()}
                        />
                        <div className='w-full flex flex-row justify-start text-red-800'>
                            <ErrorMessage errors={errors} name="flute_count" as="p" />
                        </div>
                    </div>
                </div>

                <div className="flex flex-col mb-4 mr-4">
                    <div className="flex flex-col mb-1">
                        <label className="form-control transition-opacity">
                            <div className="label">
                                <span>Helix Angle</span>
                            </div>
                        </label>
                        <input
                            {...register('helix_angle', { required: true, disabled: (!enabled || straightFlute) })}
                            type="number"
                            placeholder="Enter value"
                            className="input input-bordered w-full"
                            onWheel={(e: any) => e.target.blur()}
                        />
                    </div>
                    <div className="flex flex-col mb-1">
                        <label className="form-control transition-opacity">
                            <div className="label">
                                <span>Excel File Name</span>
                            </div>
                        </label>
                        <input
                            {...register('tool_series_file_name', { required: true, disabled: !enabled })}
                            type="text"
                            placeholder="Enter value"
                            className="input input-bordered w-full"
                        />
                    </div>
                </div>

                <div className="flex flex-col mb-4 mr-4">
                    <div className="flex flex-col mb-1">
                        <label className="form-control transition-opacity">
                            <div className="label">
                                <span>Excel File Input Range</span>
                            </div>
                        </label>
                        <input
                            {...register('tool_series_input_range', { required: true, disabled: !enabled })}
                            type="text"
                            placeholder="Enter value"
                            className="input input-bordered w-full"
                        />
                    </div>
                    <div className="flex flex-col mb-1">
                        <label className="form-control transition-opacity">
                            <div className="label">
                                <span>Excel File Output Range</span>
                            </div>
                        </label>
                        <input
                            {...register('tool_series_output_range', { required: true, disabled: !enabled })}
                            type="text"
                            placeholder="Enter value"
                            className="input input-bordered w-full"
                        />
                    </div>
                </div>

                <div className="flex flex-col mb-4 mr-4">
                    <div className="flex flex-col mb-1">
                        <label className="form-control transition-opacity">
                            <div className="label">
                                <span>Left hand spiral</span>
                            </div>
                        </label>
                        <div className='h-12 flex justify-start'>
                            <input
                                {...register('left_hand_spiral', { disabled: (!enabled || straightFlute) })}
                                placeholder="Enter value"
                                type="checkbox"
                                className="toggle toggle-primary my-auto"
                            />
                        </div>
                    </div>
                    {
                        (toolType.name === 'Drill' || toolType.name === 'Reamer') &&
                        <div className="flex flex-col mb-1">
                            <label className="form-control transition-opacity">
                                <div className="label">
                                    <span>Straight Flute</span>
                                </div>
                            </label>
                            <div className='h-12 flex justify-start'>
                                <input
                                    {...register('straight_flute', { disabled: (!enabled || leftHandSpiral) })}
                                    placeholder="Enter value"
                                    type="checkbox"
                                    className="toggle toggle-primary my-auto"
                                />
                            </div>
                        </div>
                    }
                </div>

            </div>
            <EditSeriesInputsTable
                seriesInputs={seriesInputs}
                enabled={enabled}
                addSeriesInput={addSeriesInput}
                removeSeriesInput={removeSeriesInput}
                toolTypeInputs={toolTypeInputs}
            />
        </div>
    )
}