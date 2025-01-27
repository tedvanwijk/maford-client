import { useRef, useState } from "react";
import { useFormContext } from 'react-hook-form';
import { apiUrl } from "@/lib/api";

export default function CustomDrawingTypeInput({

}: {

    }) {
    const { register, getValues, setValue } = useFormContext();

    const inputFileElement = useRef(null);
    const [label, setLabel] = useState('Custom');
    const [oldDrawingType, setOldDrawingType] = useState('Manufacturing');

    document.addEventListener('cancel', () => setValue('Prp.DrawingType', oldDrawingType));

    async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.files) {
            setLabel('Custom format selected');
            setValue('Prp.DrawingTypeFilename', e.target.files[0].name);

            const formData = new FormData();
            formData.append('file', e.target.files[0])
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
        }
    }

    return (
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
            <label className="ml-2" htmlFor="Custom">{getValues('Prp.DrawingTypeFilename') || 'Custom'}</label>
            <input type="file" id="file" name="file" accept=".slddrt" ref={inputFileElement} className='hidden' onChange={handleFileChange} />
        </div>
    )
}