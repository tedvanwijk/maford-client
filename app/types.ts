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
    }
}