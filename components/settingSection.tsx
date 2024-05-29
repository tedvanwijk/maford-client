'use client'

import { useState } from "react";
import { ChevronDown, ChevronUp } from "react-feather";

export default function SettingSection(
    {
        children,
        header
    }: {
        children: React.ReactNode,
        header: string
    }
) {
    const [open, setOpen] = useState(true);
    return (
        <div className="collapse bg-base-200 mb-3">
            <input type="checkbox" checked={open} onChange={(e) => setOpen(e.target.checked)} />
            <div className="collapse-title text-xl font-bold flex flex-row justify-between items-center">
                <div className="mr-3">
                    {header}
                </div>
                {open ? <ChevronUp className="h-full" /> : <ChevronDown className="h-full" />}
            </div>
            <div className="collapse-content w-full">
                {children}
            </div>
        </div>
    )
}