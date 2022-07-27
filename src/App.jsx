import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Home from './pageView/home';
import NotMatch from './pageView/404';
import './styles/styles.scss';

// console.log(process.env.DEV);

const App = () => (
  <div className="main">
    <Switch>
      <Route
        exact
        path={process.env.DEV ? '/' : '/seekerorder/'}
        component={Home}
      />
      <Route path="*" component={NotMatch} />
    </Switch>
  </div>
);

export default App;
