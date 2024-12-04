/**
 * @jest-environment jsdom
 */
import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import AuthRoutes from '../../../../src/features/auth/auth-routing.component';
import reducer, { StatusType } from '../../../../src/features/auth/auth.slice';
import React, { act } from 'react';
import '@testing-library/jest-dom';

jest.mock('../../../../src/features/auth/auth.api', () => ({
  AuthApi: {
    getAccessToken: jest.fn(),
  }
}));

describe('AuthRoutes', () => {
  const store = configureStore({
    reducer: {
      auth: reducer
    }
  });

  const Home = <h1>Home</h1>;
  const SignIn = <h1>SignIn</h1>;
  const EmailVerification = <h1>EmailVerification</h1>;

  const component = (initialEntries: string[]) => {
    return render(
      <Provider store={store}>
        <MemoryRouter initialEntries={initialEntries}>
          <Routes>
            <Route path="/" element={Home} />
            <Route element={<AuthRoutes />}>
              <Route path="/sign-in" element={SignIn} />
              <Route path="/email-verification" element={EmailVerification} />
            </Route>
          </Routes>
        </MemoryRouter>
      </Provider>
    );
  };

  function mockGetState(status: StatusType){
    store.getState = () => ({
        auth: {
            status,
            credentials: {
              username: '',
              password: '',
            },
            error: ''
        },
      });
  }

  it('redirects to /email-verification if status is ConfirmEmail and not on /email-verification path', () => {
    // Arrange
    mockGetState('ConfirmEmail');

    // Act
    component(['/sign-in']);

    // Assert
    expect(screen.getByText('EmailVerification')).toBeInTheDocument();
  });

  it('renders EmailVerification component if status is ConfirmEmail and on /email-verification path', () => {
    // Arrange
    mockGetState('ConfirmEmail');

    // Act
    component(['/email-verification']);

    // Assert
    expect(screen.getByText('EmailVerification')).toBeInTheDocument();
  });

  it('redirects to / if status is Authenticated', () => {
    // Arrange
    mockGetState('Authenticated');

    // Act
    component(['/sign-in']);

    // Assert
    expect(screen.getByText('Home')).toBeInTheDocument();
  });

  it('renders null if status is NotInitialized', () => {
    // Arrange
    mockGetState('NotInitialized');

    // Act
    const { container } = component(['/sign-in']);

    // Assert
    expect(container.firstChild).toBeNull();
  });

  it('renders SignIn component if status is NotAuthenticated and not trying to access /email-verification', () => {
    // Arrange
    mockGetState('NotAuthenticated');

    // Act
    component(['/sign-in']);

    // Assert
    expect(screen.getByText('SignIn')).toBeInTheDocument();
  });

  it('redirects to /sign-in if status is NotAuthenticated and trying to access /email-verification', () => {
    // Arrange
    mockGetState('NotAuthenticated');

    // Act
    component(['/email-verification']);

    // Assert
    expect(screen.getByText('SignIn')).toBeInTheDocument();
  });

  it('renders current component if status is Loading', () => {
    // Arrange
    mockGetState('Loading');

    // Act
    component(['/sign-in']);

    // Assert
    expect(screen.getByText('SignIn')).toBeInTheDocument();
  });

  it('clears the error when the component mounts', async () => {
    // Arrange
    const clearErrorSpy = jest.spyOn(
      require('../../../../src/features/auth/auth.slice'), 
      'clearError');
  
    // Act
    act(() => { // We need to wrap this call on act to make sure all pending useEffects are called. useEffect is responsible to clear error.
      component(['/sign-in']);
    });
  
    // Assert
    await waitFor(() => {
      expect(clearErrorSpy).toHaveBeenCalledTimes(1);
    });
  
    // Cleanup the spy
    clearErrorSpy.mockRestore();
  });
});