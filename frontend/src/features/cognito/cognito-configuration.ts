import { Amplify } from 'aws-amplify';
import { cognitoUserPoolsTokenProvider } from 'aws-amplify/auth/cognito';
import { CookieStorage } from 'aws-amplify/utils';

export default function configureCognito()
{
    Amplify.configure({
        Auth: {
          Cognito: {
            userPoolClientId: process.env.REACT_APP_USER_POOL_WEB_CLIENT_ID ?? "",
            userPoolId: process.env.REACT_APP_USER_POOL_ID ?? "",
          },
        }
      });
      
      cognitoUserPoolsTokenProvider.setKeyValueStorage(new CookieStorage({
        domain: process.env.REACT_APP_COGNITO_COOKIE_DOMAIN,
        path: "/",
        expires: 4,
        sameSite: "lax",
        secure: process.env.REACT_APP_COGNITO_COOKIE_SECURE == "true"
      }));
}