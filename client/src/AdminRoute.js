import React from 'react';
import { Route, Redirect } from 'react-router-dom';

function AdminRoute({ component: Component, ...rest }) {
  const isAdmin = localStorage.getItem('isAdmin');
  console.log(isAdmin)
  return (
    <Route
      {...rest}
      render={(props) =>
        isAdmin ? <Redirect to="/" exact/> : <Component {...props} />
      }
    />
  );
}

export default AdminRoute;