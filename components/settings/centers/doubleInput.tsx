import { useFormContext } from 'react-hook-form';

export default function DoubleInput({
    name,
    displayName,
    disabled
}: {
    name: string,
    displayName: string,
    disabled: boolean
}) {
    const { register, watch, setValue } = useFormContext();
    const tolerance = watch(`${name}_tolerance`);
    return (
        <div className="flex flex-col mb-1">
            <label className="form-control transition-opacity">
                <div className="label">
                    <span>{displayName}</span>
                </div>
            </label>
            <div className="flex flex-col input h-24 input-bordered w-full p-0 max-w-[249px]">
                <input
                    {...register(`${name}_upper`)}
                    type="number"
                    step="any"
                    placeholder={`${tolerance ? 'Enter upper limit' : 'Enter value'}`}
                    className="input border-none"
                    onWheel={(e: any) => e.target.blur()}
                />
                <hr className="border-neutral opacity-25" />
                <div className={`relative w-full p-0 m-0 flex flex-row justify-between items-center`}>
                    <input
                        {...register(`${name}_lower`, { disabled: !tolerance })}
                        type="number"
                        step="any"
                        placeholder={tolerance ? 'Enter lower limit' : 'Enable tolerance'}
                        className="input border-none w-0 pr-0 grow rounded-t-none"
                        onWheel={(e: any) => e.target.blur()}
                    />
                    <input
                        {...register(`${name}_tolerance`, { onChange: () => setValue(`${name}_lower`, undefined) })}
                        type="checkbox"
                        className="toggle toggle-primary my-0 mr-2 z-50 absolute right-0 bg-base-300"
                    />
                </div>
            </div>
        </div>

    )
}