import { composeWithDevTools } from 'redux-devtools-extension';
import { createStore, compose, applyMiddleware } from 'redux';
import { createEpicMiddleware } from 'redux-observable';
import { rootEpic, rootReducer } from './modules/root';

const epicMiddleware = createEpicMiddleware();

function configureStore() {
  let store;
  if (process.env.NODE_ENV !== 'production') {
    store = createStore(
      rootReducer,
      compose(composeWithDevTools(applyMiddleware(epicMiddleware)))
    );
  } else {
    store = createStore(rootReducer, applyMiddleware(epicMiddleware));
  }

  epicMiddleware.run(rootEpic);
  return store;
}

const store = configureStore();
export default store;
