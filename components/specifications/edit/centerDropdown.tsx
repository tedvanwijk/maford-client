import { useFormContext } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { CenterType } from '@/app/types';
import { apiUrl } from '@/lib/api';

export default function CenterDropdown({
    type
}: {
    type: string
}) {
    const [centers, setCenters] = useState<CenterType[]>([]);

    useEffect(() => {
        fetch(
            `${apiUrl}/centers`,
            {
                method: "GET",
                cache: "no-cache"
            }
        )
        .then(res => res.json())
        .then(res => setCenters(res));
    }, [])


    const { register } = useFormContext();
    return(
        // TODO: throws a missing key warning?
        <label className={`form-control w-[200px] transition-opacity`}>
            <div className="label">
                <span>{type === 'Upper' ? 'Upper Center' : 'Lower Center'}</span>
            </div>

            <select className="input input-bordered mr-4" {...register(`Center.${type}Type`)}>
                <option value={''} key="-1">No Center</option>
                {
                    centers.map((e: CenterType) =>
                        <option key={e.center_type_id} value={e.center_type_id}>
                            {e.name}
                        </option>
                    )
                }
            </select>
        </label>
    )
}