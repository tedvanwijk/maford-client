'use client'

import { useForm, FormProvider } from "react-hook-form";
import { useState, useEffect } from "react";
import { apiUrl } from "@/lib/api";
import { Check } from "react-feather";
import { CenterType } from "@/app/types";
import DoubleInput from "./doubleInput";

interface CenterTypeIdOnly {
    center_type_id: number
};

export default function Centers() {
    const [newMode, setNewMode] = useState(true);
    const [centerTypes, setCenterTypes] = useState<CenterType[]>([]);
    const [selectedCenterType, setSelectedCenterType] = useState<CenterType | CenterTypeIdOnly>({ center_type_id: -2 });
    const [applyButton, setApplyButton] = useState(<>Apply</>);
    const disabled = selectedCenterType.center_type_id === -2;
    const formMethods = useForm({ mode: 'onChange', disabled: disabled});

    useEffect(() => {
        fetch(
            `${apiUrl}/centers`,
            {
                method: 'GET',
                cache: 'no-cache'
            }
        )
            .then(res => res.json())
            .then(res => setCenterTypes(res));
    }, []);

    function changeCenterType(c: CenterType, disableButtonUpdate = false) {
        const dimensionNames = [
            'd1',
            'd2',
            'a1',
            'a2',
            'l',
            'boss_diameter',
            'boss_length'
        ];

        if (c === undefined) {
            // if undefined means it's new mode
            setNewMode(true);
            c = {
                center_type_id: -1,
                name: undefined,
                d1_lower: undefined,
                d1_upper: undefined,
                d2_lower: undefined,
                d2_upper: undefined,
                a1_lower: undefined,
                a1_upper: undefined,
                a2_lower: undefined,
                a2_upper: undefined,
                l_lower: undefined,
                l_upper: undefined,
                boss_diameter_lower: undefined,
                boss_diameter_upper: undefined,
                boss_length_lower: undefined,
                boss_length_upper: undefined
            }
            if (!disableButtonUpdate) setApplyButton(<>Create</>);
        } else {
            setNewMode(false);
            if (!disableButtonUpdate) setApplyButton(<>Apply</>);
        }

        setSelectedCenterType(c)
        const centerType = c as unknown as { [key: string]: any[] };

        for (let d of dimensionNames) {
            const lowerValue = centerType[`${d}_lower`];
            const upperValue = centerType[`${d}_upper`];
            formMethods.setValue(`${d}_upper`, upperValue);
            if (lowerValue !== upperValue) {
                formMethods.setValue(`${d}_lower`, lowerValue);
                formMethods.setValue(`${d}_tolerance`, true);
            } else {
                formMethods.setValue(`${d}_lower`, undefined);
                formMethods.setValue(`${d}_tolerance`, false);
            }
        }
        formMethods.setValue('name', c.name);
    }

    async function submitChanges() {
        const formData = formMethods.getValues();

        let changedCenter;
        if (newMode) {
            changedCenter = await fetch(
                `${apiUrl}/centers`,
                {
                    method: 'POST',
                    cache: 'no-cache',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                }
            )
                .then(res => {
                    if (res.status === 201) {
                        setApplyButton(<>Created<Check /></>);
                        setTimeout(() => setApplyButton(<>Apply</>), 3000);
                    } else {
                        setApplyButton(<>Failed</>);
                        setTimeout(() => setApplyButton(<>Apply</>), 3000);
                    }
                    return res.json();
                })
        } else {
            changedCenter = await fetch(
                `${apiUrl}/centers/${selectedCenterType.center_type_id}`,
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
                        setApplyButton(<>Applied<Check /></>);
                        setTimeout(() => setApplyButton(<>Apply</>), 3000);
                    } else {
                        setApplyButton(<>Applying failed</>);
                        setTimeout(() => setApplyButton(<>Apply</>), 3000);
                    }
                    return res.json();
                })
        }

        await fetch(
            `${apiUrl}/centers`,
            {
                method: 'GET',
                cache: 'no-cache'
            }
        )
            .then(res => res.json())
            .then(res => {
                setCenterTypes(res);
            })
            .then(() => changeCenterType(changedCenter, true));
    }

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                submitChanges();
            }}
            className="flex flex-col"
        >
            <FormProvider {...formMethods}>
                <div className="flex flex-row justify-start items-start mb-2">
                    <select value={selectedCenterType?.center_type_id} onChange={e => changeCenterType(centerTypes.filter((ee: CenterType) => ee.center_type_id === parseInt(e.target.value))[0])} className="input input-bordered mr-4">
                        {
                            centerTypes.map((e: CenterType) => (
                                <option value={e.center_type_id} key={e.center_type_id}>{e.name}</option>
                            ))
                        }
                        <option value={-1}>Add new</option>
                        <option value={-2} disabled hidden>Select Center Type</option>
                    </select>
                </div>

                <hr className="my-2 border-neutral" />

                <div className='flex flex-row justify-start items-start'>
                    <div className='flex flex-col justify-start items-start mr-5'>
                        <label className={`form-control w-[200px] transition-opacity mb-12`} key="name">
                            <div className="label">
                                <span>Name</span>
                            </div>
                            <input
                                {...formMethods.register("name", { disabled })}
                                type="text"
                                placeholder="Enter value"
                                className="input input-bordered w-full"
                            />
                        </label>
                        <DoubleInput name="d1" displayName="D1" disabled={disabled} />
                        <DoubleInput name="d2" displayName="D2" disabled={disabled} />
                    </div>
                    <div className='flex flex-col justify-start items-start mr-5'>
                        <DoubleInput name="a1" displayName="A1" disabled={disabled} />
                        <DoubleInput name="a2" displayName="A2" disabled={disabled} />
                        <DoubleInput name="l" displayName="L" disabled={disabled} />
                    </div>
                    <div className='flex flex-col justify-start items-start mr-5'>
                        <DoubleInput name="boss_diameter" displayName="Boss Diameter" disabled={disabled} />
                        <DoubleInput name="boss_length" displayName="Boss Length" disabled={disabled} />
                    </div>
                </div>
            </FormProvider>

            <div className="flex flex-row mt-4">
                <button type="submit" disabled={disabled} className={`${disabled ? 'opacity-30 pointer-events-none' : ''} btn btn-primary mr-4`}>
                    {applyButton}
                </button>
            </div>
        </form>
    )
}