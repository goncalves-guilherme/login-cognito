import React from 'react';
import TextField from '../text-field/text-field.component';

interface SecretFieldProps {
    label: string;
    secretVisible: boolean;
    onSecretChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSecretVisibilityChange: () => void;
    placeholder?: string;
    required?: boolean;
}

const SecretField: React.FC<SecretFieldProps> = ({
    label,
    secretVisible,
    onSecretChange,
    onSecretVisibilityChange,
    placeholder,
    required = false,
}) => {
    return (
        <>
            <TextField 
                type={secretVisible ? 'text' : 'password'}
                label={label} 
                onChange={onSecretChange} 
                required = {required}
                placeholder={placeholder}
            />

            <button
                type="button"
                onClick={onSecretVisibilityChange}
                className="absolute right-2 top-11 transform -translate-y-1/2"
            >
                {secretVisible ? (
                    <img src="/icons/eye-icon-visible.svg" alt="eye icon visible" className="w-6 h-6" />
                ) : (
                    <img src="/icons/eye-icon-hidden.svg" alt="eye icon hidden" className="w-6 h-6" />
                )}
            </button>
        </>
    );
};

export default SecretField;
