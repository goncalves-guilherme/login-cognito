import React from 'react';

interface ButtonProps {
    label: string,
    labelOnDisabled?: string,
    disabled?: boolean;
    onClick?: () => void;
    color?: string;
    hoverColor?: string;
}

const Button: React.FC<ButtonProps> = ({
    label,
    labelOnDisabled = '',
    disabled = false,
    onClick,
    color = 'bg-blue-500',
    hoverColor = 'hover:bg-blue-600'
}) => {
    return (
        <button
            type='submit'
            onClick={onClick}
            disabled={disabled}
            className={`w-full ${color} text-white py-2 rounded ${hoverColor} transition-colors duration-200`}
        >
            {disabled ? labelOnDisabled: label}
        </button>
    );
};

export default Button;
