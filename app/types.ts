export interface ToolType {
    tool_id: number,
    name: string
}

export interface InputCategory {
    tool_input_category_id: number,
    tool_id: number,
    name: string,
    display_title: string,
    tool_inputs: ToolInput[],
    tool_inputs_common: ToolInput[],
    common: boolean
}

export interface ToolInput {
    client_name: string,
    property_name: string,
    tool_input_id: number,
    tool_id?: number,
    tool_input_category_id: number,
    type: string,
    group: number,
    options: string[],
    tool_input_categories?: InputCategory,
    tool_input_rules?: ToolInputRule[],
    min_value?: number,
    max_value?: number
}

export interface ToolInputRule {
    tool_input_rule_id: number,
    tool_input_id: number,
    tool_input_dependency_id_1: number,
    tool_input_dependency_id_2: number,
    rule_type: string,
    disable: boolean,
    check_value: string,
    tool_dependency_inputs_1: ToolInput,
    tool_dependency_inputs_2: ToolInput,
    tool_inputs: ToolInput
}

export interface Specification {
    specification_id: number,
    status: string,
    name: string,
    users: {
        user_id: number,
        admin: boolean,
        name: string
    },
    versions: {
        active: boolean
    },
    tools: {
        name: string
    },
    date_created: Date
}

export interface User {
    user_id: number,
    admin: boolean,
    active: boolean,
    name: string
}

export interface Series {
    series_id: number,
    name: string,
    tool_id: number,
    flute_count: number,
    helix_angle: number,
    tool_series_file_name: string,
    tool_series_inputs: string[],
    tool_series_output_range: string,
    tool_series_input_range: string,
    tools?: ToolType,
    catalog_updated: Date,
    _count?: any,
    straight_flute: boolean,
    active: boolean,
    left_hand_spiral: boolean
}

export interface SeriesInput {
    series_input_id: number,
    series_id: number,
    name: string,
    type: string,
    value: string|null,
    options: string[],
    index: number,
    catalog_index: number
}

export interface CustomParam {
    param_id: number,
    title: string,
    value: string
}

export interface Version {
    version_id: number,
    version_number: string,
    changelog: string,
    active: boolean
}

export interface Step {
    Diameter: number,
    Length: number,
    Angle: number,
    Type: string,
    RTop: number,
    RBottom: number,
    FrontMargin: boolean,
    MiddleMargin: boolean,
    RearMargin: boolean
}

export interface CatalogTool {
    catalog_tool_id: number,
    series_id: number,
    series?: Series,
    tool_number: string,
    data: JSON
}

export interface DefaultValue {
    default_input_value_id: number,
    tool_input_id: number,
    new_tool: boolean,
    value: string,
    tool_inputs?: ToolInput
}

export interface CenterType {
    center_type_id: number,
    name?: string,
    d1_lower?: number,
    d1_upper?: number,
    d2_lower?: number,
    d2_upper?: number,
    a1_lower?: number,
    a1_upper?: number,
    a2_lower?: number,
    a2_upper?: number,
    l_lower?: number,
    l_upper?: number,
    boss_diameter_lower?: number,
    boss_diameter_upper?: number,
    boss_length_lower?: number,
    boss_length_upper?: number
}

export interface CenterInfo {
    LowerCenterType: string,
    UpperCenterType: string
}