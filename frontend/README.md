# Login System with Cognito Integration

# Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Configuration](#environment-configuration)
   - [Example `.env` File Configuration](#example-env-file-configuration)
3. [Running the Application](#running-the-application)
   - [On Linux or macOS](#on-linux-or-macos)
   - [On Windows](#on-windows)
4. [Run Tests](#run-tests)
5. [Building the Application](#building-the-application)
6. [Application Architecture](#application-architecture)
   - [State Management with Redux](#state-management-with-redux)
   - [Reducer Logic](#reducer-logic)
   - [UI Rendering Logic](#ui-rendering-logic)
   - [API Logic](#api-logic)
---

This project implements a login system that connects to AWS Cognito for user authentication. It also supports a mock authentication API for development purposes.

**Warning:** This project was used for testing and learning new tools. It is not ready to be used for production.

**Warning:** The Makefile uses Linux commands, so it may not work properly on Windows.


## Prerequisites

Before running the application, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (LTS version recommended)
- npm (comes with Node.js)
- A terminal or command-line interface
- AWS CLI should be configured with a default profile (in case you want to use the Makefile to deploy the build folder to an S3 bucket).

---

## Environment Configuration

The application requires `.env` and `.env.production` configuration files for environment-specific settings.

### Example `.env` File Configuration

```env
REACT_APP_COGNITO_REGION={THE_REGION_OF_YOUR_CONGITO_INSTANCE}
REACT_APP_USER_POOL_WEB_CLIENT_ID={THE_CLIENT_ID_OF_YOUR_COGNITO_INSTANCE}
REACT_APP_USER_POOL_ID={THE_USER_POOL_ID}
REACT_APP_MOCK_AUTH_API={TRUE_TO_MOCK_COGNITO_CALLS}
REACT_APP_COGNITO_COOKIE_DOMAIN = {YOUR_COOKIE_DOMAIN}
REACT_APP_COGNITO_COOKIE_SECURE = {SET_FALSE_IN_DEVELOPMENT}
```

- REACT_APP_COGNITO_REGION: AWS region where your Cognito user pool is hosted.
- REACT_APP_USER_POOL_WEB_CLIENT_ID: The web client ID for your Cognito User Pool.
- REACT_APP_USER_POOL_ID: The Cognito User Pool ID.
- REACT_APP_MOCK_AUTH_API: Set to true to use a mock authentication API instead of Cognito (useful for local development). Set to false or omit it to use the real Cognito authentication API.
- REACT_APP_COGNITO_COOKIE_DOMAIN: The domain the cookie will be stored;
- REACT_APP_COGNITO_COOKIE_SECURE: Setting the secure cookie attribute to true will prevent browsers from sending cookies over an insecure connection. For local development, it is more convenient to set it to false.

## Running the Application
Follow the steps below to run the application:

### On Linux or macOS:
1. Create the .env in the root folder:

```bash
touch .env
```

2. Add Configuration: Edit the .env file to include the configurations described above.

3. Install dependencies

```bash
npm install
```

4. Start the Application:

```bash
npm run start
```

### On windows

1. Create the .env File: Open the terminal or file explorer, and create a new file named .env in the root directory.

2. Add Configuration: Edit the .env file using a text editor (e.g., Notepad) and add the configurations described above.

3. Install dependencies

```bash
npm install
```

4. Start the Application:

```bash
npm run start
```

## Run Tests

To ensure that your application is working correctly, you should run the tests. Follow the steps below to run tests in your local development environment:

1. Make sure you have all the necessary dependencies installed before running tests. In your project directory, run:

```bash
npm install
```

2. Run tests:

```bash
npm run test
```

## Building the Application
To build the application for production, use the following command:

1. Create a .env.production file in the root folder and add your production settings.

2. Build the application:

```bash
npm run build
```

This will create an optimized build of your application in the build/ directory, ready for deployment.

If now .env.production exists .env will be used.

You also have a Makefile with a deploy command that will automatically clean any previous build folder, rebuild it, clear the S3 bucket, and then deploy the new changes to the S3 bucket.

## Application Architecture

This section outlines the architecture of the application, including how the front-end interacts with the API, handles authentication, and structures business logic.

The Redux component manages the global application state. The reducer handles state changes based on API responses and exposes thunk methods for asynchronous UI interactions. The UI calls thunk methods and listens for state changes and updates accordingly.


### State Management with Redux

The front-end leverages Redux to manage the authentication state and control what to render. The state is initialized as follows:

```javascript
const initialState: AuthState = {
  credentials: {
    username: '',
    password: '',
  },
  status: 'NotInitialized',
  error: '',
};
```

The possible states of the authentication are:

- **NotAuthenticated**: The user is not authenticated, and no access token is stored in the browser.
- **Authenticated**: The user is authenticated, and an access token is stored in the browser.
- **Loading**: The user has triggered an asynchronous API call, and the loading state is set while waiting for the response (used for loading screens in the UI).
- **ConfirmEmail**: The user needs to confirm their email after registration.
- **ResetPassword**: The user is in the process of resetting their password. This state is triggered after requesting a code to be sent to their email for password reset.
- **NotInitialized**: This state is used to prevent rendering until the slice checks if the user is authenticated or not. This prevents issues where a previously authenticated user could see a brief page transition (like from /sign-in to /).

#### Reducer Logic
The Redux reducer is solely responsible for updating the state based on the responses or errors from the API calls. The reducer ensures that the UI reacts to the different authentication states accordingly.

#### UI Rendering Logic
The UI components determine what to render based on the authentication state stored in the Redux store, ensuring a responsive user experience. The UI does not handle state changes directly; instead, it requests the reducer to execute logic, and the reducer updates the state accordingly.

There is two routes components;
- **Private Routing**: Certain routes are protected and only accessible if the user is authenticated. This is managed through the private-routing.component.tsx.
- **Auth Routing**: The auth-routing.component.tsx is responsible for controlling which routing should be displayed based on the current authentication state from Redux.

#### API Logic

The API is exposed through an interface to allow easy mocking of the Cognito API connection. This makes it simpler to test the application in a local development environment without needing a real connection to Cognito.

- **Mocking with `localStorage`**: The mock API uses `localStorage` to persist data across page refreshes, ensuring that the authentication state remains consistent during local testing. You can user a user1 with password 123 to test login or create a new account if you want it.
- **Authentication Provider**: The API maps the Cognito authentication state to the domain state of the application. This approach provides flexibility, meaning that if the authentication provider needs to change in the future, only the mapping logic needs to be updated, leaving the rest of the application untouched.
