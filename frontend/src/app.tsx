import { NotFound, Home } from 'pages';
import { Routes, Route } from 'react-router-dom'
import { SignIn, SignUp, PrivateRoutes, EmailVerification, ForgotPassword } from "features/auth"
import AuthRoutes from 'features/auth/auth-routing.component';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route element={<PrivateRoutes />}>
          <Route path="/" element={<Home />}/>
        </Route>
        <Route element={<AuthRoutes />}>
          <Route path='/sign-in' element={<SignIn />}/>
          <Route path='/sign-up' element={<SignUp />}/>
          <Route path='/email-verification' element={<EmailVerification />}/>
          <Route path='/forgot-password' element={<ForgotPassword />}/>
        </Route>
        <Route path='*' element={<NotFound />}/>
      </Routes>
    </div>
  );
}

export default App;
