import React, { useState } from 'react';
import { useAppSelector, useAppDispatch } from 'app/hooks';
import { resetPassword, confirmResetPassword } from './auth.slice';
import {TextField, SecretField, Button, AuthContainer} from 'features/ui';
import ErrorPopup from 'features/ui/popups/error-popup.component';

const ResetPassword: React.FC = () => {
    const [newPassword, setNewPassword] = useState('');
    const [newPasswordVisible, setNewPasswordVisible] = useState(false);
    const [verificationCode, setVerificationCode] = useState('');
    
    const dispatch = useAppDispatch();

    const authStatus = useAppSelector(state => state.auth.status);
    const username = useAppSelector(state => state.auth.credentials.username);
    const error = useAppSelector(state => state.auth.error);
    const loading = authStatus === "Loading";

    const handleResendCode = () => {
        dispatch(resetPassword(username));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(confirmResetPassword(username, newPassword, verificationCode))
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900">
            <AuthContainer
                title='Reset password'
                description='Type your code and reset your password'
            >
                {error && <ErrorPopup error={error} />}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <TextField 
                            label='Username:' 
                            key='username' 
                            required={true}
                            disable={true}
                            value={username}/>
                    </div>
                    <div className="mb-4">
                        <TextField 
                            label='Verification Code:' 
                            onChange={(e) => setVerificationCode(e.target.value)} 
                            key='verification-code' 
                            required={true}
                            placeholder='Verification code received by email'/>
                    </div>
                    <div className="mb-6 relative">
                        <SecretField 
                                label='New Password:' 
                                required={true} 
                                secretVisible={newPasswordVisible} 
                                key='password' 
                                onSecretChange={(e) => setNewPassword(e.target.value)} 
                                onSecretVisibilityChange={() => setNewPasswordVisible(!newPasswordVisible)} 
                                placeholder='Type your new password'/>
                    </div>
                    <Button 
                        label='Reset Password' 
                        labelOnDisabled='Resetting Password...' 
                        key='button-submit' 
                        disabled={loading}/>
                </form>
             
                <div className="mt-6 text-center">
                    <Button
                        label="Resend Code"
                        labelOnDisabled="Resending Code..."
                        key="button-resend-code"
                        disabled={loading}
                        onClick={handleResendCode}
                        color='bg-gray-400'
                        hoverColor='hover:bg-gray-500'
                    />
                </div>
            </AuthContainer>
        </div>
    );
};

export default ResetPassword;
