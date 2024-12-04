import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState, AppDispatch } from 'app/store'
import { AuthApi, AuthApiOutput } from './auth.api';
import { MockAuthApi } from './auth.api.mock';

const shouldMockAuthApi = process.env.REACT_APP_MOCK_AUTH_API === 'true';
export const API = shouldMockAuthApi ? MockAuthApi : AuthApi;

export type StatusType = 'NotAuthenticated' | 'Authenticated' | 'Loading' | 'ConfirmEmail' | 'NotInitialized' | 'ResetPassword';

export interface Credentials {
  username: string;
  password: string;
}

export interface AuthState {
    credentials: Credentials;
    status: StatusType;
    error: string;
}

const initialState: AuthState = {
    credentials: {
      username: '',
      password: '',
    },
    status: 'NotInitialized',
    error: '',
}

const dispatchNextStatus = (authApiOutput: AuthApiOutput, dispatch: AppDispatch) => {
  switch (authApiOutput.nextStep) {
    case 'RESET_PASSWORD':
        dispatch(setStatus('ResetPassword'));
        break;
    case 'CONFIRM_EMAIL':
        dispatch(setStatus('ConfirmEmail'));
        break;
    case 'DONE':
        dispatch(setStatus('Authenticated'));
        break;
    case 'NOT_AUTHENTICATED':
        dispatch(setStatus('NotAuthenticated'));
        break;
    default:
        dispatch(setStatus('NotAuthenticated'));
        dispatch(setError('Something went wrong, try it later.'));
        break;
  }
};

export const fetchInitialStatus = () => async (dispatch: AppDispatch) => {
  const accessToken = await API.getAccessToken();
  const status = accessToken ? 'Authenticated' : 'NotAuthenticated';
  dispatch(setStatus(status));
}

export const authenticateUser = (username: string, password: string) => async (dispatch: AppDispatch) => {
  try {
      dispatch(setStatus('Loading'));

      const result = await API.signIn({ username, password });

      dispatch(setCredentials({username, password}));

      dispatchNextStatus(result, dispatch);

  } catch (error: any) {
      dispatch(setStatus('NotAuthenticated'));
      dispatch(setError(error.message));
  }
};

export const registerUser = (username: string, password: string, passwordConfirmation: string, email: string) => async (dispatch: AppDispatch) => {
  try{

    if(password !== passwordConfirmation) {
      dispatch(setError('Passwords doesn\'t match.'));
      return;
    }
    
    dispatch(setStatus('Loading'));
    
    const result = await API.signUp({username, email, password });
    
    dispatchNextStatus(result, dispatch);

    dispatch(setCredentials({username, password }));
  
  } catch(error: any) {
    dispatch(setStatus('NotAuthenticated'));
    dispatch(setError(error.message));

  }
}

export const logoutUser = () => async (dispatch: AppDispatch) => {
  try {
      const result = await API.signOut();

      dispatch(setCredentials({username: '', password: ''}));

      dispatchNextStatus(result, dispatch);

  } catch (error: any) {
      dispatch(setError(error.message));
  }
};

export const resetPassword = (username: string) => async (dispatch: AppDispatch) => {
  try{
    
    dispatch(setStatus('Loading'));

    const result = await API.resetPassword({username});

    dispatch(setCredentials({username, password:''}));
    
    dispatchNextStatus(result, dispatch);
  
  } catch(error: any) {
    dispatch(setStatus('NotAuthenticated'));
    dispatch(setError(error.message));

  }
}

export const confirmResetPassword = (username: string, newPassword: string, confirmationCode: string) => async (dispatch: AppDispatch) => {
  try{
    
    dispatch(setStatus('Loading'));

    const result = await API.confirmPasswordCode({username, newPassword, confirmationCode});

    dispatchNextStatus(result, dispatch);
  
  } catch(error: any) {
    dispatch(setStatus('ResetPassword'));
    dispatch(setError(error.message));

  }
}

export const resendEmailCode = (username: string) => async (dispatch: AppDispatch) => {
  try{
    
    dispatch(setStatus('Loading'));

    const result = await API.resendEmailCode(username);
    
    dispatchNextStatus(result, dispatch);
  
  } catch(error: any) {
    dispatch(setStatus('ConfirmEmail'));
    dispatch(setError(error.message));

  }
}

export const confirmEmail = (confirmationCode: string) => async (dispatch: AppDispatch, getState: () => RootState) => {
  try{
    dispatch(setStatus('Loading'));

    const credentials = getState().auth.credentials;
    const username = credentials.username;
    const password = credentials.password;

    const result = await API.confirmEmail({username, password, confirmationCode});
    
    dispatchNextStatus(result, dispatch);
  
  } catch(error: any) {
    dispatch(setStatus('ConfirmEmail'));
    dispatch(setError(error.message));

  }
}

export const clearError = () => async (dispatch: AppDispatch) => {
  dispatch(setError(''));
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<Credentials>) => {
      state.credentials = action.payload;
    },
    setStatus: (state, action: PayloadAction<StatusType>) => {
      state.status = action.payload;

      if(action.payload !== 'NotAuthenticated') {
        state.error = '';
      }
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
  },
});

const { setStatus, setError, setCredentials } = authSlice.actions; 

export default authSlice.reducer;
