import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './app';
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux';
import { store } from 'app/store';
import configureCognito from 'features/cognito/cognito-configuration'

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

configureCognito();

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);