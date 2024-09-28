export interface ToolType {
    tool_id: number,
    name: string
}

export interface InputCategory {
    tool_input_category_id: number,
    tool_id: number,
    name: string,
    display_title: string
}

export interface ToolInput {
    client_name: string,
    property_name: string,
    tool_input_id: number,
    tool_id: number,
    tool_input_category_id: number,
    type: string,
    group: number,
    required: boolean,
    options: string[]
}

export interface CommonToolInput {
    tool_input_id: number,
    client_name: string,
    property_name: string,
    category_name: string,
    type: string,
    group: number,
    order: number
}

export interface ToolInputRule {
    tool_input_rule_id: number,
    tool_input_id: number,
    tool_input_dependency_id_1: number,
    tool_input_dependency_id_2: number,
    rule_type: string,
    disable: boolean,
    check_value: string
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
    }
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
    straight_flute: boolean
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
    RBottom: number
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