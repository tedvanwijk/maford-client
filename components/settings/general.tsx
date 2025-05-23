'use client'

import { CustomParam } from "@/app/types";
import { apiUrl } from "@/lib/api";
import { Check } from "react-feather";
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

declare module "react" {
    interface InputHTMLAttributes<T> extends HTMLAttributes<T> {
        webkitdirectory?: string;
        directory?: string;
        mozdirectory?: string;
    }
}

export default function General() {
    const [customParams, setCustomParams]: [CustomParam[], Function] = useState([]);
    const [saveButton, setSaveButton] = useState(<>Save</>);
    const { register, setValue, getValues } = useForm({ mode: 'onChange' });;

    useEffect(() => {
        function setValues(customParams: CustomParam[]) {
            setCustomParams(customParams);
            for (let i = 0; i < customParams.length; i++) {
                const customParam = customParams[i];
                setValue(customParam.title, customParam.value);
            }
        }

        fetch(
            `${apiUrl}/custom_params?types=DimensionPath,ExecutablePath,MasterPath,OutputPath,ToolSeriesPath`,
            {
                method: 'GET',
                cache: 'no-cache'
            }
        )
            .then(res => res.json())
            .then(res => setValues(res));
    }, [setValue])

    function submitChanges() {
        const formData = getValues();
        fetch(
            `${apiUrl}/custom_params`,
            {
                method: 'PUT',
                cache: 'no-cache',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
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
        <div>
            <form onSubmit={e => {
                e.preventDefault();
                submitChanges();
            }}>
                <div className='flex flex-row justify-start items-start'>

                    <div className="flex flex-col mb-4 mr-4 w-full">

                        <div className="flex flex-col mb-1">
                            <label className="form-control transition-opacity">
                                <div className="label">
                                    <span>Specification Output Path</span>
                                </div>
                            </label>
                            <input
                                {...register('OutputPath', { required: true })}
                                type="text"
                                placeholder="Enter value"
                                className="input input-bordered w-full"
                            />
                        </div>

                        <div className="flex flex-col mb-1">
                            <label className="form-control transition-opacity">
                                <div className="label">
                                    <span>Master Model Path</span>
                                </div>
                            </label>
                            <input
                                {...register('MasterPath', { required: true })}
                                type="text"
                                placeholder="Enter value"
                                className="input input-bordered w-full"
                            />
                        </div>

                        <div className="flex flex-col mb-1">
                            <label className="form-control transition-opacity">
                                <div className="label">
                                    <span>Solidworks Controller Executable</span>
                                </div>
                            </label>
                            <input
                                {...register('ExecutablePath', { required: true })}
                                type="text"
                                placeholder="Enter value"
                                className="input input-bordered w-full"
                            />
                        </div>

                        <div className="flex flex-col mb-1">
                            <label className="form-control transition-opacity">
                                <div className="label">
                                    <span>Tolerance Excel Files Path</span>
                                </div>
                            </label>
                            <input
                                {...register('ToolSeriesPath', { required: true })}
                                type="text"
                                placeholder="Enter value"
                                className="input input-bordered w-full"
                            />
                        </div>

                        <div className="flex flex-col mb-1">
                            <label className="form-control transition-opacity">
                                <div className="label">
                                    <span>Dimension Insertion Excel File</span>
                                </div>
                            </label>
                            <input
                                {...register('DimensionPath', { required: true })}
                                type="text"
                                placeholder="Enter value"
                                className="input input-bordered w-full"
                            />
                        </div>

                    </div>

                </div>

                <button className="btn btn-primary mr-4">{saveButton}</button>
            </form>
        </div>
    )
}