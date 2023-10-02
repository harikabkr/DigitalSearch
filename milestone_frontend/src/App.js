import React from 'react'

import {BrowserRouter as Router, Route,Routes, Switch} from "react-router-dom"
import { LoginPage } from './Pages/LoginPage';
import { RegisterPage } from './Pages/RegisterPage';
import { HomePage } from './Pages/Homepage'
// import { NavigationBar } from './Pages/NavigationBar';
import { AuthProvider } from './Context/userAuthContext'
import { NavigationBar } from './components/NavigationBar';
import { MultiFactor } from './Pages/MultiFactor';
import { LandingPage } from './Pages/LandingPage';
import { Settings } from './Pages/Settings';
import { Profile } from './Pages/Profile';
import { QrCodeViewer } from './Pages/QrCodeViewer';
import { RequestPasswordReset } from './Pages/ForgotPassword/RequestPasswordReset';
import { ConfirmPasswordReset } from './Pages/ForgotPassword/ConfirmPasswordReset';


function App() {
  return (
    <Router>
    <AuthProvider>
      < NavigationBar/> 
      {/* <Switch> */}
        {/* <PrivateRoute component={Dashboard} path="/dashboard" exact /> */}
        <Routes>
          <Route element={<RegisterPage />} path="/register" />
          <Route element={<LoginPage />} path="/login" />
          
          <Route element={<MultiFactor/>} path = "/2factorauth"/>
          
          <Route element={<RequestPasswordReset/>} path="/forgotPassword" />
          <Route element={<ConfirmPasswordReset />} path="/api/password-reset/:uidb64/:token"/>

          <Route element={<HomePage/>} path="/dashboard"/>
          <Route element={<Settings />} path = "/settings"/>
          <Route element={<Profile />} path = "/profile"/>

          <Route element={<QrCodeViewer />} path="/media/qrcode/:id"/>
          <Route element ={<HomePage />} path = "/"/>
        </Routes>
      {/* </Switch> */}
      {/* <LoginPage/> */}
    </AuthProvider>
  </Router>
  );
}

export default App;
