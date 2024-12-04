import React, { useEffect } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { fetchInitialStatus } from './auth.slice';

const PrivateRoutes: React.FC  = () => {
  const status = useAppSelector(state => state.auth.status);

  const dispatch = useAppDispatch();

  useEffect(() => {

    dispatch(fetchInitialStatus());
  
  }, [dispatch]);

  if(status === 'NotInitialized') {
    return null;
  }

  return status === 'Authenticated' ? <Outlet /> : <Navigate to="/sign-in" />;
};

export default PrivateRoutes;
