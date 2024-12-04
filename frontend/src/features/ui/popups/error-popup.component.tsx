import React from 'react';

interface ErrorPopupProps {
  error: string;
}

const ErrorPopup: React.FC<ErrorPopupProps> = ({ error }) => {
  return (
    <div className="flex items-center bg-red-500 text-white font-bold text-xs border-2 border-red-500 rounded-lg p-2 mb-4">
      <img
        src="/icons/alert-icon.svg"
        alt="error message"
        className="w-4 h-4 invert"
      />
      <p className="pl-2">{error}</p>
    </div>
  );
};

export default ErrorPopup;
