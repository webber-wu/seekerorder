import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Home from './pageView/home';
import NotMatch from './pageView/404';
import './styles/styles.scss';

const App = () => (
  <div className="main">
    <Switch>
      <Route exact path="/" component={Home} />
      <Route path="*" component={NotMatch} />
    </Switch>
  </div>
);

export default App;
