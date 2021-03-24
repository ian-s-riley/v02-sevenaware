/*!

=========================================================
* Material Dashboard PRO React - v1.9.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-pro-react
* Copyright 2020 Creative Tim (https://www.creative-tim.com)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React, {useEffect, useState} from "react";
import { createBrowserHistory } from "history";
import { Router, Route, Switch, Redirect } from "react-router-dom";
import { Auth, Hub } from 'aws-amplify'

import AuthLayout from "layouts/Auth.js";
import AdminLayout from "layouts/Admin.js";
import ProtectedRoute from './ProtectedRoute';

import "assets/scss/material-dashboard-pro-react.scss?v=1.9.0";
const hist = createBrowserHistory();

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(true)

    useEffect(() => {
        Hub.listen('auth', (data) => {
          const { payload } = data
          console.log('A new auth event has happened: ', data)
           if (payload.event === 'signIn') {
            //setIsAuthenticated(true)
             //checkUser()
           }
           if (payload.event === 'signOut') {
             console.log('a user has signed out!')
             //setIsAuthenticated(false)
             //checkUser()
           }
        })
      }, [])

      useEffect(() => {
        checkUser()
      }, [])

      async function checkUser() {
        try {
            const thisUser = await Auth.currentAuthenticatedUser().then(
            setIsAuthenticated(true))
          } catch (error) {
              console.log('error signing in', error)
          }                 
      }

    return (
    <Router history={hist}>
    {isAuthenticated ? (
      <Switch>        
        <Route path="/admin" component={AdminLayout} />
        <Route path="/auth" component={AuthLayout} />
        <Redirect from="/" to="/admin/dashboard" />
      </Switch>
    ) : (
      <Switch>
        <Route path="/auth" component={AuthLayout} />
        <Redirect from="/" to="/auth/login-page" />
      </Switch>
    )}    
  </Router>
  );
}

export default App;
