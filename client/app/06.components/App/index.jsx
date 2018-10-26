import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import axios from 'axios';

import NoMatch from 'Components/404';
import Home from 'Components/Home';
import Login from 'Components/Login';
import Dashboard from 'Components/Dashboard';

const authUser = async () => {
  try {
    const data = await axios
      .get('http://localhost:9009/api/v1/user/current');
    console.log('-------------------------', data);
    return data;
    
  } catch(err) {
    console.error('----------ERROR', err);
    return false;
  }
};

const App = () => {
  return (
    <Switch>
      <Route path="/" exact component={Home} />
      <Route path="/login" component={Login} />
      <Route
        path="/dashboard"
        render={() => (authUser() ? <Dashboard /> : <Redirect to="/login" />)}
      />
      <Route component={NoMatch} />
    </Switch>
  );
};

export default App;
