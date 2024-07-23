import { SeriesInput } from "@/app/types";
import { useFormContext } from 'react-hook-form';
import { Plus, X } from "react-feather";

export default function EditSeriesInputsTable(
    {
        seriesInputs,
        enabled,
        addSeriesInput,
        removeSeriesInput
    }: {
        seriesInputs: SeriesInput[],
        enabled: boolean,
        addSeriesInput: Function,
        removeSeriesInput: Function
    }
) {
    const { register, watch } = useFormContext();
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
                            <th>Name</th>
                            <th>Property Name</th>
                            <th>Type</th>
                            <th>Value</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            seriesInputs.map((e: SeriesInput, i: number) => {
                                // console.log(watch(`${e.index}__type`))
                                const type = watch(`${e.index}__type`, '');
                                return (
                                    <tr key={e.index}>
                                        <td className='font-bold'>{e.index + 1}</td>
                                        <td className="border border-slate-400">
                                            <input
                                                className="bg-base-100 p-1 w-full h-full"
                                                type="text"
                                                {...register(`${e.index}__name`, {required: true})}
                                            />
                                        </td>
                                        <td className="border border-slate-400">
                                            <input
                                                className={`${type === 'cst' ? 'opacity-5' : ''} bg-base-100 p-1 w-full h-full`}
                                                type="text"
                                                {...register(`${e.index}__property_name`, {required: type !== 'cst'})}
                                            />
                                        </td>
                                        <td className="border border-slate-400">
                                            <select
                                                className="bg-base-100 p-1 w-full h-full"
                                                // type="text"
                                                {...register(`${e.index}__type`, {required: true})}
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
                                                {...register(`${e.index}__value`, {required: type !== 'var'})}
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

