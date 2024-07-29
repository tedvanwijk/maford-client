import SettingSection from "@/components/settings/settingSection";
import EditTool from "@/components/settings/tool/editTool";
import General from "@/components/settings/general";
import Users from "@/components/settings/users";

export default function Settings() {
    return(
        <>
        <h1 className="text-xl font-bold mb-4">Settings</h1>
            <SettingSection header="General">
                <General />
            </SettingSection>
            <SettingSection header="Add/Edit Tool Series">
                <EditTool />
            </SettingSection>
            <SettingSection header="Add/Remove User">
                <Users />
            </SettingSection>
        </>
    )
}