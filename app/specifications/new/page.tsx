'use client'

import SpecificationEdit from "@/components/specifications/edit/specificationEdit";
import { Suspense } from "react";

export default function New() {
    return (
        <>
            <h1 className="font-bold text-xl mb-4">New Specification</h1>
            <Suspense>
                <SpecificationEdit viewOnly={false} />
            </Suspense>
        </>
    )
}