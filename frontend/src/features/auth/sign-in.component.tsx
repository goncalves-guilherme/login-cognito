import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from 'app/hooks';
import { authenticateUser } from './auth.slice';
import { TextField, SecretField, Button, AuthContainer } from 'features/ui';
import ErrorPopup from 'features/ui/popups/error-popup.component';

const SignIn: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);

    const dispatch = useAppDispatch();
    
    const authStatus = useAppSelector(state => state.auth.status);
    const error = useAppSelector(state => state.auth.error);
    const loading = authStatus === "Loading";

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(authenticateUser(username, password));
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900">
            <AuthContainer 
                title="Sign In" 
                description="Enter your credentials to access your account"
            >
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <TextField 
                            label="Username:" 
                            onChange={(e) => setUsername(e.target.value)} 
                            value={username} 
                            required
                            placeholder='Username or email address'
                        />
                    </div>
                    <div className="relative">
                        <SecretField 
                            label="Password:" 
                            value={password} 
                            required 
                            secretVisible={passwordVisible} 
                            onSecretChange={(e) => setPassword(e.target.value)} 
                            onSecretVisibilityChange={() => setPasswordVisible(!passwordVisible)}
                            placeholder='Password'
                        />
                    </div>
                    <p className="text-xs mb-6">
                        <Link to="/forgot-password" className="text-blue-500 hover:underline">
                            Forgot Password?
                        </Link>
                    </p>
                    {error && <ErrorPopup error={error} />}
                    <Button label="Sign in" labelOnDisabled="Signing in..." disabled={loading} />
                </form>
                <p className="mt-4 text-center text-xs">
                    Don't have an account?
                    <Link to="/sign-up" className="text-blue-500 hover:underline ml-2">Signup here</Link>
                </p>
            </AuthContainer>
        </div>
    );
};

export default SignIn;
