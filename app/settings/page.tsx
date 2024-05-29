import SettingSection from "@/components/settingSection";
import EditTool from "@/components/settings/EditTool";

export default function Settings() {
    return(
        <>
            <SettingSection header="Add/Edit Tool Series">
                <EditTool />
            </SettingSection>
        </>
    )
}