export default function SpecificationStep(
    {
        header,
        children,
        stepNumber,
        enabled,
        forceOpen,
        defaultChecked
    }:
        {
            header: string,
            stepNumber: number,
            children: React.ReactNode,
            enabled: boolean,
            forceOpen: boolean,
            defaultChecked: boolean
        }
) {
    return (
        <div className={`collapse ${enabled ? '' : 'opacity-50'} ${forceOpen ? 'collapse-open' : ''} bg-base-200 mb-3`}>
            <input defaultChecked={defaultChecked} type="checkbox" className={enabled ? '' : '!cursor-default'} disabled={!enabled} />
            <div className="collapse-title text-xl font-bold flex flex-row justify-start items-center">
                <div className={`mr-3 bg-base-300 rounded-full relative h-10 w-10 text-center align-middle leading-10`}>
                    {stepNumber + 1}
                </div>

                {header}
            </div>
            <div className="!p-0 collapse-content w-full">
                {children}
            </div>
        </div>
    )
}