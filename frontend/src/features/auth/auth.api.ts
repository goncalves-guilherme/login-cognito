import * as Auth from 'aws-amplify/auth';
import {Logger as log} from 'shared/logger';

export type SignInParameters = {
    username: string;
    password: string;
};

export type SignUpParameters = {
    username: string;
    password: string;
    email: string;
};

export type ResetPasswordParameters = {
    username: string;
};

export type ConfirmPasswordResetParameters = {
    username: string; 
    newPassword: string; 
    confirmationCode: string;
}

export type ConfirmEmailParameters = {
    username: string;
    password: string;
    confirmationCode: string;
};

export type AuthApiOutput = {
    nextStep: NextStep
}

export interface IAuthAPI {
    signIn({ username, password }: SignInParameters): Promise<AuthApiOutput>;
    signUp({ username, email, password }: SignUpParameters): Promise<AuthApiOutput>;
    resetPassword({ username }: ResetPasswordParameters): Promise<AuthApiOutput>;
    confirmPasswordCode({ username, newPassword, confirmationCode }: ConfirmPasswordResetParameters): Promise<AuthApiOutput>;
    confirmEmail({ username, password, confirmationCode }: ConfirmEmailParameters): Promise<AuthApiOutput>;
    resendEmailCode(username: string): Promise<AuthApiOutput>;
    signOut(): Promise<AuthApiOutput>;
    getAccessToken(): Promise<string | null>;
}

export type NextStep = 'RESET_PASSWORD' | 'CONFIRM_EMAIL' | 'DONE' | 'UNKNOWN' | 'NOT_AUTHENTICATED';

function mapSignInOutputToNextStep(singInOutput: Auth.SignInOutput): NextStep{
    switch(singInOutput.nextStep.signInStep){
        case 'CONFIRM_SIGN_UP':
            return 'CONFIRM_EMAIL';
        case 'RESET_PASSWORD':
            return 'RESET_PASSWORD';
        case 'CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED':
            return 'RESET_PASSWORD';
        case 'DONE':
            return 'DONE';
        default:
            return 'UNKNOWN';
    }
}

function mapSignUpOutputToNextStep(singUpOutput: Auth.SignUpOutput | Auth.ConfirmSignUpOutput): NextStep{
    switch(singUpOutput.nextStep.signUpStep){
        case 'CONFIRM_SIGN_UP':
            return 'CONFIRM_EMAIL';
        case 'DONE':
            return 'DONE';
        default:
            return 'UNKNOWN';
    }
}

function mapResetPasswordOutputToNextStep(singUpOutput: Auth.ResetPasswordOutput): NextStep{
    switch(singUpOutput.nextStep.resetPasswordStep){
        case 'CONFIRM_RESET_PASSWORD_WITH_CODE':
            return 'RESET_PASSWORD';
        case 'DONE':
            return 'DONE';
        default:
            return 'UNKNOWN';
    }
}

export const AuthApi: IAuthAPI = {
    async signIn({ username, password } : SignInParameters): Promise<AuthApiOutput> {

        try {
            const singInOutput = await Auth.signIn({
                username: username,
                password: password,
            });
    
            return {nextStep: mapSignInOutputToNextStep(singInOutput)};
            
        } 
        catch(error: any) {
            log.error(error);
    
            switch(error.name){
                case 'UserNotFoundException':
                case 'NotAuthorizedException': 
                    throw new Error(error.message);
                default:
                    throw new Error('An unexpected error occurred during sign-in. Please try again later.');
            } 
        }
    },
    async signUp({ username, email, password } : SignUpParameters) : Promise<AuthApiOutput> {
    
        try{
            const singUpOutput = await Auth.signUp({
                username,
                password,
                options: {
                    userAttributes: {
                      email: email,
                    },
                  }
              });
        
            return { nextStep: mapSignUpOutputToNextStep(singUpOutput) };
        }
        catch(error: any) {
            log.error(error);
    
            switch(error.name){
                case 'InvalidPasswordException':
                case 'UsernameExistsException':
                case 'UserLambdaValidationException':
                    if (error.message.includes("Email already exists")) {
                        throw new Error("Email already exists");
                    } else {
                        throw new Error(error.message);
                    }
                default:
                    throw new Error('An unexpected error occurred during sign-up. Please try again later.');
            } 
        }
        
    },
    async resetPassword({ username }: ResetPasswordParameters): Promise<AuthApiOutput> {
    
        try {
            const resetPasswordOutput = await Auth.resetPassword({ username });
            return { nextStep: mapResetPasswordOutputToNextStep(resetPasswordOutput) };
        }
        catch(error: any) {
            log.error(error);
    
            if(error.name === 'UserNotFoundException') {
                throw new Error(error.message);
            }
            else {
                throw new Error('An unexpected error occurred during password reset. Please try again later.');
            }
        }
    },
    async confirmPasswordCode({username, newPassword, confirmationCode}: ConfirmPasswordResetParameters): Promise<AuthApiOutput> {
        try {
            await Auth.confirmResetPassword({username, newPassword, confirmationCode});
            return { nextStep: 'DONE' };
        }
        catch(error: any) {
            log.error(error);
    
            switch (error.name) {
                case 'ExpiredCodeException':
                case 'UserNotConfirmedException':
                case 'UserNotFoundException':
                    throw new Error(error.message);
            
                default:
                    throw new Error('An unexpected error occurred while confirming password reset. Please try again later.');
            }
        }
    },
    async confirmEmail({ username, password, confirmationCode }: ConfirmEmailParameters): Promise<AuthApiOutput> {
    
        try {
            const confirmSignUpOutput = await Auth.confirmSignUp({username, confirmationCode});
    
            if(confirmSignUpOutput.nextStep.signUpStep === 'DONE') {
    
                return this.signIn({username, password});
            }
            
            return { nextStep: mapSignUpOutputToNextStep(confirmSignUpOutput) };
        }
        catch(error: any) {
            log.error(error);
    
            switch (error.name) {
                case 'UserNotFoundException':
                case 'ExpiredCodeException':
                case 'CodeMismatchException':
                    throw new Error(error.message);
            
                default:
                    throw new Error('An unexpected error occurred while confirming email. Please try again later.');
            }
        }
    },
    async resendEmailCode(username: string): Promise<AuthApiOutput> {
        try {
            await Auth.resendSignUpCode({username});
    
            return { nextStep: 'CONFIRM_EMAIL' };
        }
        catch(error: any) {
            log.error(error);
    
            if(error.name === 'UserNotFoundException') {
                throw new Error(error.message);
            } else {
                throw new Error('An unexpected error occurred while confirming email. Please try again later.');
            }
        }
    },
    async signOut() {
        try {
            await Auth.signOut();

            return { nextStep: 'NOT_AUTHENTICATED' };
        }
        catch(error: any) {
            log.error(error);
            
            throw new Error('Something went wrong. Please try again later.');
        }
    },
    async getAccessToken(): Promise<string | null> {
        const session = await Auth.fetchAuthSession();

        const accessToken = session.tokens?.accessToken?.toString();
    
        if(accessToken == null || accessToken?.trim() === '') {
            return null;
        }
    
        return accessToken;
    }
}