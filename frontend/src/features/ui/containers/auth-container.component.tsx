import React from 'react';

interface AuthContainerProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

const AuthContainer: React.FC<AuthContainerProps> = ({ title, description, children }) => {
  return (
    <div className="bg-white p-8 rounded shadow-md w-full max-w-4xl flex flex-col md:flex-row h-[600px]">
      {/* Left Column (Title and Description) */}
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center md:h-full md:pr-8 mb-8 md:mb-0">
        <h1 className="text-3xl md:text-5xl text-zinc-900 font-extrabold mb-1 md:mb-2 text-center">
          {title}
        </h1>
        <p className="hidden md:block text-base md:text-lg text-gray-600 text-center">
          {description}
        </p>
      </div>
      
      {/* Right Column (Children) */}
      <div className="w-full md:w-1/2 pl-8 flex flex-col justify-center">
        {children}
      </div>
    </div>
  );
};

export default AuthContainer;
