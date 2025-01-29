import { ChevronDown, ChevronUp } from "react-feather";
import { useState } from "react";

export default function SpecificationStep(
    {
        header,
        children,
        stepNumber,
        enabled,
        forceOpen,
        defaultChecked,
        arrowEnabled
    }:
        {
            header: string,
            stepNumber: number,
            children: React.ReactNode,
            enabled: boolean,
            forceOpen: boolean,
            defaultChecked: boolean,
            arrowEnabled: boolean
        }
) {
    const [open, setOpen] = useState(defaultChecked);
    return (
        <div className={`collapse ${!enabled && 'opacity-50'} ${forceOpen && 'collapse-open'} bg-base-200 mb-3`}>
            <input checked={open} id={stepNumber.toString()} onChange={e => setOpen(e.target.checked)} type="checkbox" className={enabled ? '' : '!cursor-default'} disabled={!enabled} />
            <div className="collapse-title text-xl font-bold flex flex-row justify-between w-full items-center">
                <div className="flex flex-row justify-start items-center">
                    <div className={`mr-3 bg-base-300 rounded-full relative h-10 w-10 text-center align-middle leading-10`}>
                        {stepNumber + 1}
                    </div>

                    {header}
                </div>
                <div className="aspect-square h-[2.5rem]">
                    {arrowEnabled && (open ? <ChevronUp className="text-xl w-full h-full" /> : <ChevronDown className="text-xl w-full h-full" />)}
                </div>
            </div>

            <div className="!p-0 collapse-content w-full">
                {children}
            </div>
        </div>
    )
}