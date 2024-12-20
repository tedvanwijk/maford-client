import { ToolType } from "@/app/types";
import { useFormContext } from "react-hook-form";

export default function SeriesEdit(
    {
        toolSeriesInput,
        toolType,
        selectedSeries,
        submitMode,
    }: {
        toolSeriesInput: React.ReactNode,
        toolType: ToolType,
        selectedSeries: number,
        submitMode: boolean,
    }
) {
    const { register, watch } = useFormContext();
    const straightFlute = watch('straight_flute', false);
    const leftHandSpiral = watch('left_hand_spiral', false);

    if (toolType === null || toolType === undefined) return <div></div>

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
                            {...register('flute_count', { required: true })}
                            type="number"
                            placeholder="Enter value"
                            className="input input-bordered w-full"
                        />
                    </div>
                    <div className="flex flex-col mb-1 w-[200px]">
                        <label className="form-control transition-opacity">
                            <div className="label">
                                <span>Helix Angle</span>
                            </div>
                        </label>
                        <input
                            {...register('helix_angle', { required: true, disabled: straightFlute })}
                            type="number"
                            placeholder="Enter value"
                            className="input input-bordered w-full"
                        />
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
                                {...register('left_hand_spiral', { disabled: straightFlute })}
                                placeholder="Enter value"
                                type="checkbox"
                                className="toggle toggle-primary my-auto"
                            />
                        </div>
                    </div>
                    {
                        (toolType.name === 'Drill' || toolType.name === 'Reamer') ?
                            <div className="flex flex-col mb-1 w-[200px]">
                                <label className="form-control transition-opacity">
                                    <div className="label">
                                        <span>Straight Flute</span>
                                    </div>
                                </label>
                                <div className='h-12 flex justify-start'>
                                    <input
                                        {...register('straight_flute', { disabled: leftHandSpiral })}
                                        placeholder="Enter value"
                                        type="checkbox"
                                        className="toggle toggle-primary my-auto"
                                    />
                                </div>
                            </div> :
                            ''
                    }
                </div>
            </div>

        </div>
    )
}