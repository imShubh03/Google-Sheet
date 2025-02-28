import type { ValidationError } from "./types"

export function validateCellValue(
    value: string,
    dataType?: "text" | "number" | "date" | "boolean",
    validation?: {
        type: "text" | "number" | "date" | "boolean"
        required?: boolean
        min?: number
        max?: number
        pattern?: string
        list?: string[]
    },
): { isValid: boolean; error: ValidationError | null } {
    if (!validation) {
        return { isValid: true, error: null }
    }

    // Check required
    if (validation.required && !value) {
        return {
            isValid: false,
            error: {
                message: "This field is required",
                type: "error",
            },
        }
    }

    // If empty and not required, it's valid
    if (!value) {
        return { isValid: true, error: null }
    }

    // Type validation
    switch (validation.type) {
        case "number":
            const num = Number(value)
            if (isNaN(num)) {
                return {
                    isValid: false,
                    error: {
                        message: "Please enter a valid number",
                        type: "error",
                    },
                }
            }
            if (validation.min !== undefined && num < validation.min) {
                return {
                    isValid: false,
                    error: {
                        message: `Value must be greater than or equal to ${validation.min}`,
                        type: "error",
                    },
                }
            }
            if (validation.max !== undefined && num > validation.max) {
                return {
                    isValid: false,
                    error: {
                        message: `Value must be less than or equal to ${validation.max}`,
                        type: "error",
                    },
                }
            }
            break

        case "date":
            const date = new Date(value)
            if (isNaN(date.getTime())) {
                return {
                    isValid: false,
                    error: {
                        message: "Please enter a valid date",
                        type: "error",
                    },
                }
            }
            break

        case "boolean":
            const boolValue = value.toLowerCase()
            if (boolValue !== "true" && boolValue !== "false") {
                return {
                    isValid: false,
                    error: {
                        message: "Please enter true or false",
                        type: "error",
                    },
                }
            }
            break

        case "text":
            if (validation.pattern) {
                const regex = new RegExp(validation.pattern)
                if (!regex.test(value)) {
                    return {
                        isValid: false,
                        error: {
                            message: "Value does not match the required pattern",
                            type: "error",
                        },
                    }
                }
            }
            if (validation.list && !validation.list.includes(value)) {
                return {
                    isValid: false,
                    error: {
                        message: "Value must be one of the allowed options",
                        type: "error",
                    },
                }
            }
            break
    }

    return { isValid: true, error: null }
}

