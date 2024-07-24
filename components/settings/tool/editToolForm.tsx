import { SeriesInput, ToolInput } from '@/app/types';
import { useFormContext } from 'react-hook-form';
import EditSeriesInputsTable from './editSeriesInputsTable';

export default function EditToolForm(
    {
        enabled,
        seriesInputs,
        addSeriesInput,
        removeSeriesInput,
        toolTypeInputs
    }: {
        enabled: boolean,
        seriesInputs: SeriesInput[],
        addSeriesInput: Function,
        removeSeriesInput: Function,
        toolTypeInputs: {
            decimalInputs: ToolInput[],
            toggleInputs: ToolInput[]
        }
    }
) {
    const { register } = useFormContext();
    return (
        <div className='flex flex-col justify-start items-start'>
            <div className='flex flex-row justify-start items-start'>
                <div className="flex flex-col mb-4 mr-4">
                    <div className="flex flex-col mb-1">
                        <label className="form-control transition-opacity">
                            <div className="label">
                                <span>Name</span>
                            </div>
                        </label>
                        <input
                            {...register('name', {required: true, disabled: !enabled})}
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
                            {...register('flute_count', {required: true, disabled: !enabled})}
                            type="number"
                            placeholder="Enter value"
                            className="input input-bordered w-full"
                        />
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
                            {...register('helix_angle', {required: true, disabled: !enabled})}
                            type="number"
                            placeholder="Enter value"
                            className="input input-bordered w-full"
                        />
                    </div>
                    <div className="flex flex-col mb-1">
                        <label className="form-control transition-opacity">
                            <div className="label">
                                <span>Excel File Name</span>
                            </div>
                        </label>
                        <input
                            {...register('tool_series_file_name', {required: true, disabled: !enabled})}
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
                            {...register('tool_series_input_range', {required: true, disabled: !enabled})}
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
                            {...register('tool_series_output_range', {required: true, disabled: !enabled})}
                            type="text"
                            placeholder="Enter value"
                            className="input input-bordered w-full"
                        />
                    </div>
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