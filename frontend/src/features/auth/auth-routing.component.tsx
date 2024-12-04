import React, { useEffect } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from 'app/hooks'
import { fetchInitialStatus, clearError } from './auth.slice';
import ResetPassword from './reset-password.component';

const AuthRoutes: React.FC  = () => {
  const status = useAppSelector(state => state.auth.status);

  const dispatch = useAppDispatch();

  const location = useLocation();
  const isEmailVerificationPath = location.pathname === '/email-verification';
  const isResetPasswordPath = location.pathname === '/reset-password';

  useEffect(() => {

    dispatch(fetchInitialStatus());
  
  }, [dispatch]);

  useEffect(() => {

    dispatch(clearError());

  }, [location.pathname, dispatch]);

  switch(status) {
    case 'NotInitialized':
      return null;
    case 'ConfirmEmail': {
      // If redux state changed to ConfirmEmail and we still in /signin then we need to be redirected to /email-verification
      // If redux state is ConfirmEmail and we are in /email-verification we need to return the current component already rendered
      const isConfirmEmailNewState = !isEmailVerificationPath;
      return isConfirmEmailNewState ? <Navigate to="/email-verification" /> : <Outlet />
    }
    case 'ResetPassword': {
      const isPasswordResetNewState = !isResetPasswordPath;
      return isPasswordResetNewState ? <ResetPassword/> : <Outlet />
    }
    case 'Authenticated':
      return <Navigate to="/" />
    case 'Loading':
      return <Outlet />
    case 'NotAuthenticated': {
      // Blocks any direct access to email verification by redirect user to singin component.
      return isEmailVerificationPath ? <Navigate to="/sign-in" /> : <Outlet />
    }
  }
};

export default AuthRoutes;
