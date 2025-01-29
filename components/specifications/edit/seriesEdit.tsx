import { Series, ToolType } from "@/app/types";
import { ErrorMessage } from '@hookform/error-message';
import { useFormContext } from "react-hook-form";

export default function SeriesEdit(
    {
        toolSeriesInput,
        toolType,
        selectedSeries,
        submitMode,
        checkIfSeriesEdited
    }: {
        toolSeriesInput: React.ReactNode,
        toolType: ToolType,
        selectedSeries: Series,
        submitMode: boolean,
        checkIfSeriesEdited: Function
    }
) {
    const { register, watch, formState } = useFormContext();
    const straightFlute = watch('straight_flute', false);
    const leftHandSpiral = watch('left_hand_spiral', false);

    if (toolType === null || toolType === undefined) return <div></div>

    const errors = formState.errors;

    return (
        <div className="w-full p-4 flex flex-col justify-start flex-wrap">
            <div>
                {toolSeriesInput}
            </div>

            <div className='flex flex-row justify-start items-start'>
                <div className="flex flex-col mb-4 mr-4">
                    <div className="flex flex-col mb-1 w-[200px]">
                        <label className="form-control transition-opacity">
                            <div className="label">
                                <span>Flute Count</span>
                            </div>
                        </label>
                        <input
                            {...register('flute_count', {
                                required: 'Required',
                                onChange: () => checkIfSeriesEdited(selectedSeries),
                                min: (toolType.name === 'Drill' ? {
                                    value: 2,
                                    message: 'Only 2-fluted drills supported'
                                } : {
                                    value: 1,
                                    message: 'Value too low'
                                }),
                                max: (toolType.name === 'Drill' ? {
                                    value: 2,
                                    message: 'Only 2-fluted drills supported'
                                } : {
                                    value: 'any',
                                    message: 'Value too high'
                                })
                            })}
                            type="number"
                            placeholder="Enter value"
                            className="input input-bordered w-full"
                        />
                        <div className='w-full flex flex-row justify-start text-red-800'>
                            <ErrorMessage errors={errors} name="flute_count" as="p" />
                        </div>
                    </div>
                    <div className="flex flex-col mb-1 w-[200px]">
                        <label className="form-control transition-opacity">
                            <div className="label">
                                <span>Helix Angle</span>
                            </div>
                        </label>
                        <input
                            {...register('helix_angle', {
                                required: !straightFlute && 'Required',
                                onChange: () => checkIfSeriesEdited(selectedSeries),
                                min: {
                                    value: 0,
                                    message: 'Value too low'
                                },
                                max: {
                                    value: 90,
                                    message: 'Value too high'
                                }
                            })}
                            type="number"
                            placeholder="Enter value"
                            className={`input input-bordered w-full ${straightFlute && 'opacity-20 pointer-events-none'}`}
                            tabIndex={straightFlute ? -1 : 0}
                        />
                        <div className='w-full flex flex-row justify-start text-red-800'>
                            <ErrorMessage errors={errors} name="helix_angle" as="p" />
                        </div>
                    </div>
                </div>

                <div className="flex flex-col mb-4 mr-4">
                    <div className="flex flex-col mb-1 w-[200px]">
                        <label className="form-control transition-opacity">
                            <div className="label">
                                <span>Left hand spiral</span>
                            </div>
                        </label>
                        <div className='h-12 flex justify-start'>
                            <input
                                {...register('left_hand_spiral', { onChange: () => checkIfSeriesEdited(selectedSeries) })}
                                placeholder="Enter value"
                                type="checkbox"
                                className={`toggle toggle-primary my-auto ${straightFlute && 'opacity-20 pointer-events-none'}`}
                                tabIndex={straightFlute ? -1 : 0}
                            />
                        </div>
                    </div>
                    {
                        (toolType.name === 'Drill' || toolType.name === 'Reamer') &&
                            <div className="flex flex-col mb-1 w-[200px]">
                                <label className="form-control transition-opacity">
                                    <div className="label">
                                        <span>Straight Flute</span>
                                    </div>
                                </label>
                                <div className='h-12 flex'>
                                    <input
                                        {...register('straight_flute', { onChange: () => checkIfSeriesEdited(selectedSeries) })}
                                        placeholder="Enter value"
                                        type="checkbox"
                                        className={`toggle toggle-primary my-auto ${leftHandSpiral && 'opacity-20 pointer-events-none'}`}
                                        tabIndex={leftHandSpiral ? -1 : 0}
                                    />
                                </div>
                            </div>
                    }
                </div>
            </div>

        </div>
    )
}