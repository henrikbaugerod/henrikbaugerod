export type WebsiteType = {
    title: string;
    url: string;
    thumbnail: string;
}

export type FormDataType = {
    [key: string]: string | number;
}

export type FormItemType = {
    title: string;
    url: string;
    thumbnail: string;
}

// Config
export type ConfigType = {
    title: string;
    introtext: string;
    sections: SectionType[];
}

export type SectionType = {
    title: string;
    url: string;
    icon: string;
    introtext: string;
    forms: FormType[];
}

export type FormType = {
    title: string;
    url: string;
    description: string;
    elements: ElementType[];
}

export type ElementType = {
    type: string;
    label: string;
    name: string;
    placeholder: string;
    display: string;
}