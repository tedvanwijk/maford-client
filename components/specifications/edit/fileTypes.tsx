export default function FileTypes({ register }: { register: Function }) {
    return (
        <div className='flex flex-col justify-start items-start pl-4 pt-2 border-l border-neutral'>
            <h1 className='mb-2'>Part files</h1>
            <div className="flex flex-row justify-start items-center mb-2">
                <input checked readOnly type="checkbox" className="mr-2 toggle toggle-primary my-auto bg-base-300 opacity-30 cursor-not-allowed" />
                Solidworks Part
            </div>
            <div className="flex flex-row justify-start items-center mb-2">
                <input {...register('filetypes.part.igs')} type="checkbox" className="mr-2 toggle toggle-primary my-auto bg-base-300" />
                IGES
            </div>
            <div className="flex flex-row justify-start items-center mb-2">
                <input {...register('filetypes.part.step')} type="checkbox" className="mr-2 toggle toggle-primary my-auto bg-base-300" />
                STEP
            </div>
            <div className="flex flex-row justify-start items-center mb-2">
                <input {...register('filetypes.part.stl')} type="checkbox" className="mr-2 toggle toggle-primary my-auto bg-base-300" />
                STL
            </div>
            <h1 className='mb-2'>Drawing files</h1>
            <div className="flex flex-row justify-start items-center mb-2">
                <input checked readOnly type="checkbox" className="mr-2 toggle toggle-primary my-auto bg-base-300 opacity-30 cursor-not-allowed" />
                Solidworks Drawing
            </div>
            <div className="flex flex-row justify-start items-center mb-2">
                <input {...register('filetypes.drawing.ai')} type="checkbox" className="mr-2 toggle toggle-primary my-auto bg-base-300" />
                Adobe Illustrator
            </div>
            <div className="flex flex-row justify-start items-center mb-2">
                <input {...register('filetypes.drawing.psd')} type="checkbox" className="mr-2 toggle toggle-primary my-auto bg-base-300" />
                Adobe Photoshop
            </div>
            <div className="flex flex-row justify-start items-center mb-2">
                <input {...register('filetypes.drawing.dwg')} type="checkbox" className="mr-2 toggle toggle-primary my-auto bg-base-300" />
                DWG
            </div>
            <div className="flex flex-row justify-start items-center mb-2">
                <input {...register('filetypes.drawing.dxf')} type="checkbox" className="mr-2 toggle toggle-primary my-auto bg-base-300" />
                DXF
            </div>
            <div className="flex flex-row justify-start items-center mb-2">
                <input {...register('filetypes.drawing.edrw')} type="checkbox" className="mr-2 toggle toggle-primary my-auto bg-base-300" />
                eDrawing
            </div>
            <div className="flex flex-row justify-start items-center mb-2">
                <input {...register('filetypes.drawing.jpg')} type="checkbox" className="mr-2 toggle toggle-primary my-auto bg-base-300" />
                JPEG
            </div>
            <div className="flex flex-row justify-start items-center mb-2">
                <input {...register('filetypes.drawing.pdf')} type="checkbox" className="mr-2 toggle toggle-primary my-auto bg-base-300" />
                PDF
            </div>
            <div className="flex flex-row justify-start items-center mb-2">
                <input {...register('filetypes.drawing.png')} type="checkbox" className="mr-2 toggle toggle-primary my-auto bg-base-300" />
                PNG
            </div>
        </div>
    )
} 