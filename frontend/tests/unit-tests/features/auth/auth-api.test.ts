import { AuthApiOutput, NextStep, AuthApi } from '../../../../src/features/auth/auth.api';
import * as Auth from 'aws-amplify/auth';

jest.mock('../../../../src/shared/logger', () => {
  const mockLogger = {
    log: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    info: jest.fn(),
  };

  return {
    Logger: mockLogger,
  };
});

jest.mock('aws-amplify/auth', () => ({
  signIn: jest.fn(),
  signUp: jest.fn(),
  resetPassword: jest.fn(),
  confirmResetPassword: jest.fn(),
  confirmSignUp: jest.fn(),
  resendSignUpCode: jest.fn(),
  signOut: jest.fn(),
  fetchAuthSession: jest.fn(),
}));

const mockAmplify = {
  mockSignIn: Auth.signIn as jest.MockedFunction<typeof Auth.signIn>,
  mockSignUp: Auth.signUp as jest.MockedFunction<typeof Auth.signUp>,
  mockResetPassword: Auth.resetPassword as jest.MockedFunction<typeof Auth.resetPassword>,
  mockConfirmResetPassword: Auth.confirmResetPassword as jest.MockedFunction<typeof Auth.confirmResetPassword>,
  mockConfirmSignUp: Auth.confirmSignUp as jest.MockedFunction<typeof Auth.confirmSignUp>,
  mockResendSignUpCode: Auth.resendSignUpCode as jest.MockedFunction<typeof Auth.resendSignUpCode>,
  mockSignOut: Auth.signOut as jest.MockedFunction<typeof Auth.signOut>,
  mockFetchAuthSession: Auth.fetchAuthSession as jest.MockedFunction<typeof Auth.fetchAuthSession>
};

function configureApiError(message: string, name: string){
    const apiError = new Error(message);
    apiError.name = name;

    mockAmplify.mockSignIn.mockRejectedValue(apiError);
    mockAmplify.mockSignUp.mockRejectedValue(apiError);
    mockAmplify.mockResetPassword.mockRejectedValue(apiError);
    mockAmplify.mockConfirmResetPassword.mockRejectedValue(apiError);
    mockAmplify.mockConfirmSignUp.mockRejectedValue(apiError);
    mockAmplify.mockResendSignUpCode.mockRejectedValue(apiError);
    mockAmplify.mockSignOut.mockRejectedValue(apiError);
}

