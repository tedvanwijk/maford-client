import SpecificationEdit from "@/components/specifications/edit/specificationEdit";
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'New Specification'
}

export default function New() {
    return (
        <>
            <h1 className="font-bold text-xl mb-4">New Specification</h1>
            <SpecificationEdit viewOnly={false} />
        </>
    )
}