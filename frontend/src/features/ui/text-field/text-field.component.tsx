import React from 'react';

interface TextFieldProps {
    label: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    required?: boolean;
    disable?: boolean;
    type?: 'text' | 'email' | 'password';
    value?: string
}

const TextField: React.FC<TextFieldProps> = ({
    label,
    onChange,
    placeholder,
    required = false,
    disable = false,
    type = 'text',
    value
}) => {
    return (
        <>
        <label className="block text-gray-700 mb-2 text-xs font-semibold">
            {label}
        </label>
        <input
            type={type}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            className="w-full p-2 border border-gray-300 rounded hover:border-blue-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            disabled={disable}
            value={value}
        />
        </>
    );
};

export default TextField;