describe('auth.api', () => {

  describe('signIn', () => {
    const username = 'testuser';
    const password = 'testpassword';
  
    test.each(
      [
        { amplifyNextStep: 'DONE', domainNextStep: 'DONE'},
        { amplifyNextStep: 'CONFIRM_SIGN_UP', domainNextStep: 'CONFIRM_EMAIL'},
        { amplifyNextStep: 'RESET_PASSWORD', domainNextStep: 'RESET_PASSWORD'},
        { amplifyNextStep: 'CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED', domainNextStep: 'RESET_PASSWORD'},
        { amplifyNextStep: 'CONFIRM_SIGN_IN_WITH_CUSTOM_CHALLENGE', domainNextStep: 'UNKNOWN'},
        { amplifyNextStep: 'CONTINUE_SIGN_IN_WITH_MFA_SELECTION', domainNextStep: 'UNKNOWN'},
        { amplifyNextStep: 'CONFIRM_SIGN_IN_WITH_SMS_CODE', domainNextStep: 'UNKNOWN'},
        { amplifyNextStep: 'CONFIRM_SIGN_IN_WITH_TOTP_CODE', domainNextStep: 'UNKNOWN'},
        { amplifyNextStep: 'CONTINUE_SIGN_IN_WITH_TOTP_SETUP', domainNextStep: 'UNKNOWN'},
      ])
      ('should sign in a user successfully', async (params) => { 
        // Arrange
        const singInOutputMock: Auth.SignInOutput = {
            isSignedIn: false, 
            nextStep: {signInStep: params.amplifyNextStep as any}
        };
        mockAmplify.mockSignIn.mockResolvedValue(singInOutputMock);
  
        const expectedResult: AuthApiOutput = { nextStep: params.domainNextStep as NextStep};
  
        // Act
        const result = await AuthApi.signIn({ username, password });
  
        // Assert
        expect(result).toEqual(expectedResult);
        expect(mockAmplify.mockSignIn).toHaveBeenCalledWith({ username, password });
    });
  
    it('should throw an error if the user is not found', async () => {
      // Arrange
      const expectedMessage = 'User not found';
      configureApiError(expectedMessage, 'UserNotFoundException');
      const expectedError = new Error(expectedMessage);
  
      // Act
      const action = AuthApi.signIn({ username, password });
      
      // Assert
      await expect(action).rejects.toThrow(expectedError);
    });
  
    it('should throw an error if not authorized', async () => {
      // Arrange
      const expectedMessage = 'Not authorized';
      configureApiError(expectedMessage, 'NotAuthorizedException');
      const expectedError = new Error(expectedMessage);
  
      // Act
      const action = AuthApi.signIn({ username, password });
      
      // Assert
      await expect(action).rejects.toThrow(expectedError);
    });
  
    it('should throw a generic error for other cases', async () => {
      // Arrange
      configureApiError('Unexpected message', 'UnExpected');
      const expectedError = new Error(
          'An unexpected error occurred during sign-in. Please try again later.');
  
      // Act
      const action = AuthApi.signIn({ username, password });
      
      // Assert
      await expect(action).rejects.toThrow(expectedError);
    });
  });
  
  describe('signUp', () => {
    const username = 'testuser';
    const email = 'testuser@example.com';
    const password = 'testpassword';
    
    test.each(
      [
        { amplifyNextStep: 'DONE', domainNextStep: 'DONE' },
        { amplifyNextStep: 'CONFIRM_SIGN_UP', domainNextStep: 'CONFIRM_EMAIL' },
        { amplifyNextStep: 'COMPLETE_AUTO_SIGN_IN', domainNextStep: 'UNKNOWN' },
      ])
      ('should sign up a user successfully', async (params) => {
        // Arrange
        const signUpOutputMock: Auth.SignUpOutput = 
        {
          isSignUpComplete: false,
          nextStep: { signUpStep: params.amplifyNextStep as any }
        };
        mockAmplify.mockSignUp.mockResolvedValue(signUpOutputMock);
  
        const expectedResult: AuthApiOutput = { nextStep: params.domainNextStep as NextStep };
  
        const expectedParameters = {
          username,
          password,
          options: {
              userAttributes: {
                  email,
              },
          }
        };
  
        // Act
        const result = await AuthApi.signUp({ username, email, password });
  
        // Assert
        expect(result).toEqual(expectedResult);
        expect(mockAmplify.mockSignUp).toHaveBeenCalledWith(expectedParameters);
    });
  
    it('should throw an error if the password is invalid', async () => {
      // Arrange
      const expectedMessage = 'Invalid password';
      configureApiError(expectedMessage, 'InvalidPasswordException');
      const expectedError = new Error(expectedMessage);
  
      // Act
      const action = AuthApi.signUp({ username, email, password });
      
      // Assert
      await expect(action).rejects.toThrow(expectedError);
    });
  
    it('should throw an error if the username already exists', async () => {
      // Arrange
      const expectedMessage = 'Username already exists';
      configureApiError(expectedMessage, 'UsernameExistsException');
      const expectedError = new Error(expectedMessage);
  
      // Act
      const action = AuthApi.signUp({ username, email, password });
      
      // Assert
      await expect(action).rejects.toThrow(expectedError);
    });
  
    it('should throw a generic error for other cases', async () => {
      // Arrange
      configureApiError('Unexpected message', 'UnExpected');
      const expectedError = new Error(
          'An unexpected error occurred during sign-up. Please try again later.');
  
      // Act
      const action = AuthApi.signUp({ username, email, password });
      
      // Assert
      await expect(action).rejects.toThrow(expectedError);
    });
  });
  
  describe('resetPassword', () => {
    const username = 'myuser';
  
    test.each([
        { amplifyNextStep: 'DONE', domainNextStep: 'DONE' },
        { amplifyNextStep: 'CONFIRM_RESET_PASSWORD_WITH_CODE', domainNextStep: 'RESET_PASSWORD' },
    ])('should reset password successfully', async (params) => {
        // Arrange
        const resetPasswordOutputMock: Auth.ResetPasswordOutput = 
        {
            isPasswordReset: false,
            nextStep: { 
              codeDeliveryDetails: {},
              resetPasswordStep: params.amplifyNextStep as any 
            }
        };
        mockAmplify.mockResetPassword.mockResolvedValue(resetPasswordOutputMock);
  
        const expectedResult: AuthApiOutput = { nextStep: params.domainNextStep as NextStep };
  
        // Act
        const result = await AuthApi.resetPassword({ username });
  
        // Assert
        expect(result).toEqual(expectedResult);
        expect(mockAmplify.mockResetPassword).toHaveBeenCalledWith({ username });
    });
  
    it('should throw an error if user not found', async () => {
        // Arrange
        const expectedMessage = 'User not found';
        configureApiError(expectedMessage, 'UserNotFoundException');
        const expectedError = new Error(expectedMessage);
  
        // Act
        const action = AuthApi.resetPassword({ username });
  
        // Assert
        await expect(action).rejects.toThrow(expectedError);
    });
  
    it('should throw a generic error for other cases', async () => {
        // Arrange
        configureApiError('Unexpected message', 'UnExpected');
        const expectedError = new Error(
            'An unexpected error occurred during password reset. Please try again later.');
  
        // Act
        const action = AuthApi.resetPassword({ username });
  
        // Assert
        await expect(action).rejects.toThrow(expectedError);
    });
  });
  
  describe('confirmPasswordCode', () => {
    const username = 'testuser';
    const newPassword = 'newpassword';
    const confirmationCode = '123456';
  
    it('should confirm password successfully', async () => {
        // Arrange
        mockAmplify.mockConfirmResetPassword.mockResolvedValue();
  
        const expectedResult: AuthApiOutput = { nextStep: 'DONE' };
  
        // Act
        const result = await AuthApi.confirmPasswordCode({ username, newPassword, confirmationCode });
  
        // Assert
        expect(result).toEqual(expectedResult);
        expect(mockAmplify.mockConfirmResetPassword).toHaveBeenCalledWith({ username, newPassword, confirmationCode });
    });
  
    test.each([
      { errorType: 'ExpiredCodeException', expectedMessage: 'Code expired' },
      { errorType: 'UserNotConfirmedException', expectedMessage: 'User not confirmed' },
      { errorType: 'UserNotFoundException', expectedMessage: 'User not found' }
    ])('should throw an error for $errorType', async ({ errorType, expectedMessage }) => {
        // Arrange
        configureApiError(expectedMessage, errorType);
        const expectedError = new Error(expectedMessage);
  
        // Act
        const action = AuthApi.confirmPasswordCode({ username, newPassword, confirmationCode });
  
        // Assert
        await expect(action).rejects.toThrow(expectedError);
    });
  
    it('should throw a generic error for other cases', async () => {
        // Arrange
        configureApiError('Unexpected message', 'UnExpected');
        const expectedError = new Error('An unexpected error occurred while confirming password reset. Please try again later.');
  
        // Act
        const action = AuthApi.confirmPasswordCode({ username, newPassword, confirmationCode });
  
        // Assert
        await expect(action).rejects.toThrow(expectedError);
    });
  });
  
  
  describe('confirmEmail', () => {
    const username = 'testuser';
    const password = 'hardsecret';
    const confirmationCode = '123456';
  
    test.each([
        { amplifyNextStep: 'CONFIRM_SIGN_UP', domainNextStep: 'CONFIRM_EMAIL' },
        { amplifyNextStep: 'UNKNOWN', domainNextStep: 'UNKNOWN' },
    ])('should confirm email successfully', async (params) => {
        // Arrange
        const confirmSignUpOutputMock: Auth.ConfirmSignUpOutput = {
            isSignUpComplete: true,
            nextStep: {signUpStep: params.amplifyNextStep as any },
        };
        mockAmplify.mockConfirmSignUp.mockResolvedValue(confirmSignUpOutputMock);
  
        const expectedResult: AuthApiOutput = { nextStep: params.domainNextStep as NextStep };
  
        // Act
        const result = await AuthApi.confirmEmail({ username, password, confirmationCode });
  
        // Assert
        expect(result).toEqual(expectedResult);
        expect(mockAmplify.mockConfirmSignUp).toHaveBeenCalledWith({ username, confirmationCode });
    });

    it('should call signIn when the nextStep is DONE', async () => {
      // Arrange
      const confirmSignUpOutputMock: Auth.ConfirmSignUpOutput  = {
        isSignUpComplete: true,
        nextStep: { signUpStep: 'DONE' },
      };

      mockAmplify.mockConfirmSignUp.mockResolvedValue(confirmSignUpOutputMock);

      const singInOutputMock: Auth.SignInOutput  = {
        isSignedIn: false, 
        nextStep: {signInStep: 'DONE'}
      };
    
      mockAmplify.mockSignIn.mockResolvedValue(singInOutputMock);
  
      // Act
      await AuthApi.confirmEmail({ username, password, confirmationCode });
  
      // Assert
      expect(mockAmplify.mockSignIn).toHaveBeenCalledWith({ username, password });
    });
  
    test.each([
        { errorType: 'UserNotFoundException', expectedMessage: 'User not found' },
        { errorType: 'ExpiredCodeException', expectedMessage: 'Code expired' }
    ])('should throw an error for $errorType', async ({ errorType, expectedMessage }) => {
        // Arrange
        configureApiError(expectedMessage, errorType);
        const expectedError = new Error(expectedMessage);
  
        // Act
        const action = AuthApi.confirmEmail({ username, password, confirmationCode });
  
        // Assert
        await expect(action).rejects.toThrow(expectedError);
    });
  
    it('should throw a generic error for other cases', async () => {
        // Arrange
        configureApiError('Unexpected message', 'UnexpectedException');
        const expectedError = new Error('An unexpected error occurred while confirming email. Please try again later.');
  
        // Act
        const action = AuthApi.confirmEmail({ username, password, confirmationCode });
  
        // Assert
        await expect(action).rejects.toThrow(expectedError);
    });
  });
  
  describe('resendEmailCode', () => {
    const username = 'testuser';
  
    it('should resend email code successfully', async () => {
        // Arrange
        mockAmplify.mockResendSignUpCode.mockResolvedValue({});
        const expectedResult: AuthApiOutput = { nextStep: 'CONFIRM_EMAIL' };
  
        // Act
        const result = await AuthApi.resendEmailCode(username);
  
        // Assert
        expect(result).toEqual(expectedResult);
        expect(mockAmplify.mockResendSignUpCode).toHaveBeenCalledWith({ username });
    });
  
    it('should throw an error for $errorType', async () => {
        // Arrange
        const expectedMessage = 'User not found';
        configureApiError(expectedMessage, 'UserNotFoundException');
        const expectedError = new Error(expectedMessage);
  
        // Act
        const action = AuthApi.resendEmailCode(username);
  
        // Assert
        await expect(action).rejects.toThrow(expectedError);
    });
  
    it('should throw a generic error for other cases', async () => {
        // Arrange
        configureApiError('Unexpected message', 'UnexpectedException');
        const expectedError = new Error('An unexpected error occurred while confirming email. Please try again later.');
  
        // Act
        const action = AuthApi.resendEmailCode(username);
  
        // Assert
        await expect(action).rejects.toThrow(expectedError);
    });
  });
  
  describe('signOut', () => {
    it('should sign out successfully', async () => {
        // Arrange
        mockAmplify.mockSignOut.mockResolvedValue(undefined);
        const expectedResult = { nextStep: 'NOT_AUTHENTICATED' };
  
        // Act
        const result = await AuthApi.signOut();
  
        // Assert
        expect(result).toEqual(expectedResult);
        expect(mockAmplify.mockSignOut).toHaveBeenCalled();
    });
  
    it('should throw a generic error for any exception', async () => {
        // Arrange
        mockAmplify.mockSignOut.mockRejectedValue(new Error('Unexpected error'));
        const expectedError = new Error('Something went wrong. Please try again later.');
  
        // Act
        const action = AuthApi.signOut();
  
        // Assert
        await expect(action).rejects.toThrow(expectedError);
        expect(mockAmplify.mockSignOut).toHaveBeenCalled();
    });
  });
  
  describe('getAccessToken', () => {
    it('should return the access token if it exists', async () => {
        // Arrange
        const mockSession = {
            tokens: {
                accessToken: {
                    payload: {},
                    toString: () => 'mockAccessToken'
                }
            }
        };
        mockAmplify.mockFetchAuthSession.mockResolvedValue(mockSession);
  
        // Act
        const result = await AuthApi.getAccessToken();
  
        // Assert
        expect(result).toEqual('mockAccessToken');
        expect(mockAmplify.mockFetchAuthSession).toHaveBeenCalled();
    });
  
    it('should return null if the access token does not exist', async () => {
        // Arrange
        const mockSession = {
            tokens: {
              accessToken: {
                payload: {},
                toString: () => ''
            }
            }
        };
        mockAmplify.mockFetchAuthSession.mockResolvedValue(mockSession);
  
        // Act
        const result = await AuthApi.getAccessToken();
  
        // Assert
        expect(result).toBeNull();
        expect(mockAmplify.mockFetchAuthSession).toHaveBeenCalled();
    });
  
    it('should throw an error if fetching the session fails', async () => {
        // Arrange
        const expectedError = new Error('Failed to fetch session');
        mockAmplify.mockFetchAuthSession.mockRejectedValue(expectedError);
  
        // Act
        const action = AuthApi.getAccessToken();
  
        // Assert
        await expect(action).rejects.toThrow(expectedError);
        expect(mockAmplify.mockFetchAuthSession).toHaveBeenCalled();
    });
  });
});