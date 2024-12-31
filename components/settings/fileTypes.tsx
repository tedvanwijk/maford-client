'use client'

import { CustomParam } from "@/app/types";
import { FormEvent } from 'react';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { apiUrl } from "@/lib/api";
import { Check } from "react-feather";

export default function FileTypes() {
    const [saveButton, setSaveButton] = useState(<>Save</>);
    const { register, getValues, setValue } = useForm({ mode: 'onChange' });

    useEffect(() => {
        function setValues(customParams: CustomParam[]) {
            for (let i = 0; i < customParams.length; i++) {
                const customParam = customParams[i];
                let category = 'part';
                if (customParam.title === 'DrawingFileTypes') category = 'drawing';

                let fileTypes = customParam.value.split(',');
                for (let fileType of fileTypes) {
                    setValue(`${category}.${fileType}`, true);
                }
            }
        }

        fetch(
            `${apiUrl}/custom_params?types=DrawingFileTypes,PartFileTypes`,
            {
                method: 'GET',
                cache: 'no-cache'
            }
        )
            .then(res => res.json())
            .then(res => setValues(res));
    }, [setValue])

    function submitChanges(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const formData = getValues();

        function convertToString(obj: any) {
            let string = '';
            for (const [key, value] of Object.entries(obj)) if (value) string += `${key},`;
            string = string.substring(0, string.length - 1);
            return string;
        }

        const partTypes = convertToString(formData.part);
        const drawingTypes = convertToString(formData.drawing);

        fetch(
            `${apiUrl}/custom_params`,
            {
                method: 'PUT',
                cache: 'no-cache',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    PartFileTypes: partTypes,
                    DrawingFileTypes: drawingTypes
                })
            }
        )
            .then(res => {
                if (res.status === 200) {
                    setSaveButton(<>Saved<Check /></>);
                    setTimeout(() => setSaveButton(<>Save</>), 3000);
                } else {
                    setSaveButton(<>Saving failed</>);
                    setTimeout(() => setSaveButton(<>Save</>), 3000);
                }
            })
    }

    return (
        <form onSubmit={e => submitChanges(e)}>
            <div className="flex flex-row justify-start items-start">
                <div className="flex flex-col justify-start items-start mr-4">
                    <h1 className="mb-2">Drawing files</h1>

                    <div className="flex flex-row justify-start items-center mb-2">
                        <input checked readOnly type="checkbox" className="mr-2 toggle toggle-primary my-auto bg-base-300 opacity-30 cursor-not-allowed" />
                        Solidworks Drawing
                    </div>
                    <div className="flex flex-row justify-start items-center mb-2">
                        <input {...register('drawing.ai')} type="checkbox" className="mr-2 toggle toggle-primary my-auto bg-base-300" />
                        Adobe Illustrator
                    </div>
                    <div className="flex flex-row justify-start items-center mb-2">
                        <input {...register('drawing.psd')} type="checkbox" className="mr-2 toggle toggle-primary my-auto bg-base-300" />
                        Adobe Photoshop
                    </div>
                    <div className="flex flex-row justify-start items-center mb-2">
                        <input {...register('drawing.dwg')} type="checkbox" className="mr-2 toggle toggle-primary my-auto bg-base-300" />
                        DWG
                    </div>
                    <div className="flex flex-row justify-start items-center mb-2">
                        <input {...register('drawing.dxf')} type="checkbox" className="mr-2 toggle toggle-primary my-auto bg-base-300" />
                        DXF
                    </div>
                    <div className="flex flex-row justify-start items-center mb-2">
                        <input {...register('drawing.edrw')} type="checkbox" className="mr-2 toggle toggle-primary my-auto bg-base-300" />
                        eDrawing
                    </div>
                    <div className="flex flex-row justify-start items-center mb-2">
                        <input {...register('drawing.jpg')} type="checkbox" className="mr-2 toggle toggle-primary my-auto bg-base-300" />
                        JPEG
                    </div>
                    <div className="flex flex-row justify-start items-center mb-2">
                        <input {...register('drawing.pdf')} type="checkbox" className="mr-2 toggle toggle-primary my-auto bg-base-300" />
                        PDF
                    </div>
                    <div className="flex flex-row justify-start items-center mb-2">
                        <input {...register('drawing.png')} type="checkbox" className="mr-2 toggle toggle-primary my-auto bg-base-300" />
                        PNG
                    </div>
                </div>
                <div className="flex flex-col justify-start items-start">
                    <h1 className="mb-2">Model files</h1>

                    <div className="flex flex-row justify-start items-center mb-2">
                        <input checked readOnly type="checkbox" className="mr-2 toggle toggle-primary my-auto bg-base-300 opacity-30 cursor-not-allowed" />
                        Solidworks Part
                    </div>
                    <div className="flex flex-row justify-start items-center mb-2">
                        <input {...register('part.igs')} type="checkbox" className="mr-2 toggle toggle-primary my-auto bg-base-300" />
                        IGES
                    </div>
                    <div className="flex flex-row justify-start items-center mb-2">
                        <input {...register('part.step')} type="checkbox" className="mr-2 toggle toggle-primary my-auto bg-base-300" />
                        STEP
                    </div>
                    <div className="flex flex-row justify-start items-center mb-2">
                        <input {...register('part.stl')} type="checkbox" className="mr-2 toggle toggle-primary my-auto bg-base-300" />
                        STL
                    </div>
                </div>
            </div>

            <button className="btn btn-primary mt-4">{saveButton}</button>
        </form>

    )
}