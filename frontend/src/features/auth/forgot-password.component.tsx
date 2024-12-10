import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { resetPassword } from './auth.slice';
import {TextField, Button, AuthContainer} from 'features/ui';
import ErrorPopup from 'features/ui/popups/error-popup.component';

const ForgotPassword: React.FC = () => {
    const [username, setUsername] = useState('');

    const dispatch = useAppDispatch();
    const authStatus = useAppSelector(state => state.auth.status);
    const error = useAppSelector(state => state.auth.error);
    const loading = authStatus === "Loading";

    const handleResendCode = () => {
        dispatch(resetPassword(username));
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900">
            <AuthContainer
                title='Forgot Password'
                description='Reset your password by typing your username'
            >
                {error && <ErrorPopup error={error} />}
                <div className="mb-4">
                    <TextField 
                            label='Username:' 
                            onChange={(e) => setUsername(e.target.value)} 
                            key='username' 
                            required={true}
                            placeholder='Type your username'/>
                </div>
                <Button 
                    label='Send Code' 
                    labelOnDisabled='Sending Code...' 
                    key='button' 
                    disabled={loading}
                    onClick={handleResendCode}/>
            </AuthContainer>
        </div>
    );
};

export default ForgotPassword;
