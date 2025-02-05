type InputProps = {
    label: string;
    value: string | number;
    onChange: (value: string) => void;
    error: string | null;
    rules: {
        min: number;
        max: number;
        required: boolean;
    }
}

const Input = (props: InputProps) => {
    const { label, value, onChange, error, rules } = props;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (onChange) {
            onChange(e.target.value);
        }
    }

    return (
        <div className={`form-floating mb-3`}>
            <input
                value={value}
                onChange={handleChange}
                type="email"
                className={`form-control ${value && error ? 'is-invalid' : value ? 'is-valid' : ''}`}
                placeholder="name@example.com"
                maxLength={rules.max ?? 100}
            />
            <label>{label}</label>
            {value && error && (
                <div className="invalid-feedback">
                    {error}
                </div>
            )}
        </div>
    )
}

export default Input;