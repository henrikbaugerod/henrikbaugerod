import { createContext, ReactNode, useContext, useEffect, useState } from "react"
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import { ConfigType, ElementType, FormDataType, FormType, SectionType } from "../../types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconName } from "@fortawesome/fontawesome-svg-core";
import './Form1.css';
import Input from "../../components/Input";
import Button from "../../components/Button";
import { flattenEntireSchema, generateZodSchema } from "../../schema";
import { z, ZodObject } from "zod";

type ContextType = {
    config: ConfigType | null;
    formData: FormDataType;
    section: SectionType | null;
    form: FormType | null;
    schema: z.ZodObject<any> | null;
    errors: FormDataType;
    next: () => void;
    prev: () => void;
    updateForm: (name: string, value: string | number) => void;
    updateErrors: (name: string, value: string | number | null) => void;
}

const Context = createContext<ContextType | null>(null);
const useFormContext = () => {
    const context = useContext(Context);
    if (context === null) {
        throw new Error('useFormContext must be used within a FormProvider');
    }
    return context;
}

const FormProvider = ({ children }: { children: ReactNode }) => {
    const [config, setConfig] = useState<ConfigType | null>(null);
    const [formData, setFormData] = useState<FormDataType>({});
    const [schema, setSchema] = useState<ZodObject<any> | null>(null);
    const [errors, setErrors] = useState<FormDataType>({});

    const [section, setSection] = useState<SectionType | null>(null);
    const [form, setForm] = useState<FormType | null>(null);

    const navigate = useNavigate()
    const location = useLocation()
    const params = useParams()

    const fetchConfig = async () => {
        const response = await fetch("/form1.json");
        const data = await response.json();
        setConfig(data);
        setSchema(generateZodSchema(data));
    }

    useEffect(() => {
        fetchConfig();
    }, []);

    const navigateToNextOrPrev = (direction: "next" | "prev") => {
        if (!config) return;

        const sections = config.sections;

        // If no section or form is selected, start with the first section and form
        if (!section || !form) {
            const firstSection = sections[0];
            const firstForm = firstSection.forms[0];
            setSection(firstSection);
            setForm(firstForm);
            navigate(`${firstSection.url}/${firstForm.url}`);
            return;
        }

        const sectionIndex = sections.findIndex(s => s.url === section.url);
        if (sectionIndex === -1) return;

        const currentSection = sections[sectionIndex];
        const forms = currentSection.forms;
        const formIndex = forms.findIndex(f => f.url === form.url);

        if (formIndex === -1) return;

        if (direction === "next") {
            // Navigate to the next form in the current section
            if (formIndex + 1 < forms.length) {
                const nextForm = forms[formIndex + 1];
                setForm(nextForm);
                navigate(`${currentSection.url}/${nextForm.url}`);
                return;
            }
            // Navigate to the first form of the next section
            if (sectionIndex + 1 < sections.length) {
                const nextSection = sections[sectionIndex + 1];
                const nextForm = nextSection.forms[0];
                setSection(nextSection);
                setForm(nextForm);
                navigate(`${nextSection.url}/${nextForm.url}`);
                return;
            }
        } else if (direction === "prev") {
            // Navigate to the previous form in the current section
            if (formIndex > 0) {
                const prevForm = forms[formIndex - 1];
                setForm(prevForm);
                navigate(`${currentSection.url}/${prevForm.url}`);
                return;
            }
            // Navigate to the last form of the previous section
            if (sectionIndex > 0) {
                const prevSection = sections[sectionIndex - 1];
                const prevForm = prevSection.forms[prevSection.forms.length - 1];
                setSection(prevSection);
                setForm(prevForm);
                navigate(`${prevSection.url}/${prevForm.url}`);
                return;
            }
        }

        console.log("No more forms/sections available.");
    };

    useEffect(() => {
        if (config) {
            if (params.section) {
                if (config.sections.filter(section => section.url === params.section).length) {
                    setSection(config.sections.filter(section => section.url === params.section)[0])
                }
            } else {
                setSection(null);
            }

            if (params.form) {
                if (section) {
                    if (section.forms && section.forms.length) {
                        if (section.forms.filter(form => form.url === params.form).length) {
                            setForm(section.forms.filter(form => form.url === params.form)[0])
                        }
                    }
                }
            } else {
                setForm(null)
            }
        }
    }, [location]);

    useEffect(() => {
        if (config) {
            if (params.section) {
                if (config.sections.filter(section => section.url === params.section).length) {
                    setSection(config.sections.filter(section => section.url === params.section)[0])
                }
            } else {
                setSection(null)
            }

            //setSchema(generateValidationSchema(application, formData))
        }
    }, [config]);

    useEffect(() => {
        if (params.form) {
            if (section) {
                if (section.forms && section.forms.length) {
                    if (section.forms.filter(form => form.url === params.form).length) {
                        setForm(section.forms.filter(form => form.url === params.form)[0])
                    }
                }
            }
        } else {
            setForm(null)
        }
    }, [section])

    useEffect(() => {
        console.log("FormData: ", formData);
    }, [formData]);

    return (
        <Context.Provider value={{
            config,
            formData,
            section,
            form,
            schema,
            errors,
            next: () => {
                navigateToNextOrPrev("next")
            },
            prev: () => {
                navigateToNextOrPrev("prev")
            },
            updateForm: (field: string, value: string | number) => {
                setFormData((prev) => {
                    if (value === null) {
                        // If value is null, remove the field from the state object
                        const { [field]: _, ...newFormData } = prev;
                        return newFormData;
                    }

                    // Otherwise, update the state as usual
                    return {
                        ...prev,
                        [field]: value
                    };
                });
            },
            updateErrors: (field: string, value: string | number | null) => {
                setErrors((prev) => {
                    if (value === null) {
                        // If value is null, remove the field from the state object
                        const { [field]: _, ...newErrorsData } = prev;
                        return newErrorsData;
                    }

                    // Otherwise, update the state as usual
                    return {
                        ...prev,
                        [field]: value,
                    };
                });
            },
        }}>
            {config ? children : <h1>Loading...</h1>}
        </Context.Provider>
    )
}


