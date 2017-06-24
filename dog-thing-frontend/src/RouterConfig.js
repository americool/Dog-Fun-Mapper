import React from 'react';
import {HashRouter,
  Route, Switch
} from 'react-router-dom';
import MapView from './MapView'
import SignUp from './Signup'
import SignIn from './Signin'

const RouterConfig = () => (
  <HashRouter>
    <Switch>
      <Route exact path="/" component={MapView}/>
      <Route path="/signup" component={SignUp}/>
      <Route path="/signin" component={SignIn}/>
    </Switch>
  </HashRouter>
);

export default RouterConfig;
