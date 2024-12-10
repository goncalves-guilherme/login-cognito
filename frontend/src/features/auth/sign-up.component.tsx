import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { registerUser } from './auth.slice';
import { TextField, SecretField, Button, AuthContainer } from 'features/ui';
import ErrorPopup from 'features/ui/popups/error-popup.component';

const SignUp: React.FC = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [passwordConfirmationVisible, setPasswordConfirmationVisible] = useState(false);
    
    const dispatch = useAppDispatch();
    
    const authStatus = useAppSelector(state => state.auth.status);
    const error = useAppSelector(state => state.auth.error);
    const loading = authStatus === "Loading";

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(registerUser(username, password, passwordConfirmation, email));
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900">
            <AuthContainer
                title="Create Account" 
                description="Register a new account"
            >
                <h1 className="text-2xl font-bold mb-6 pl-2 hidden md:block">Your Account</h1>
                {error && <ErrorPopup error={error} />}
                <form onSubmit={handleSubmit}>
                    <div className="mb-2">
                        <TextField 
                                label='Username:' 
                                onChange={(e) => setUsername(e.target.value)} 
                                key='username' 
                                required={true}
                                placeholder='Enter your username'/>
                    </div>
                    <div className="mb-2">
                        <TextField 
                                type='email'
                                label='Email:' 
                                onChange={(e) => setEmail(e.target.value)} 
                                key='email' 
                                required={true}
                                placeholder='Enter your email'/>
                    </div>
                    <div className="mb-3 relative">
                        <SecretField 
                                label='Password:' 
                                required={true} 
                                secretVisible={passwordVisible} 
                                key='password' 
                                onSecretChange={(e) => setPassword(e.target.value)} 
                                onSecretVisibilityChange={() => setPasswordVisible(!passwordVisible)}
                                placeholder='Choose your password' />
                    </div>
                    <div className="mb-3 relative">
                        <SecretField 
                                label='Confirm Password:' 
                                required={true} 
                                secretVisible={passwordConfirmationVisible} 
                                key='confirm-password' 
                                onSecretChange={(e) => setPasswordConfirmation(e.target.value)} 
                                onSecretVisibilityChange={() => setPasswordConfirmationVisible(!passwordConfirmationVisible)} 
                                placeholder='Confirm your password'/>
                    </div>
                    <Button label='Create' labelOnDisabled='Signing Up...' key='button' disabled={loading}/>
                </form>
            </AuthContainer>
        </div>
    );
};

export default SignUp;