const FormContainer1 = () => (
    <FormProvider>
        <FormMain />
    </FormProvider>
);

const FormMain = () => {
    const { section, form, next } = useFormContext();
    const params = useParams();

    if (!params.section) {
        next();
    }

    if (!section || !form) {
        return <h1>Loading</h1>;
    }

    return (
        <Outlet />
    )
}

const Section1 = () => {
    const { section, form } = useFormContext();

    if (!section || !form) return <h1>Loding...</h1>

    return (
        <div className="d-flex align-items-center justify-content-center min-vh-100 form-background">
            <div className="container">
                <div className="row mt-3">
                    <div className="col-lg-4">
                        <div className="bg-darkblue rounded-3 p-5">
                            <FontAwesomeIcon icon={["far", section.icon as IconName]} className="text-white" style={{ fontSize: '5rem' }} />
                            <h2 className="text-white mt-3">{section.title}</h2>
                            <p>{section.introtext}</p>
                        </div>
                    </div>
                    <div className="col-lg-8">
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>
    )
}

const Form1 = () => {
    const { section, form } = useFormContext();

    if (!section || !form) return <h1>Loding...</h1>

    return (
        <>
            <div className="d-flex gap-1 steps-header">
                {section.forms.map((item, index) => (
                    <StepsItem key={index} {...item} />
                ))}
            </div>
            <div className="bg-white p-5 rounded-bottom-3 rounded-end-3 main-form-background">
                <FormGroup />
            </div>
        </>
    )
}

const FormGroup = () => {
    const { form, section } = useFormContext();
    if (!form || !section) return false;

    return (
        <div className="row">
            {form.elements.map((item, index) => (
                <div className={item.display ?? "col-12"} key={index}>
                    <FormElement {...item} />
                </div>
            ))}

            <Footer />
        </div>
    )
}

const FormElement = (props: ElementType) => {
    const { name, type } = props;
    const { updateForm, updateErrors, formData, schema, section, form, errors } = useFormContext();

    if (!form || !section || !schema) return false;

    const sectionSchema = schema.shape[section.url];
    const formSchema = sectionSchema.shape[form.url];
    const inputSchema = formSchema.shape[name];

    const handleInputChange = (value: string | number) => {
        updateForm(name, value);

        // Validate the input against the schema
        if (inputSchema) {
            const result = inputSchema.safeParse(value);
            if (!result.success) {
                // Add the error to the errors object
                updateErrors(name, result.error.errors[0]?.message || 'Noe er feil');
            } else {
                // Remove the error from the errors object
                updateErrors(name, null);
            }
        }
    };

    switch (type) {
        case 'text':
            return (
                <Input
                    value={formData[name]}
                    onChange={handleInputChange}
                    error={errors[name]}
                    {...props}
                />
            );
    }

    return (
        <p>Form element</p>
    )
}

const StepsItem = (props: FormType) => {
    const { title, url } = props;
    const { section } = useFormContext();
    const params = useParams();

    const formIndex = section?.forms?.findIndex((form) => form.url === url) ?? 0;

    return (
        <div className={`steps-item rounded-top-3 ${params.form === url ? 'bg-white steps-item-active' : 'bg-light'}`}>
            <h6 className="mb-0">Step {formIndex + 1}</h6>
            <span className="small text-muted">{title}</span>
        </div>
    )
}

const Footer = () => {
    const { next, prev, section, form, schema, formData } = useFormContext();
    const [currentValid, setCurrentValid] = useState(false);

    const formIndex = section?.forms.findIndex((item) => item.url === form?.url);
    if (formIndex == null) return false;

    const validateSchema = () => {
        if (schema) {
            const flatSchema = flattenEntireSchema(schema);
            const flatZodSchema = z.object(flatSchema);

            const response = flatZodSchema.safeParse(formData);
            if (response.success) {
                setCurrentValid(true);
            }
        }
    }

    useEffect(() => {
        validateSchema();
    }, [formData]);

    return (
        <div className="row justify-content-between mt-4">
            <div className="col">
                <Button
                    label="Previous"
                    type="light"
                    classes="text-muted"
                    onClick={prev}
                    disabled={formIndex <= 0 ? true : false}
                />
            </div>
            <div className="col-auto">
                <Button
                    label="Next"
                    onClick={next}
                    disabled={!currentValid}
                />
            </div>
        </div>
    )
}

export { FormContainer1, Section1, Form1 };