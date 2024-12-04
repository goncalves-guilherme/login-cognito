import reducer, { AuthState, fetchInitialStatus, authenticateUser, registerUser, resetPassword, confirmResetPassword, clearError } from '../../../../src/features/auth/auth.slice';
import { AuthApi } from '../../../../src/features/auth/auth.api';
import { configureStore } from '@reduxjs/toolkit';

function MockApi(){
    return {
        AuthApi: {
            getAccessToken: jest.fn(),
            signIn: jest.fn(),
            signUp: jest.fn(),
            resetPassword: jest.fn(),
            confirmPasswordCode: jest.fn(),
            confirmEmail: jest.fn(),
            resendEmailCode: jest.fn(),
            signOut: jest.fn(),
        }
    }
}

jest.mock('../../../../src/features/auth/auth.api', () => MockApi());

jest.mock('../../../../src/features/auth/auth.api.mock', () => MockApi());

describe('auth.slice', () => { 

    describe('Thunks', () => {
        let store = configureStore({
            reducer: {
              auth: reducer
            }
        });
    
        const mockGetAccessToken = AuthApi.getAccessToken as jest.MockedFunction<typeof AuthApi.getAccessToken>;
        const mockSignIn = AuthApi.signIn as jest.MockedFunction<typeof AuthApi.signIn>;
        const mockSignUp = AuthApi.signUp as jest.MockedFunction<typeof AuthApi.signUp>;
        const mockResetPassword = AuthApi.resetPassword as jest.MockedFunction<typeof AuthApi.resetPassword>;
        const mockConfirmPasswordCode = AuthApi.confirmPasswordCode as jest.MockedFunction<typeof AuthApi.confirmPasswordCode>;

        beforeEach(() => {
            store = configureStore({
                reducer: {
                  auth: reducer
                }
            });
        });

        afterEach(() => {
            jest.clearAllMocks();
        });

        describe('fetchInitialStatus', () => {
            it('should dispatch setStatus with Authenticated when access token is present', async () => {
                // Arrange
                mockGetAccessToken.mockResolvedValue('asdjfijo43ij4ur9uu8^#sdf');
                const expectedState: AuthState = { error: '', status: 'Authenticated', credentials: {username: '', password: ''} };
    
                // Act
                await fetchInitialStatus()(store.dispatch) 
    
                // Assert
                const actualState = store.getState().auth;
    
                expect(actualState).toEqual(expectedState);
                expect(mockGetAccessToken).toHaveBeenCalledWith();
            });
    
            it('should dispatch setStatus with NotAuthenticated when access token is not present', async () => {
                // Arrange
                mockGetAccessToken.mockResolvedValue(null);
                const expectedState: AuthState = { error: '', status: 'NotAuthenticated', credentials: {username: '', password: ''} };
    
                // Act
                await fetchInitialStatus()(store.dispatch);
    
                // Assert
                expect(store.getState().auth).toEqual(expectedState);
                expect(mockGetAccessToken).toHaveBeenCalledWith();
            });
        });

        describe('authenticateUser', () => {
            it('should dispatch setStatus with Authenticated when signIn returns DONE', async () => {
                // Arrange
                mockSignIn.mockResolvedValue({ nextStep: 'DONE' });
                const username = 'testuser';
                const password = 'testpassword';
                const expectedState: AuthState = { status: 'Authenticated', error: '', credentials: {username, password}};
    
                // Act
                await store.dispatch(authenticateUser(username, password));
    
                // Assert
                const actualState = store.getState().auth;
                expect(actualState).toEqual(expectedState);
                expect(mockSignIn).toHaveBeenCalledWith({ username, password });
            });
    
            it('should dispatch setStatus with ResetPassword when signIn returns RESET_PASSWORD', async () => {
                // Arrange
                mockSignIn.mockResolvedValue({ nextStep: 'RESET_PASSWORD' });
                const username = 'testuser';
                const password = 'testpassword';
                const expectedState: AuthState = { status: 'ResetPassword', error: '', credentials: {username, password} };
    
                // Act
                await store.dispatch(authenticateUser(username, password));
    
                // Assert
                const actualState = store.getState().auth;
                expect(actualState).toEqual(expectedState);
                expect(mockSignIn).toHaveBeenCalledWith({ username, password });
            });
    
            it('should dispatch setStatus with ConfirmEmail when signIn returns CONFIRM_EMAIL', async () => {
                // Arrange
                mockSignIn.mockResolvedValue({ nextStep: 'CONFIRM_EMAIL' });
                const username = 'testuser';
                const password = 'testpassword';
                const expectedState: AuthState = { status: 'ConfirmEmail', error: '', credentials: {username, password} };
    
                // Act
                await store.dispatch(authenticateUser(username, password));
    
                // Assert
                const actualState = store.getState().auth;
                expect(actualState).toEqual(expectedState);
                expect(mockSignIn).toHaveBeenCalledWith({ username, password });
            });
    
            it('should dispatch setStatus with NotAuthenticated and setError when signIn returns an unexpected nextStep', async () => {
                // Arrange
                mockSignIn.mockResolvedValue({ nextStep: 'UNKNOWN' });
                const username = 'testuser';
                const password = 'testpassword';
                const expectedState: AuthState = { status: 'NotAuthenticated', error: 'Something went wrong, try it later.', credentials: {username, password}};
    
                // Act
                await store.dispatch(authenticateUser(username, password));
    
                // Assert
                const actualState = store.getState().auth;
                expect(actualState).toEqual(expectedState);
                expect(mockSignIn).toHaveBeenCalledWith({ username, password });
            });
    
            it('should dispatch setError when signIn throws an error', async () => {
                // Arrange
                const errorMessage = 'Sign-in failed';
                mockSignIn.mockRejectedValue(new Error(errorMessage));
                const username = 'testuser';
                const password = 'testpassword';
                const expectedState: AuthState = { status: 'NotAuthenticated', error: errorMessage, credentials: {username:'', password:''}};
    
                // Act
                await store.dispatch(authenticateUser(username, password));
    
                // Assert
                const actualState = store.getState().auth;
                expect(actualState).toEqual(expectedState);
                expect(mockSignIn).toHaveBeenCalledWith({ username, password });
            });
        });

        describe('registerUser', () => {
            it('should dispatch setStatus with Authenticated when signUp returns DONE', async () => {
                // Arrange
                mockSignUp.mockResolvedValue({ nextStep: 'DONE' });
                const username = 'testuser';
                const password = 'testpassword';
                const email = 'testuser@example.com';
                const expectedState: AuthState = { status: 'Authenticated', error: '', credentials: { username, password } };
    
                // Act
                await store.dispatch(registerUser(username, password, password, email));
    
                // Assert
                const actualState = store.getState().auth;
                expect(actualState).toEqual(expectedState);
                expect(mockSignUp).toHaveBeenCalledWith({ username, email, password });
            });

            it('should dispatch setError if passwords doesnt match', async () => {
                // Arrange
                const username = 'testuser';
                const password = 'testpassword';
                const confirmPassword = password + 'NOT_THE_SAME';
                const email = 'testuser@example.com';
                const expectedState: AuthState = { status: 'NotInitialized', error: 'Passwords doesn\'t match.', credentials: { username:'', password:'' } };
    
                // Act
                await store.dispatch(registerUser(username, password, confirmPassword, email));
    
                // Assert
                const actualState = store.getState().auth;
                expect(actualState).toEqual(expectedState);
            });
    
            it('should dispatch setStatus with ConfirmEmail when signUp returns CONFIRM_EMAIL', async () => {
                // Arrange
                mockSignUp.mockResolvedValue({ nextStep: 'CONFIRM_EMAIL' });
                const username = 'testuser';
                const password = 'testpassword';
                const email = 'testuser@example.com';
                const expectedState: AuthState = { status: 'ConfirmEmail', error: '', credentials: {username, password} };
    
                // Act
                await store.dispatch(registerUser(username, password, password, email));
    
                // Assert
                const actualState = store.getState().auth;
                expect(actualState).toEqual(expectedState);
                expect(mockSignUp).toHaveBeenCalledWith({ username, email, password });
            });
    
            it('should dispatch setStatus with NotAuthenticated and setError when signUp returns an unexpected nextStep', async () => {
                // Arrange
                mockSignUp.mockResolvedValue({ nextStep: 'UNKNOWN' });
                const username = 'testuser';
                const password = 'testpassword';
                const email = 'testuser@example.com';
                const expectedState: AuthState = { status: 'NotAuthenticated', error: 'Something went wrong, try it later.', credentials: {username, password}};
    
                // Act
                await store.dispatch(registerUser(username, password, password, email));
    
                // Assert
                const actualState = store.getState().auth;
                expect(actualState).toEqual(expectedState);
                expect(mockSignUp).toHaveBeenCalledWith({ username, email, password });
            });
    
            it('should dispatch setError when signUp throws an error', async () => {
                // Arrange
                const errorMessage = 'Registration failed';
                mockSignUp.mockRejectedValue(new Error(errorMessage));
                const username = 'testuser';
                const password = 'testpassword';
                const email = 'testuser@example.com';
                const expectedState: AuthState = { status: 'NotAuthenticated', error: errorMessage, credentials: {username:'', password:''}};
    
                // Act
                await store.dispatch(registerUser(username, password, password,email));
    
                // Assert
                const actualState = store.getState().auth;
                expect(actualState).toEqual(expectedState);
                expect(mockSignUp).toHaveBeenCalledWith({ username, email, password });
            });
        });

        describe('resetPassword', () => {
            it('should dispatch setStatus with ResetPassword when resetPassword returns RESET_PASSWORD', async () => {
                // Arrange
                mockResetPassword.mockResolvedValue({ nextStep: 'RESET_PASSWORD' });
                const username = 'user1';
                const expectedState: AuthState = { status: 'ResetPassword', error: '', credentials: {username, password: ''} };
    
                // Act
                await store.dispatch(resetPassword(username));
    
                // Assert
                const actualState = store.getState().auth;
                expect(actualState).toEqual(expectedState);
                expect(mockResetPassword).toHaveBeenCalledWith({ username });
            });
    
            it('should dispatch setStatus with NotAuthenticated and setError when resetPassword returns an unexpected nextStep', async () => {
                // Arrange
                mockResetPassword.mockResolvedValue({ nextStep: 'UNKNOWN' });
                const username = 'user1';
                const expectedState: AuthState = { status: 'NotAuthenticated', error: 'Something went wrong, try it later.', credentials: {username, password: ''}};
    
                // Act
                await store.dispatch(resetPassword(username));
    
                // Assert
                const actualState = store.getState().auth;
                expect(actualState).toEqual(expectedState);
                expect(mockResetPassword).toHaveBeenCalledWith({ username });
            });
    
            it('should dispatch setError when resetPassword throws an error', async () => {
                // Arrange
                const errorMessage = 'Reset password failed';
                mockResetPassword.mockRejectedValue(new Error(errorMessage));
                const username = 'user1';
                const expectedState: AuthState = { status: 'NotAuthenticated', error: errorMessage, credentials: {username:'', password: ''}};
    
                // Act
                await store.dispatch(resetPassword(username));
    
                // Assert
                const actualState = store.getState().auth;
                expect(actualState).toEqual(expectedState);
                expect(mockResetPassword).toHaveBeenCalledWith({ username });
            });
        });

        describe('confirmResetPassword', () => {
            it('should dispatch setStatus with Authenticated when confirmPasswordCode returns DONE', async () => {
                // Arrange
                mockConfirmPasswordCode.mockResolvedValue({ nextStep: 'DONE' });
                const username = 'testuser@example.com';
                const newPassword = 'newpassword123';
                const confirmationCode = '123456';
                const expectedState: AuthState = { status: 'Authenticated', error: '', credentials: {username: '', password: ''}};
    
                // Act
                await store.dispatch(confirmResetPassword(username, newPassword, confirmationCode));
    
                // Assert
                const actualState = store.getState().auth;
                expect(actualState).toEqual(expectedState);
                expect(mockConfirmPasswordCode).toHaveBeenCalledWith({ username, newPassword, confirmationCode });
            });
    
            it('should dispatch setStatus with ResetPassword when confirmPasswordCode returns RESET_PASSWORD', async () => {
                // Arrange
                mockConfirmPasswordCode.mockResolvedValue({ nextStep: 'RESET_PASSWORD' });
                const username = 'testuser@example.com';
                const newPassword = 'newpassword123';
                const confirmationCode = '123456';
                const expectedState: AuthState = { status: 'ResetPassword', error: '', credentials: {username: '', password: ''} };
    
                // Act
                await store.dispatch(confirmResetPassword(username, newPassword, confirmationCode));
    
                // Assert
                const actualState = store.getState().auth;
                expect(actualState).toEqual(expectedState);
                expect(mockConfirmPasswordCode).toHaveBeenCalledWith({ username, newPassword, confirmationCode });
            });
    
            it('should dispatch setStatus with NotAuthenticated and setError when confirmPasswordCode returns an unexpected nextStep', async () => {
                // Arrange
                mockConfirmPasswordCode.mockResolvedValue({ nextStep: 'UNKNOWN' });
                const username = 'testuser@example.com';
                const newPassword = 'newpassword123';
                const confirmationCode = '123456';
                const expectedState: AuthState = { status: 'NotAuthenticated', error: 'Something went wrong, try it later.', credentials: {username: '', password: ''} };
    
                // Act
                await store.dispatch(confirmResetPassword(username, newPassword, confirmationCode));
    
                // Assert
                const actualState = store.getState().auth;
                expect(actualState).toEqual(expectedState);
                expect(mockConfirmPasswordCode).toHaveBeenCalledWith({ username, newPassword, confirmationCode });
            });
    
            it('should dispatch setError when confirmPasswordCode throws an error', async () => {
                // Arrange
                const errorMessage = 'Password reset confirmation failed';
                mockConfirmPasswordCode.mockRejectedValue(new Error(errorMessage));
                const username = 'testuser@example.com';
                const newPassword = 'newpassword123';
                const confirmationCode = '123456';
                const expectedState: AuthState = { status: 'ResetPassword', error: errorMessage, credentials: {username: '', password: ''}};
    
                // Act
                await store.dispatch(confirmResetPassword(username, newPassword, confirmationCode));
    
                // Assert
                const actualState = store.getState().auth;
                expect(actualState).toEqual(expectedState);
                expect(mockConfirmPasswordCode).toHaveBeenCalledWith({ username, newPassword, confirmationCode });
            });
        });

        describe('clearError', () => {
            it('should dispatch setError with an empty string', async () => {
                // Arrange
                const errorMessage = 'Reset password failed';
                mockResetPassword.mockRejectedValue(new Error(errorMessage));
                await store.dispatch(resetPassword("user1"));
                const firstError = store.getState().auth.error;
        
                // Act
                await clearError()(store.dispatch);
        
                // Assert
                const actualError = store.getState().auth.error;
                expect(firstError).toEqual(errorMessage);
                expect(actualError).toEqual('');
            });
        });
    });
});
