type PropsType = {
    label: string;
    type?: string;
    onClick?: any;
    link?: string;
    classes?: string;
    disabled?: boolean;
}

const Button = (props: PropsType) => {
    const { label, type = "primary", onClick, link, classes, disabled } = props;

    return (
        link ? (
            <a
                href={link}
                className={`btn btn-${type} rounded-pill px-4 py-2 fw-medium ${classes}`}
            >
                {label}
            </a>
        ) : (
            <button
                className={`btn btn-${type} rounded-pill px-4 py-2 fw-medium ${classes}`}
                onClick={onClick}
                disabled={disabled}
            >
                {label}
            </button >
        )

    )
}

export default Button;