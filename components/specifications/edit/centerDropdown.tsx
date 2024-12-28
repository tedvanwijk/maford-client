import { useFormContext } from 'react-hook-form';
import { CenterType } from '@/app/types';

export default function CenterDropdown({
    type,
    centers
}: {
    type: string,
    centers: CenterType[]
}) {
    const { register } = useFormContext();
    return(
        <label className={`form-control w-[200px] transition-opacity`}>
            <div className="label">
                <span>{type === 'Upper' ? 'Upper Center' : 'Lower Center'}</span>
            </div>

            <select className="input input-bordered mr-4 appearance-auto" {...register(`Center.${type}CenterType`)}>
                <option value={'-1'} key="-1">No Center</option>
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