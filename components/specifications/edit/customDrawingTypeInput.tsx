import { useRef, useState } from "react";
import { useFormContext } from 'react-hook-form';

export default function CustomDrawingTypeInput() {
    const { register, getValues, setValue, watch } = useFormContext();
    const inputFileElement = useRef(null);
    const [oldDrawingType, setOldDrawingType] = useState('Manufacturing');

    document.addEventListener('cancel', () => {
        if (getValues('Prp.DrawingTypeFilename') !== undefined) return;
        setValue('Prp.DrawingType', 'Manufacturing');
        setValue('Prp.DrawingTypeFilename', undefined);
    });

    async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.files) {
            setValue('Prp.DrawingTypeFilename', e.target.files[0].name);

            const formData = new FormData();
            formData.append('file', e.target.files[0]);
            await fetch(
                `/api/drawingtype`,
                {
                    method: "POST",
                    cache: "no-cache",
                    body: formData
                }
            )
        } else {
            setValue('Prp.DrawingType', oldDrawingType);
            setValue('Prp.DrawingTypeFilename', undefined);
        }
        (inputFileElement as any).current.value = null;
    }

    return (
        <>
            <div
                className="flex flex-row justify-start align-center pb-2" key="Custom">
                <input
                    {...register('Prp.DrawingType')}
                    type='radio'
                    value="Custom"
                    className="radio checked:bg-primary bg-base-100"
                    defaultChecked={false}
                    onClick={() => {
                        setOldDrawingType(getValues('Prp.DrawingType'));
                        (inputFileElement.current as any).click();
                    }}
                />
                <label className="ml-2" htmlFor="Custom">{watch('Prp.DrawingType') === 'Custom' ? watch('Prp.DrawingTypeFilename') : 'Custom'}</label>
                <input type="file" id="file" name="file" accept=".slddrt" ref={inputFileElement} className='hidden' onChange={handleFileChange} />
            </div>
            <label className={`form-control w-[200px] transition-opacity flex flex-col ${watch('Prp.DrawingType') !== 'Custom' && 'hidden'}`}>
                <div className="label">
                    <span>Tolerance table on drawing</span>
                </div>
                <input
                    {...register('Prp.TableOnDrawing', { disabled: watch('Prp.DrawingType') !== 'Custom' })}
                    type="checkbox"
                    className="toggle toggle-primary my-auto bg-base-300"
                />
            </label>
        </>
    )
}