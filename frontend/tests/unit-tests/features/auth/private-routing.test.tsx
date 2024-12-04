/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import PrivateRoutes from '../../../../src/features/auth/private-routing.component';
import reducer from '../../../../src/features/auth/auth.slice';
import { AuthApi } from '../../../../src/features/auth/auth.api';
import React, { act } from 'react';
import '@testing-library/jest-dom'

jest.mock('../../../../src/features/auth/auth.api', () => ({
  AuthApi: {
    getAccessToken: jest.fn(),
  }
}));

const mockGetAccessToken = AuthApi.getAccessToken as jest.MockedFunction<typeof AuthApi.getAccessToken>;

describe('PrivateRoutes', () => {
  const store = configureStore({
        reducer: {
            auth: reducer
        }
    });

  const Private = <h1>Private</h1>;
  const SignIn = <h1>SignIn</h1>;

  const component = 
    <Provider store={store}>
      <MemoryRouter initialEntries={['/private']}>
        <Routes>
          <Route element={<PrivateRoutes />}>
            <Route path="/private" element={Private} />
          </Route>
          <Route path="/sign-in" element={SignIn} />
        </Routes>
      </MemoryRouter>
  </Provider>

  it('renders private route when user is authenticated', async () => {
    // Arrange
    mockGetAccessToken.mockResolvedValue('asdjfijo43ij4ur9uu8^#sdf');;
    
    // Act
    await act(async () => render(component));
  
    // Assert
    expect(screen.getByRole('heading', { name: 'Private' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'SignIn' })).not.toBeInTheDocument();
  });

  it('renders SingIn route when user is not authenticated', async () => {
    // Arrange
    mockGetAccessToken.mockResolvedValue(null);

    // Act
    await act(async () => render(component));
  
    // Assert
    expect(screen.queryByRole('heading', { name: 'Private' })).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'SignIn' })).toBeInTheDocument();
  });
});
