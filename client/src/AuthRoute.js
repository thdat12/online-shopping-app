import React from 'react';
import { Route, Redirect } from 'react-router-dom';

function AuthRoute({ component: Component, ...rest }) {
  const token = localStorage.getItem('token');
  return (
    <Route
      {...rest}
      render={(props) => 
        !token ? <Redirect to="/login" /> : <Component {...props} />
      }
    />
  );
}

export default AuthRoute;