import React  from 'react';
import { useAppDispatch } from 'app/hooks';
import { logoutUser } from 'features/auth/auth.slice';
import { Button } from 'features/ui';

const Home: React.FC = () => {
    const dispatch = useAppDispatch();

    const handleSignOut = async () => {
        dispatch(logoutUser());
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-2xl font-bold mb-6">Welcome to the home page</h1>

            <div className="w-full max-w-xs px-4">
                <Button label="Logout" onClick={handleSignOut} />
            </div>
        </div>
    );
};

export default Home;
