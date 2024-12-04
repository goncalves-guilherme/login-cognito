import React, { useState } from 'react';
import { useAppSelector, useAppDispatch } from 'app/hooks';
import { confirmEmail, resendEmailCode } from './auth.slice';
import {TextField, Button, AuthContainer} from 'features/ui';
import ErrorPopup from 'features/ui/popups/error-popup.component';

const EmailVerification: React.FC = () => {
    const [verificationCode, setVerificationCode] = useState('');
    
    const dispatch = useAppDispatch();
    const state = useAppSelector(state => state.auth);
    const loading = state.status === "Loading";

    const error = state.error;

    const handleResendCode = () => {
        dispatch(resendEmailCode(state.credentials.username));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(confirmEmail(verificationCode));
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900">
            <AuthContainer
                title='Email verification'
                description='Verify your email by typing the code sent to your email.'
            >
                {error && <ErrorPopup error={error} />}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <TextField 
                            label='Verification Code:' 
                            onChange={(e) => setVerificationCode(e.target.value)}
                            value={verificationCode} 
                            key='verification-code' 
                            required={true}/>
                    </div>
                    <Button 
                        label='Verify Email' 
                        labelOnDisabled='Verifying...' 
                        key='verify-email-button' 
                        disabled={loading}/>
                </form>
                <div className="mt-6 text-center">
                    <Button
                        label='Resend Code' 
                        labelOnDisabled='Resending Code...' 
                        key='resend-code-button' 
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

export default EmailVerification;
