import SpecificationEdit from "@/components/specificationEdit";

export default function New() {
    return (
        <>
            <h1 className="font-bold text-xl mb-4">New Specification</h1>
            <SpecificationEdit viewOnly={false} />

        </>
    )
}