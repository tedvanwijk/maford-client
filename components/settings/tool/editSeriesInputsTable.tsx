import { SeriesInput, ToolInput } from "@/app/types";
import { useFormContext } from 'react-hook-form';
import { Plus, X } from "react-feather";

export default function EditSeriesInputsTable(
    {
        seriesInputs,
        enabled,
        addSeriesInput,
        removeSeriesInput,
        toolTypeInputs
    }: {
        seriesInputs: SeriesInput[],
        enabled: boolean,
        addSeriesInput: Function,
        removeSeriesInput: Function,
        toolTypeInputs: {
            decimalInputs: ToolInput[],
            toggleInputs: ToolInput[]
        }
    }
) {
    const { register, watch, setValue } = useFormContext();
    if (!enabled) return <></>
    else return (
        <>
            <div className='flex-grow flex-col justify-start items-start w-full'>
                <div className='label'>
                    Excel File Inputs
                </div>
                <table className='w-full border-collapse border-spacing-0 table-auto'>
                    <thead>
                        <tr>
                            <th></th>
                            <th>Name/Input</th>
                            {/* <th>Property Name</th> */}
                            <th>Type</th>
                            <th>Value</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            seriesInputs.map((e: SeriesInput, i: number) => {
                                const type = watch(`${e.index}__type`, '');

                                let nameInput: React.ReactNode;
                                if (type === 'var') {
                                    nameInput =
                                        <td>
                                            <select
                                                className="bg-base-100 p-1 w-full h-full"
                                                {...register(`${e.index}__name`, { required: true })}
                                            >
                                                {
                                                    toolTypeInputs.decimalInputs.map(e => <option key={e.property_name} value={e.property_name}>{e.client_name}</option>)
                                                }
                                                <option value="" disabled hidden>Choose input</option>
                                            </select>
                                        </td>
                                        // setValue(`${e.index}__name`, toolTypeInputs.decimalInputs[0].property_name)
                                } else if (type === 'toggle') {
                                    nameInput = 
                                    <td>
                                        <select
                                            className="bg-base-100 p-1 w-full h-full"
                                            {...register(`${e.index}__name`, { required: true })}
                                        >
                                            {
                                                toolTypeInputs.toggleInputs.map(e => <option key={e.property_name} value={e.property_name}>{e.client_name}</option>)
                                            }
                                            <option value="" disabled hidden>Choose input</option>
                                        </select>
                                    </td>
                                } else {
                                    nameInput = 
                                    <td className="border border-slate-400">
                                        <input
                                            className="bg-base-100 p-1 w-full h-full"
                                            type="text"
                                            {...register(`${e.index}__name`, { required: true })}
                                        />
                                    </td>
                                }


                                return (
                                    <tr key={e.index}>
                                        <td className='font-bold'>{e.index + 1}</td>
                                        {nameInput}
                                        <td className="border border-slate-400">
                                            <select
                                                className="bg-base-100 p-1 w-full h-full"
                                                // type="text"
                                                {...register(`${e.index}__type`, { required: true, onChange: () =>  setValue(`${e.index}__name`, '')})}
                                            >
                                                <option value="cst">Constant</option>
                                                <option value="var">Variable</option>
                                                <option value="toggle">Toggle</option>
                                            </select>
                                        </td>
                                        <td className="border border-slate-400">
                                            <input
                                                className={`${type === 'var' ? 'opacity-5' : ''} bg-base-100 p-1 w-full h-full`}
                                                type="text"
                                                {...register(`${e.index}__value`, { required: type !== 'var' })}
                                            />
                                        </td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
                <div className="flex flex-row justify-start w-full items-center my-4">
                    <button type="button" className="btn btn-primary mr-4" onClick={() => addSeriesInput()}><Plus />Add row</button>
                    <button type="button" className="btn bg-base-100 mr-4" onClick={() => removeSeriesInput()}><X />Remove row</button>
                </div>
            </div>
        </>
    )
}

