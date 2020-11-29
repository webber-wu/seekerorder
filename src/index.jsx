import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, BrowserRouter } from 'react-router-dom';
import { StoreContext } from 'redux-react-hook';
import store from './redux/store';
import App from './App';

const AppRouter =
  process.env.DEMO === 'demo' ? (
    <HashRouter>
      <App />
    </HashRouter>
  ) : (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );

window.onload = () => {
  ReactDOM.render(
    <StoreContext.Provider value={store}>{AppRouter}</StoreContext.Provider>,
    document.getElementById('app')
  );
};
