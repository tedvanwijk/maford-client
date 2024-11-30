import SettingSection from "@/components/settings/settingSection";
import EditTool from "@/components/settings/tool/editTool";
import General from "@/components/settings/general";
import Users from "@/components/settings/users";
import Centers from "@/components/settings/centers/centers";
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Settings'
}

export default function Settings() {
    return(
        <>
        <h1 className="text-xl font-bold mb-4">Settings</h1>
            <SettingSection header="Paths">
                <General />
            </SettingSection>
            <SettingSection header="Tool Series">
                <EditTool />
            </SettingSection>
            <SettingSection header="Users">
                <Users />
            </SettingSection>
            <SettingSection header="Centers">
                <Centers />
            </SettingSection>
        </>
    )
}