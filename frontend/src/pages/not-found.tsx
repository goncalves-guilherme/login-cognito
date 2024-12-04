import React from 'react';

const NotFound: React.FC = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="text-center">
                <h1 className="text-4xl font-bold mb-4">404 - Not Found</h1>
                <p className="text-lg mb-4">The page you are looking for does not exist.</p>
                <p className="text-md">
                    Please go back to the previous page or navigate to the home page.
                </p>
            </div>
        </div>
    );
};

export default NotFound;
