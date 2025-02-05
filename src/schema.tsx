import { z, ZodObject, ZodRawShape } from "zod";

export const generateZodSchema = (config: any) => {
    const createFieldSchema = (field: any) => {
        let schema = z.string(); // Default to a string schema

        // Apply validation rules
        if (field.rules) {
            const { min, max, length, required, type } = field.rules;

            if (min !== undefined) schema = schema.min(min, { message: `${field.label} must be at least ${min} characters.` });
            if (max !== undefined) schema = schema.max(max, { message: `${field.label} must be at most ${max} characters.` });
            if (length !== undefined) schema = schema.length(length, { message: `${field.label} must be exactly ${length} characters.` });

            if (type === "email") schema = schema.email({ message: `${field.label} must be a valid email address.` });
        }

        if (field.type === "radio") {
            const options = field.options?.map((opt: any) => opt.value) || [];
            schema = z.enum(options, { message: `${field.label} must be one of ${options.join(", ")}.` });
        }

        if (field.type === "textarea") {
            schema = z.string();
        }

        if (field.rules?.required) {
            schema = schema.nonempty({ message: `${field.label} is required.` });
        }

        return schema;
    };

    const generateFormSchema = (form: any) => {
        const fieldsSchema: Record<string, any> = {};
        form.elements.forEach((field: any) => {
            fieldsSchema[field.name] = createFieldSchema(field);
        });
        return z.object(fieldsSchema);
    };

    const generateSectionSchema = (section: any) => {
        const formsSchema: Record<string, any> = {};
        section.forms.forEach((form: any) => {
            formsSchema[form.url] = generateFormSchema(form);
        });
        return z.object(formsSchema);
    };

    const sectionsSchema: Record<string, any> = {};
    config.sections.forEach((section: any) => {
        sectionsSchema[section.url] = generateSectionSchema(section);
    });

    return z.object(sectionsSchema);
};

export const flattenEntireSchema = (schema: ZodObject<any>): ZodRawShape => {
    const flattenSchema = (currentSchema: ZodRawShape): ZodRawShape => {
        let flatSchema: ZodRawShape = {};
        Object.entries(currentSchema).forEach(([key, value]) => {
            if (value instanceof ZodObject) {
                // If the value is a ZodObject, recursively flatten it
                flatSchema = { ...flatSchema, ...flattenSchema(value.shape) };
            } else if (value._def?.schema?.shape) {
                // If it contains a nested schema definition, recursively flatten it
                flatSchema = { ...flatSchema, ...flattenSchema(value._def.schema.shape) };
            } else {
                // Otherwise, add it directly to the flat schema
                flatSchema[key] = value;
            }
        });
        return flatSchema;
    };

    // Start flattening from the root schema
    return flattenSchema(schema.shape);
};