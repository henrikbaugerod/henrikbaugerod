type PropsType = {
    label: string;
    type?: string;
    onClick?: any;
    link?: string;
}

const Button = (props: PropsType) => {
    const { label, type = "primary", onClick, link } = props;

    return (
        link ? (
            <a
                href={link}
                className={`btn btn-${type} rounded-pill px-4 py-2 fw-medium`}
            >
                {label}
            </a>
        ) : (
            <button
                className={`btn btn-${type} rounded-pill px-4 py-2 fw-medium`}
                onClick={onClick}
            >
                {label}
            </button >
        )

    )
}

export default Button;